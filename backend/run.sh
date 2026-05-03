#!/bin/bash

# Master Barber Backend Setup Script

echo "🍃 Master Barber Backend Setup"
echo "=============================="
echo ""

# Check if Go is installed
if ! command -v go &> /dev/null; then
    echo "❌ Go is not installed. Please install Go from https://golang.org/doc/install"
    exit 1
fi

echo "✓ Go is installed"

# Check if .env file exists
if [ ! -f .env ]; then
    echo ""
    echo "❌ .env file not found!"
    echo "Please copy .env.example to .env and update it with your Supabase credentials:"
    echo ""
    echo "  cp .env.example .env"
    echo "  nano .env  # or your preferred editor"
    echo ""
    exit 1
fi

# Verify .env contains required variables
if ! grep -q "SUPABASE_URL=" .env || ! grep -q "SUPABASE_KEY=" .env; then
    echo ""
    echo "❌ Missing required environment variables in .env"
    echo "Please update .env with SUPABASE_URL and SUPABASE_KEY"
    exit 1
fi

echo "✓ .env file configured"
echo ""

# Download dependencies
echo "📦 Installing dependencies..."
go mod download

if [ $? -ne 0 ]; then
    echo "❌ Failed to download dependencies"
    exit 1
fi

echo "✓ Dependencies installed"
echo ""

# Run the server
echo "🚀 Starting backend server..."
echo ""

# Load environment variables and run
set -a
source .env
set +a

go run main.go database.go stripe.go
