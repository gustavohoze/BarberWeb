package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/stripe/stripe-go/v79"
	"github.com/stripe/stripe-go/v79/checkout/session"
	"github.com/stripe/stripe-go/v79/webhook"
)

// servicePrices maps service IDs to amounts in cents
var servicePrices = map[string]int64{
	"executive-cut":   4500, // $45.00
	"masters-shave":   3500, // $35.00
	"beard-sculpting": 2500, // $25.00
	"full-works":      7500, // $75.00
}

// CheckoutSessionRequest is the body sent from the frontend
type CheckoutSessionRequest struct {
	CustomerName  string `json:"customerName"`
	CustomerEmail string `json:"customerEmail"`
	CustomerPhone string `json:"customerPhone"`
	ServiceID     string `json:"service"`
	ServiceName   string `json:"serviceName"`
	Barber        string `json:"barber"`
	Date          string `json:"date"`
	Time          string `json:"time"`
}

// CheckoutSessionResponse is returned to the frontend
type CheckoutSessionResponse struct {
	CheckoutURL string `json:"checkoutUrl"`
	SessionID   string `json:"sessionId"`
}

// initStripe configures the Stripe SDK from the environment variable
func initStripe() {
	key := os.Getenv("STRIPE_SECRET_KEY")
	if key == "" {
		log.Fatal("STRIPE_SECRET_KEY is not set in .env")
	}
	stripe.Key = key
	log.Println("✓ Stripe initialized")
}

// sendJSONError sends a JSON formatted error response
func sendJSONError(w http.ResponseWriter, message string, code int) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(map[string]string{"error": message})
}

