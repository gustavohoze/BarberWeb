#!/bin/bash

echo "🔍 Master Barber Backend Verification"
echo "====================================="
echo ""

# Check Go installation
echo "Checking Go installation..."
if ! command -v go &> /dev/null; then
    echo "❌ Go is not installed"
    exit 1
fi
GO_VERSION=$(go version | awk '{print $3}')
echo "✅ Go $GO_VERSION installed"
echo ""

# Check backend directory
echo "Checking backend structure..."
cd "$(dirname "$0")" || exit 1

if [ ! -f "main.go" ]; then
    echo "❌ main.go not found"
    exit 1
fi
echo "✅ main.go found"

if [ ! -f "database.go" ]; then
    echo "❌ database.go not found"
    exit 1
fi
echo "✅ database.go found"

if [ ! -f "go.mod" ]; then
    echo "❌ go.mod not found"
    exit 1
fi
echo "✅ go.mod found"

if [ ! -f "go.sum" ]; then
    echo "❌ go.sum not found (run: go mod tidy)"
    exit 1
fi
echo "✅ go.sum found"

if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found - using defaults"
else
    echo "✅ .env file found"
fi

echo ""
echo "Verifying Go modules..."
go mod verify
if [ $? -ne 0 ]; then
    echo "❌ Module verification failed"
    exit 1
fi
echo "✅ All modules verified"

echo ""
echo "Building backend..."
go build -o barber-api main.go database.go
if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi
echo "✅ Build successful"

echo ""
echo "🎉 Everything looks good!"
echo ""
echo "Ready to run? Execute:"
echo "  ./run.sh"
echo ""
echo "Or manually:"
echo "  export \$(cat .env | xargs)"
echo "  go run main.go database.go"
