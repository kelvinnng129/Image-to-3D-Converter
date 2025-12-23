GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo ""
echo "======================================"
echo "   Image to 3D - Setup Script"
echo "======================================"
echo ""

if [ ! -f "Makefile" ]; then
    echo -e "${RED}Error: Please run this script from the project root directory${NC}"
    echo "Usage: ./scripts/setup.sh"
    exit 1
fi

echo -e "${YELLOW}Checking Python...${NC}"
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}✓ $PYTHON_VERSION${NC}"
else
    echo -e "${RED}✗ Python 3 not found. Please install Python 3.10+${NC}"
    exit 1
fi

echo -e "${YELLOW}Checking Node.js...${NC}"
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js $NODE_VERSION${NC}"
else
    echo -e "${RED}✗ Node.js not found. Please install Node.js 18+${NC}"
    exit 1
fi

echo ""

echo -e "${YELLOW}Setting up backend...${NC}"
cd backend

if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
fi

echo "Installing Python dependencies..."
source venv/bin/activate
pip install -r requirements.txt --quiet

mkdir -p data

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "Created .env from .env.example"
fi

echo -e "${GREEN}✓ Backend setup complete${NC}"
cd ..

echo ""

echo -e "${YELLOW}Setting up frontend...${NC}"
cd frontend

echo "Installing npm dependencies..."
npm install --silent

if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "Created .env from .env.example"
fi

echo -e "${GREEN}✓ Frontend setup complete${NC}"
cd ..

echo ""
echo "======================================"
echo -e "${GREEN}   Setup Complete!${NC}"
echo "======================================"
echo ""
echo "To start development servers:"
echo ""
echo "  Terminal 1 (Backend):"
echo "    cd backend && source venv/bin/activate"
echo "    python -m uvicorn app.main:app --reload --port 8000"
echo ""
echo "  Terminal 2 (Frontend):"
echo "    cd frontend && npm run dev"
echo ""
echo "Or use: make dev"
echo ""
