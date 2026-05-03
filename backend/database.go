package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"strings"
	"time"
)

var supabaseURL string
var supabaseKey string

// InitDB initializes the database connection via Supabase REST API
func InitDB() error {
	supabaseURL = os.Getenv("SUPABASE_URL")
	supabaseKey = os.Getenv("SUPABASE_KEY")

	if supabaseURL == "" || supabaseKey == "" {
		fmt.Println("⚠ Running in DB-Mock mode (SUPABASE_URL or SUPABASE_KEY missing)")
		return nil
	}

	fmt.Println("✓ Connected to Supabase via REST API")
	return nil
}

// helper to send REST requests to Supabase
func supabaseRequest(method, endpoint string, body interface{}) ([]byte, error) {
	if supabaseURL == "" || supabaseKey == "" {
		return nil, fmt.Errorf("mock db: operation skipped")
	}

	var reqBody io.Reader
	if body != nil {
		jsonBody, _ := json.Marshal(body)
		reqBody = bytes.NewBuffer(jsonBody)
	}

	url := fmt.Sprintf("%s/rest/v1/%s", supabaseURL, endpoint)
	req, err := http.NewRequest(method, url, reqBody)
	if err != nil {
		return nil, err
	}

	req.Header.Set("apikey", supabaseKey)
	req.Header.Set("Authorization", "Bearer "+supabaseKey)
	req.Header.Set("Content-Type", "application/json")
	if method == "POST" || method == "PATCH" {
		req.Header.Set("Prefer", "return=representation")
	}

	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	respData, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	if resp.StatusCode >= 400 {
		return nil, fmt.Errorf("supabase api error %d: %s", resp.StatusCode, string(respData))
	}

	return respData, nil
}

// CreateBooking inserts a new booking into Supabase
func CreateBooking(booking *Booking) error {
	if booking.ID == "" {
		booking.ID = generateBookingID()
	}
	booking.CreatedAt = time.Now()

	// Ensure date/time fallback
	if booking.Date == "" {
		booking.Date = time.Now().Format("2006-01-02")
	}
	if booking.Time == "" {
		booking.Time = time.Now().Format("15:04")
	}

	type SupabaseBooking struct {
		ID            string    `json:"id"`
		CustomerName  string    `json:"customer_name"`
		CustomerEmail string    `json:"customer_email"`
		CustomerPhone string    `json:"customer_phone"`
		Service       string    `json:"service"`
		Barber        string    `json:"barber"`
		BookingDate   string    `json:"booking_date"`
		BookingTime   string    `json:"booking_time"`
		Status        string    `json:"status"`
		CreatedAt     time.Time `json:"created_at"`
	}

	payload := SupabaseBooking{
		ID:            booking.ID,
		CustomerName:  booking.CustomerName,
		CustomerEmail: booking.CustomerEmail,
		CustomerPhone: booking.CustomerPhone,
		Service:       booking.Service,
		Barber:        booking.Barber,
		BookingDate:   booking.Date,
		BookingTime:   booking.Time,
		Status:        booking.Status,
		CreatedAt:     booking.CreatedAt,
	}

	_, err := supabaseRequest("POST", "bookings", payload)
	if err != nil {
		// Ignore duplicate key errors (HTTP 409) caused by duplicate Stripe webhooks
		if strings.Contains(err.Error(), "409") {
			fmt.Printf("Webhook Duplicate Ignored: Booking already exists for %s\n", booking.ID)
			return nil
		}
		if err.Error() == "mock db: operation skipped" {
			fmt.Printf("Mock DB: Created booking for %s\n", booking.CustomerName)
			return nil
		}
		return err
	}
	return nil
}

// GetAllBookings retrieves all bookings from Supabase
func GetAllBookings() ([]Booking, error) {
	data, err := supabaseRequest("GET", "bookings?select=*&order=created_at.desc,booking_date.desc,booking_time.desc", nil)
	if err != nil {
		if err.Error() == "mock db: operation skipped" {
			return []Booking{}, nil
		}
		return nil, err
	}

	var rawBookings []map[string]interface{}
	if err := json.Unmarshal(data, &rawBookings); err != nil {
		return nil, err
	}

	var bookings []Booking
		for _, b := range rawBookings {
			createdAt, _ := time.Parse(time.RFC3339, getString(b, "created_at"))
			bookings = append(bookings, Booking{
				ID:            getString(b, "id"),
				CustomerName:  getString(b, "customer_name"),
				CustomerEmail: getString(b, "customer_email"),
				CustomerPhone: getString(b, "customer_phone"),
				Service:       getString(b, "service"),
				Barber:        getString(b, "barber"),
				Date:          getString(b, "booking_date"),
				Time:          getString(b, "booking_time"),
				Status:        getString(b, "status"),
				CreatedAt:     createdAt,
			})
		}
	return bookings, nil
}

// GetBookingByID retrieves a specific booking by ID
func GetBookingByID(id string) (*Booking, error) {
	data, err := supabaseRequest("GET", "bookings?id=eq."+id+"&select=*", nil)
	if err != nil {
		return nil, err
	}

	var rawBookings []map[string]interface{}
	if err := json.Unmarshal(data, &rawBookings); err != nil || len(rawBookings) == 0 {
		return nil, fmt.Errorf("booking not found")
	}

	b := rawBookings[0]
	createdAt, _ := time.Parse(time.RFC3339, getString(b, "created_at"))
	return &Booking{
		ID:            getString(b, "id"),
		CustomerName:  getString(b, "customer_name"),
		CustomerEmail: getString(b, "customer_email"),
		CustomerPhone: getString(b, "customer_phone"),
		Service:       getString(b, "service"),
		Barber:        getString(b, "barber"),
		Date:          getString(b, "booking_date"),
		Time:          getString(b, "booking_time"),
		Status:        getString(b, "status"),
		CreatedAt:     createdAt,
	}, nil
}

// UpdateBookingStatus updates the status of a booking
func UpdateBookingStatus(id string, status string) error {
	payload := map[string]string{"status": status}
	_, err := supabaseRequest("PATCH", "bookings?id=eq."+id, payload)
	return err
}

// UpdateBookingBarber assigns or reassigns a barber for a booking.
func UpdateBookingBarber(id string, barber string) error {
	payload := map[string]string{"barber": barber}
	_, err := supabaseRequest("PATCH", "bookings?id=eq."+id, payload)
	if err != nil && err.Error() == "mock db: operation skipped" {
		fmt.Printf("Mock DB: Assigned booking %s to %s\n", id, barber)
		return nil
	}
	return err
}

// DeleteBooking deletes a booking from Supabase
func DeleteBooking(id string) error {
	_, err := supabaseRequest("DELETE", "bookings?id=eq."+id, nil)
	return err
}

// CloseDB is a no-op for REST
func CloseDB() error {
	return nil
}

// Helper to safely get strings from unmarshaled JSON map
func getString(m map[string]interface{}, key string) string {
	if v, ok := m[key]; ok && v != nil {
		return fmt.Sprintf("%v", v)
	}
	return ""
}
