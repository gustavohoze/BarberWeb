package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt"
	"github.com/joho/godotenv"
)

// Admin credentials (in production, consider moving to database/environment)
const (
	ADMIN_EMAIL    = "admin@masterbarber.com"
	ADMIN_PASSWORD = "password123"
	JWT_SECRET     = "your-secret-key-change-in-production"
)

// Booking represents a barber shop booking
type Booking struct {
	ID            string    `json:"id"`
	CustomerName  string    `json:"customerName"`
	CustomerEmail string    `json:"customerEmail"`
	CustomerPhone string    `json:"customerPhone"`
	Service       string    `json:"service"`
	Barber        string    `json:"barber"`
	Date          string    `json:"date"`
	Time          string    `json:"time"`
	Status        string    `json:"status"`
	CreatedAt     time.Time `json:"createdAt"`
}

// LoginRequest represents login credentials
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// LoginResponse represents the login response with token
type LoginResponse struct {
	Token string `json:"token"`
	Email string `json:"email"`
}

// BookingRequest represents a new booking request
type BookingRequest struct {
	CustomerName  string `json:"customerName"`
	CustomerEmail string `json:"customerEmail"`
	CustomerPhone string `json:"customerPhone"`
	Service       string `json:"service"`
	Barber        string `json:"barber"`
	Date          string `json:"date"`
	Time          string `json:"time"`
}

// AvailabilityResponse describes the state of one date/barber schedule.
type AvailabilityResponse struct {
	Date             string   `json:"date"`
	Barber           string   `json:"barber"`
	Available        bool     `json:"available"`
	Reason           string   `json:"reason,omitempty"`
	UnavailableTimes []string `json:"unavailableTimes"`
}

// AssignBarberRequest updates the barber assigned to a booking.
type AssignBarberRequest struct {
	ID     string `json:"id"`
	Barber string `json:"barber"`
}

// Booking ID counter for generation
var bookingIDCounter int = 1

// generateBookingID generates a new booking ID
func generateBookingID() string {
	id := fmt.Sprintf("BOOK-%d", bookingIDCounter)
	bookingIDCounter++
	return id
}

func parseBookingDate(value string) (time.Time, error) {
	return time.ParseInLocation("2006-01-02", value, time.Local)
}

func isFutureBookingDate(value string) (bool, error) {
	bookingDate, err := parseBookingDate(value)
	if err != nil {
		return false, err
	}

	now := time.Now()
	today := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, time.Local)
	return bookingDate.After(today), nil
}

func normalizeTimeKey(value string) string {
	cleaned := strings.TrimSpace(value)
	if cleaned == "" {
		return ""
	}

	layouts := []string{"3:04 PM", "03:04 PM", "3 PM", "03 PM", "15:04", "15:04:05"}
	for _, layout := range layouts {
		parsed, err := time.Parse(layout, strings.ToUpper(cleaned))
		if err == nil {
			return parsed.Format("15:04")
		}
	}

	return strings.ToLower(cleaned)
}

func displayTimeFromKey(value string) string {
	parsed, err := time.Parse("15:04", value)
	if err != nil {
		return value
	}
	return parsed.Format("03:04 PM")
}

func blocksAvailability(status string) bool {
	normalized := strings.ToLower(strings.TrimSpace(status))
	return normalized == "confirmed" || normalized == "completed"
}

func sameBarber(left string, right string) bool {
	return strings.EqualFold(strings.TrimSpace(left), strings.TrimSpace(right))
}

func getUnavailableTimes(bookings []Booking, date string, barber string, excludeID string) []string {
	seen := map[string]bool{}
	var times []string

	for _, booking := range bookings {
		if booking.ID == excludeID || booking.Date != date || !sameBarber(booking.Barber, barber) || !blocksAvailability(booking.Status) {
			continue
		}

		key := normalizeTimeKey(booking.Time)
		if key == "" || seen[key] {
			continue
		}

		seen[key] = true
		times = append(times, displayTimeFromKey(key))
	}

	return times
}

func isSlotAvailable(date string, bookingTime string, barber string, excludeID string) (bool, string, []string, error) {
	if strings.TrimSpace(date) == "" || strings.TrimSpace(bookingTime) == "" || strings.TrimSpace(barber) == "" {
		return false, "Choose a date, time, and barber.", nil, nil
	}

	isFuture, err := isFutureBookingDate(date)
	if err != nil {
		return false, "Use a valid booking date.", nil, err
	}
	if !isFuture {
		return false, "Same-day booking is not available. Please choose a future date.", nil, nil
	}

	bookings, err := GetAllBookings()
	if err != nil {
		return false, "Could not check availability.", nil, err
	}

	unavailableTimes := getUnavailableTimes(bookings, date, barber, excludeID)
	requestedTime := normalizeTimeKey(bookingTime)
	for _, unavailableTime := range unavailableTimes {
		if normalizeTimeKey(unavailableTime) == requestedTime {
			return false, "That barber is already booked at this time.", unavailableTimes, nil
		}
	}

	return true, "", unavailableTimes, nil
}

