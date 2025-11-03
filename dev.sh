#!/bin/bash

###############################################################################
# Development Server Starter
# Automatically finds an available port starting from 3000
###############################################################################

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if a port is in use
port_in_use() {
    lsof -i :"$1" >/dev/null 2>&1
}

# Find next available port starting from base port
find_available_port() {
    local port=$1
    local max_attempts=10
    local attempts=0

    while [ $attempts -lt $max_attempts ]; do
        if ! port_in_use $port; then
            echo $port
            return 0
        fi
        echo -e "${YELLOW}Port $port is in use, trying next port...${NC}" >&2
        port=$((port + 1))
        attempts=$((attempts + 1))
    done

    echo -e "${RED}Could not find an available port after $max_attempts attempts${NC}" >&2
    return 1
}

echo -e "${BLUE}Starting Vite dev server...${NC}"
echo ""

# Check if DDEV is running
if command -v ddev &> /dev/null; then
    echo -e "${BLUE}Checking parent DDEV status...${NC}"
    cd .. && ddev_status=$(ddev describe 2>/dev/null | grep "Status" || echo "stopped")
    cd - > /dev/null

    if echo "$ddev_status" | grep -q "running"; then
        echo -e "${GREEN}✓ Parent DDEV is running${NC}"
    else
        echo -e "${YELLOW}⚠ Parent DDEV is not running${NC}"
        echo "  Start it with: cd .. && ddev start"
    fi
    echo ""
fi

# Find available port
PORT=$(find_available_port 3000)
if [ $? -ne 0 ]; then
    exit 1
fi

if [ $PORT -ne 3000 ]; then
    echo -e "${YELLOW}Using port $PORT instead of 3000${NC}"
    echo ""
fi

# Start Vite (it will handle port detection automatically)
echo -e "${GREEN}Starting Vite on available port...${NC}"
pnpm dev
