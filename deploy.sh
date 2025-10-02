#!/bin/bash

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_step() {
    echo -e "${BLUE}🔄 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

echo -e "${BLUE}🏦 IBAN Validator Deployment${NC}"

# Docker Check
print_step "Checking Docker installation..."
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running!"
    exit 1
fi
print_success "Docker is running"

# Cleanup
print_step "Cleaning up previous deployment..."
docker-compose down -v --remove-orphans 2>/dev/null || true

# Build and start
print_step "Building and starting services..."
docker-compose up -d --build

# Wait for database
print_step "Waiting for database..."
timeout=60
while ! docker exec iban-validator-db pg_isready -U admin -d ibanvalidator > /dev/null 2>&1; do
    sleep 2
    timeout=$((timeout - 2))
    if [ $timeout -le 0 ]; then
        print_error "Database failed to start"
        echo "Database logs:"
        docker-compose logs postgres
        exit 1
    fi
done
print_success "Database is ready"

# Wait for backend
print_step "Waiting for backend..."
timeout=120
while ! curl -f http://localhost:8080/actuator/health > /dev/null 2>&1; do
    sleep 5
    timeout=$((timeout - 5))
    if [ $timeout -le 0 ]; then
        print_error "Backend failed to start"
        echo "Backend logs:"
        docker-compose logs backend
        exit 1
    fi
done
print_success "Backend is ready"

# Wait for frontend
print_step "Waiting for frontend..."
timeout=60
while ! curl -f http://localhost:3000 > /dev/null 2>&1; do
    sleep 2
    timeout=$((timeout - 2))
    if [ $timeout -le 0 ]; then
        print_error "Frontend failed to start"
        echo "Frontend logs:"
        docker-compose logs frontend
        exit 1
    fi
done
print_success "Frontend is ready"

echo -e "${GREEN}🎉 Deployment Successful!${NC}"
echo ""
echo -e "${BLUE}🌐 Services:${NC}"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:8080"
echo "  Health:   http://localhost:8080/actuator/health"
