#!/bin/bash

# F1 Strategy Game - Multi-Computer Setup Script
# This script helps set up the development environment for each computer

set -e

echo "🏁 F1 Strategy Game - Multi-Computer Setup"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Download from: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2)
MIN_VERSION="18.0.0"
if ! printf '%s\n' "$MIN_VERSION" "$NODE_VERSION" | sort -V | head -n1 | grep -q "^$MIN_VERSION"; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version $NODE_VERSION detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ npm is available"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo ""
    echo "⚙️  Creating .env file..."
    cat > .env << 'EOF'
# OpenAI API Key (for Computer 2 - Voice & AI Integration)
# Get your API key from: https://platform.openai.com/account/api-keys
OPENAI_API_KEY=

# Development settings
NODE_ENV=development
VITE_APP_NAME=F1 Strategy Game
VITE_APP_VERSION=1.0.0

# Feature flags
VITE_ENABLE_VOICE=true
VITE_ENABLE_AI=true
VITE_DEBUG_MODE=true
EOF
    echo "✅ .env file created"
    echo "   💡 Computer 2: Add your OpenAI API key to .env file"
else
    echo "✅ .env file already exists"
fi

# Create directory structure
echo ""
echo "📁 Creating project structure..."

# Create missing directories
mkdir -p src/components/UI
mkdir -p src/components/HUD
mkdir -p src/hooks
mkdir -p src/utils
mkdir -p src/assets
mkdir -p public/images
mkdir -p docs
mkdir -p tests

# Create .gitignore if it doesn't exist
if [ ! -f .gitignore ]; then
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Production
/build
/dist

# Environment files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# TypeScript
*.tsbuildinfo

# Temporary files
*.tmp
*.temp

# Coverage
coverage/
*.lcov

# ESLint cache
.eslintcache

# Vite
.vite/
EOF
    echo "✅ .gitignore created"
fi

# Create postcss.config.js if it doesn't exist
if [ ! -f postcss.config.js ]; then
    cat > postcss.config.js << 'EOF'
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
EOF
    echo "✅ postcss.config.js created"
fi

# Ask user which computer they are setting up
echo ""
echo "🖥️  Which computer are you setting up?"
echo "1) Computer 1 - UI & Visualization Lead"
echo "2) Computer 2 - Voice & AI Integration Lead"
echo "3) Computer 3 - Game Logic & Simulation Lead"
echo ""
read -p "Enter your choice (1-3): " computer_choice

case $computer_choice in
    1)
        echo ""
        echo "🖥️  Setting up Computer 1 - UI & Visualization Lead"
        echo "Your focus: Frontend components, layouts, and track visualization"
        echo ""
        echo "Key files to work on:"
        echo "- src/components/Track/TrackVisualization.tsx"
        echo "- src/components/StrategyFeed/StrategyFeed.tsx"
        echo "- src/components/UI/"
        echo "- src/index.css"
        echo ""
        echo "Create your feature branch:"
        echo "git checkout -b feature/computer-1/track-visualization"
        ;;
    2)
        echo ""
        echo "🎙️  Setting up Computer 2 - Voice & AI Integration Lead"
        echo "Your focus: Speech processing and LLM interactions"
        echo ""
        echo "Key files to work on:"
        echo "- src/services/speechAPI.ts"
        echo "- src/services/llmService.ts"
        echo "- src/components/Voice/VoiceInterface.tsx"
        echo ""
        echo "⚠️  Don't forget to add your OpenAI API key to .env file!"
        echo ""
        echo "Create your feature branch:"
        echo "git checkout -b feature/computer-2/voice-integration"
        ;;
    3)
        echo ""
        echo "🏎️  Setting up Computer 3 - Game Logic & Simulation Lead"
        echo "Your focus: Race mechanics and AI behavior"
        echo ""
        echo "Key files to work on:"
        echo "- src/engine/RaceEngine.ts"
        echo "- src/engine/rivalAI.ts"
        echo "- src/engine/driverSystem.ts"
        echo ""
        echo "Create your feature branch:"
        echo "git checkout -b feature/computer-3/race-engine"
        ;;
    *)
        echo "Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "🎯 Next steps:"
echo "1. Review the README.md for detailed instructions"
echo "2. Check out your assigned files and start implementing"
echo "3. Use mock data for testing independently"
echo "4. Commit your changes regularly"
echo "5. Prepare for weekly integration sessions"
echo ""
echo "🚀 Start development server:"
echo "npm run dev"
echo ""
echo "🏁 Happy racing! Let's build an amazing F1 strategy game!" 