// CORS middleware
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")

		if r.Method == http.MethodOptions {
			w.Header().Set("Access-Control-Max-Age", "86400")
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

// JWT Claims
type Claims struct {
	Email string `json:"email"`
	jwt.StandardClaims
}

// generateToken generates a JWT token
func generateToken(email string) (string, error) {
	expirationTime := time.Now().Add(24 * time.Hour)
	claims := &Claims{
		Email: email,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(JWT_SECRET))
}

// verifyToken verifies a JWT token
func verifyToken(tokenString string) (*Claims, error) {
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return []byte(JWT_SECRET), nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, fmt.Errorf("invalid token")
	}

	return claims, nil
}

// authMiddleware checks for valid JWT token
func authMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, `{"error":"missing authorization header"}`, http.StatusUnauthorized)
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, `{"error":"invalid authorization header"}`, http.StatusUnauthorized)
			return
		}

		claims, err := verifyToken(parts[1])
		if err != nil {
			http.Error(w, `{"error":"invalid token"}`, http.StatusUnauthorized)
			return
		}

		// Store claims in context for later use
		r.Header.Set("X-User-Email", claims.Email)
		next(w, r)
	}
}

// handleLogin handles admin login
func handleLogin(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, `{"error":"method not allowed"}`, http.StatusMethodNotAllowed)
		return
	}

	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request"}`, http.StatusBadRequest)
		return
	}

	// Verify credentials
	if req.Email != ADMIN_EMAIL || req.Password != ADMIN_PASSWORD {
		http.Error(w, `{"error":"invalid email or password"}`, http.StatusUnauthorized)
		return
	}

	// Generate token
	token, err := generateToken(req.Email)
	if err != nil {
		http.Error(w, `{"error":"failed to generate token"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(LoginResponse{
		Token: token,
		Email: req.Email,
	})
}

// handleCreateBooking handles creating a new booking
func handleCreateBooking(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, `{"error":"method not allowed"}`, http.StatusMethodNotAllowed)
		return
	}

	var req BookingRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, `{"error":"invalid request"}`, http.StatusBadRequest)
		return
	}

	// Validate required fields
	if req.CustomerName == "" || req.CustomerEmail == "" || req.Service == "" || req.Date == "" || req.Time == "" {
		http.Error(w, `{"error":"missing required fields"}`, http.StatusBadRequest)
		return
	}

	if ok, reason, _, err := isSlotAvailable(req.Date, req.Time, req.Barber, ""); err != nil {
		http.Error(w, `{"error":"failed to check availability"}`, http.StatusInternalServerError)
		return
	} else if !ok {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusConflict)
		json.NewEncoder(w).Encode(map[string]string{"error": reason})
		return
	}

	// Create booking
	booking := Booking{
		CustomerName:  req.CustomerName,
		CustomerEmail: req.CustomerEmail,
		CustomerPhone: req.CustomerPhone,
		Service:       req.Service,
		Barber:        req.Barber,
		Date:          req.Date,
		Time:          req.Time,
		Status:        "pending",
	}

	// Save booking to database
	if err := CreateBooking(&booking); err != nil {
		http.Error(w, `{"error":"failed to create booking"}`, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(booking)
}

// handleGetAvailability checks whether a barber is free for a date/time.
func handleGetAvailability(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		sendJSONError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	date := r.URL.Query().Get("date")
	barber := r.URL.Query().Get("barber")
	bookingTime := r.URL.Query().Get("time")

	if strings.TrimSpace(date) == "" || strings.TrimSpace(barber) == "" {
		sendJSONError(w, "Missing date or barber", http.StatusBadRequest)
		return
	}

	isFuture, err := isFutureBookingDate(date)
	if err != nil {
		sendJSONError(w, "Use a valid booking date", http.StatusBadRequest)
		return
	}

	bookings, err := GetAllBookings()
	if err != nil {
		sendJSONError(w, "Failed to check availability", http.StatusInternalServerError)
		return
	}

	unavailableTimes := getUnavailableTimes(bookings, date, barber, "")
	response := AvailabilityResponse{
		Date:             date,
		Barber:           barber,
		Available:        isFuture,
		UnavailableTimes: unavailableTimes,
	}

	if !isFuture {
		response.Reason = "Same-day booking is not available. Please choose a future date."
	} else if strings.TrimSpace(bookingTime) != "" {
		requestedTime := normalizeTimeKey(bookingTime)
		for _, unavailableTime := range unavailableTimes {
			if normalizeTimeKey(unavailableTime) == requestedTime {
				response.Available = false
				response.Reason = "That barber is already booked at this time."
				break
			}
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// handleGetBookings handles fetching all bookings (requires auth)
func handleGetBookings(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, `{"error":"method not allowed"}`, http.StatusMethodNotAllowed)
		return
	}

	// Retrieve bookings from database
	bookings, err := GetAllBookings()
	if err != nil {
		http.Error(w, `{"error":"failed to fetch bookings"}`, http.StatusInternalServerError)
		return
	}

	if bookings == nil {
		bookings = []Booking{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(bookings)
}

// handleAssignBarber assigns a barber to an existing booking.
func handleAssignBarber(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPatch {
		sendJSONError(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var req AssignBarberRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		sendJSONError(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if strings.TrimSpace(req.ID) == "" || strings.TrimSpace(req.Barber) == "" {
		sendJSONError(w, "Missing booking id or barber", http.StatusBadRequest)
		return
	}

	booking, err := GetBookingByID(req.ID)
	if err != nil {
		sendJSONError(w, "Booking not found", http.StatusNotFound)
		return
	}

	bookings, err := GetAllBookings()
	if err != nil {
		sendJSONError(w, "Failed to check barber availability", http.StatusInternalServerError)
		return
	}

	unavailableTimes := getUnavailableTimes(bookings, booking.Date, req.Barber, req.ID)
	requestedTime := normalizeTimeKey(booking.Time)
	for _, unavailableTime := range unavailableTimes {
		if normalizeTimeKey(unavailableTime) == requestedTime {
			sendJSONError(w, "That barber is already booked at this time.", http.StatusConflict)
			return
		}
	}

	if err := UpdateBookingBarber(req.ID, req.Barber); err != nil {
		sendJSONError(w, "Failed to assign barber", http.StatusInternalServerError)
		return
	}

	booking.Barber = req.Barber

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(booking)
}

// handleHealthCheck is a simple health check endpoint
func handleHealthCheck(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"status":  "ok",
		"message": "Master Barber API is running with Supabase",
	})
}

func main() {
	fmt.Println("Starting main...")
	// Load .env file
	fmt.Println("Loading .env...")
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found, reading from environment")
	}
	fmt.Println("Loaded .env")

	// Initialize database connection
	fmt.Println("Initializing DB...")
	if err := InitDB(); err != nil {
		log.Printf("⚠ Warning: Failed to initialize database: %v. Running in memory-only mode.", err)
	} else {
		defer CloseDB()
	}

	// Initialize Stripe
	initStripe()

	// Create a new HTTP mux
	mux := http.NewServeMux()

	// Public endpoints
	mux.HandleFunc("/api/health", handleHealthCheck)
	mux.HandleFunc("/api/login", handleLogin)
	mux.HandleFunc("/api/bookings/create", handleCreateBooking)
	mux.HandleFunc("/api/bookings/availability", handleGetAvailability)

	// Stripe endpoints
	mux.HandleFunc("/api/bookings/create-session", handleCreateCheckoutSession)
	mux.HandleFunc("/webhooks/stripe", handleStripeWebhook)

	// Protected endpoints
	mux.HandleFunc("/api/bookings", authMiddleware(handleGetBookings))
	mux.HandleFunc("/api/bookings/assign-barber", authMiddleware(handleAssignBarber))

	// Wrap with CORS middleware
	handler := corsMiddleware(mux)

	// Start server
	portEnv := os.Getenv("PORT")
	if portEnv == "" {
		portEnv = "8080"
	}
	port := ":" + portEnv
	fmt.Printf("Master Barber API Server running on http://localhost%s\n", port)
	fmt.Printf("Demo Login: admin@masterbarber.com / password123\n")
	fmt.Printf("Connected to Supabase PostgreSQL database\n")
	fmt.Printf("Stripe: POST /api/bookings/create-session\n")
	fmt.Printf("Stripe: POST /webhooks/stripe (forward with: stripe listen --forward-to localhost:8080/webhooks/stripe)\n")

	if err := http.ListenAndServe(port, handler); err != nil {
		log.Fatal(err)
	}
}