// handleCreateCheckoutSession creates a Stripe Checkout Session and returns the hosted URL
func handleCreateCheckoutSession(w http.ResponseWriter, r *http.Request) {
	log.Printf("→ Received request: %s %s", r.Method, r.URL.Path)

	if r.Method != http.MethodPost {
		sendJSONError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req CheckoutSessionRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		log.Printf("Error decoding request: %v", err)
		sendJSONError(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	log.Printf("  Booking info: %s (%s) for %s", req.CustomerName, req.CustomerEmail, req.ServiceName)

	// Validate required fields
	if req.CustomerEmail == "" || req.ServiceID == "" || req.ServiceName == "" {
		sendJSONError(w, "Missing required fields: email or service selection", http.StatusBadRequest)
		return
	}
	if req.Date == "" || req.Time == "" || req.Barber == "" {
		sendJSONError(w, "Missing required fields: date, time, or barber", http.StatusBadRequest)
		return
	}

	// Look up price
	price, ok := servicePrices[req.ServiceID]
	if !ok {
		log.Printf("  Error: Unknown service ID: %s", req.ServiceID)
		sendJSONError(w, "Unknown service selected", http.StatusBadRequest)
		return
	}

	if ok, reason, _, err := isSlotAvailable(req.Date, req.Time, req.Barber, ""); err != nil {
		log.Printf("  Error checking availability: %v", err)
		sendJSONError(w, "Could not check availability", http.StatusInternalServerError)
		return
	} else if !ok {
		sendJSONError(w, reason, http.StatusConflict)
		return
	}

	origin := r.Header.Get("Origin")
	if origin == "" {
		origin = "http://localhost:5174" // Fallback
	}

	// Create a pending booking immediately to reserve the slot
	// This prevents race conditions where two users can book the same slot
	pendingBooking := &Booking{
		CustomerName:  req.CustomerName,
		CustomerEmail: req.CustomerEmail,
		CustomerPhone: req.CustomerPhone,
		Service:       req.ServiceID,
		Barber:        req.Barber,
		Date:          req.Date,
		Time:          req.Time,
		Status:        "pending",
	}

	if err := CreateBooking(pendingBooking); err != nil {
		log.Printf("  Error creating pending booking: %v", err)
		sendJSONError(w, "Failed to reserve slot", http.StatusInternalServerError)
		return
	}

	log.Printf("✓ Pending booking created: %s for %s on %s at %s", 
		req.ServiceName, req.CustomerName, req.Date, req.Time)

	// Build Checkout Session params
	params := &stripe.CheckoutSessionParams{
		CustomerEmail: stripe.String(req.CustomerEmail),
		LineItems: []*stripe.CheckoutSessionLineItemParams{
			{
				PriceData: &stripe.CheckoutSessionLineItemPriceDataParams{
					Currency: stripe.String("usd"),
					ProductData: &stripe.CheckoutSessionLineItemPriceDataProductDataParams{
						Name: stripe.String(req.ServiceName),
						Description: stripe.String(
							fmt.Sprintf("Appointment with %s on %s at %s", req.Barber, req.Date, req.Time),
						),
					},
					UnitAmount: stripe.Int64(price),
				},
				Quantity: stripe.Int64(1),
			},
		},
		Mode: stripe.String(string(stripe.CheckoutSessionModePayment)),
		PaymentIntentData: &stripe.CheckoutSessionPaymentIntentDataParams{
			ReceiptEmail: stripe.String(req.CustomerEmail),
		},
		SuccessURL: stripe.String(origin + "/booking/success?session_id={CHECKOUT_SESSION_ID}"),
		CancelURL:  stripe.String(origin + "/booking?cancelled=true"),
		Metadata: map[string]string{
			"customerName":  req.CustomerName,
			"customerPhone": req.CustomerPhone,
			"service":       req.ServiceName,
			"barber":        req.Barber,
			"date":          req.Date,
			"time":          req.Time,
			"bookingID":     pendingBooking.ID,
		},
	}

	s, err := session.New(params)
	if err != nil {
		log.Printf("⚠ Stripe session creation failed: %v", err)
		sendJSONError(w, fmt.Sprintf("Stripe error: %v", err), http.StatusInternalServerError)
		return
	}

	log.Printf("✓ Checkout session created: %s", s.ID)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(CheckoutSessionResponse{
		CheckoutURL: s.URL,
		SessionID:   s.ID,
	})
}

// handleStripeWebhook processes events forwarded by the Stripe CLI (or Stripe in production)
func handleStripeWebhook(w http.ResponseWriter, r *http.Request) {
	const maxBodyBytes = int64(65536)
	r.Body = http.MaxBytesReader(w, r.Body, maxBodyBytes)

	payload, err := io.ReadAll(r.Body)
	if err != nil {
		log.Printf("Webhook: failed to read body: %v", err)
		http.Error(w, `{"error":"unable to read request body"}`, http.StatusBadRequest)
		return
	}

	webhookSecret := os.Getenv("STRIPE_WEBHOOK_SECRET")

	// When STRIPE_WEBHOOK_SECRET is the placeholder, skip signature verification
	// (useful for quick testing before running `stripe listen`)
	var event stripe.Event
	if webhookSecret == "" || webhookSecret == "whsec_YOUR_WEBHOOK_SECRET" {
		log.Println("⚠ Webhook: no secret set — skipping signature verification (dev only)")
		if err := json.Unmarshal(payload, &event); err != nil {
			http.Error(w, `{"error":"invalid JSON"}`, http.StatusBadRequest)
			return
		}
	} else {
		sig := r.Header.Get("Stripe-Signature")
		event, err = webhook.ConstructEventWithOptions(payload, sig, webhookSecret, webhook.ConstructEventOptions{
			IgnoreAPIVersionMismatch: true,
		})
		if err != nil {
			log.Printf("Webhook signature verification failed: %v", err)
			sendJSONError(w, "webhook signature mismatch", http.StatusBadRequest)
			return
		}
	}

	log.Printf("✓ Webhook received: %s", event.Type)

	// Handle the checkout.session.completed event
	if event.Type == "checkout.session.completed" {
		var s stripe.CheckoutSession
		if err := json.Unmarshal(event.Data.Raw, &s); err != nil {
			log.Printf("Webhook: failed to parse session: %v", err)
			http.Error(w, `{"error":"failed to parse session"}`, http.StatusBadRequest)
			return
		}

		bookingID := s.Metadata["bookingID"]
		if bookingID == "" {
			log.Printf("Webhook: missing bookingID in metadata")
			w.WriteHeader(http.StatusOK)
			return
		}

		// Update the pending booking to confirmed
		if err := UpdateBookingStatus(bookingID, "confirmed"); err != nil {
			log.Printf("Webhook: failed to confirm booking: %v", err)
			// Still return 200 to Stripe so it doesn't retry
			w.WriteHeader(http.StatusOK)
			return
		}

		log.Printf("✓ Booking confirmed via Stripe: %s for %s on %s at %s",
			s.Metadata["service"], s.Metadata["customerName"], s.Metadata["date"], s.Metadata["time"])
	}

	// Handle checkout.session.expired to cancel pending booking
	if event.Type == "checkout.session.expired" {
		var s stripe.CheckoutSession
		if err := json.Unmarshal(event.Data.Raw, &s); err != nil {
			log.Printf("Webhook: failed to parse session for expiry: %v", err)
			w.WriteHeader(http.StatusOK)
			return
		}

		bookingID := s.Metadata["bookingID"]
		if bookingID == "" {
			log.Printf("Webhook: missing bookingID in expired session")
			w.WriteHeader(http.StatusOK)
			return
		}

		// Cancel the pending booking
		if err := UpdateBookingStatus(bookingID, "cancelled"); err != nil {
			log.Printf("Webhook: failed to cancel expired booking: %v", err)
			// Still return 200 to Stripe so it doesn't retry
			w.WriteHeader(http.StatusOK)
			return
		}

		log.Printf("✓ Pending booking cancelled due to checkout expiry: %s for %s on %s at %s",
			s.Metadata["service"], s.Metadata["customerName"], s.Metadata["date"], s.Metadata["time"])
	}

	w.WriteHeader(http.StatusOK)
}
