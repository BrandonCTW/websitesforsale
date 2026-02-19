#!/usr/bin/env bash
# Websites For Sale Agent Runner
# Usage: ./run-agent.sh [visual] [model] [loops]

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
MODEL="${2:-opus}"
LOOPS="${3:-15}"
PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
ENGINE="$HOME/Projects/claude-lab/ENGINE/run.sh"
AGENTS_DIR="$PROJECT_ROOT/agents"

# Check if ENGINE exists
if [ ! -f "$ENGINE" ]; then
    echo -e "${RED}❌ ENGINE not found at: $ENGINE${NC}"
    echo "Please verify the ENGINE path is correct."
    exit 1
fi

# Help function
show_help() {
    echo -e "${BLUE}Websites For Sale Agent Runner${NC}"
    echo ""
    echo "Usage: ./run-agent.sh [agent] [model] [loops]"
    echo ""
    echo "Agents:"
    echo "  visual    - Visual enhancement: screenshot, analyze, and fix UI/design issues (recommended: opus, 15 loops)"
    echo ""
    echo "Models:"
    echo "  opus      - Best quality, slower (default)"
    echo "  sonnet    - Good balance"
    echo "  haiku     - Fast, lower quality"
    echo ""
    echo "Examples:"
    echo "  ./run-agent.sh visual              # Visual enhancement with opus, 15 loops"
    echo "  ./run-agent.sh visual sonnet 10    # Visual enhancement with sonnet, 10 loops"
    echo "  ./run-agent.sh visual opus 20      # Visual enhancement with opus, 20 loops"
    echo ""
    echo "Prerequisites:"
    echo "  - Dev server running: npm run dev (http://localhost:3000)"
    echo ""
}

# Run agent function
run_agent() {
    local agent_name=$1
    local agent_dir=$2
    local emoji=$3
    local model=$4
    local loops=$5

    echo ""
    echo -e "${GREEN}$emoji Running $agent_name${NC}"
    echo -e "${YELLOW}Model: $model | Loops: $loops${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    WORK="$agent_dir" MODEL="$model" MAX_LOOPS="$loops" STOP_ON_COMPLETE=true bash "$ENGINE"

    echo ""
    echo -e "${GREEN}✅ $agent_name complete!${NC}"
    echo -e "Output: ${BLUE}$agent_dir/output/${NC}"
    echo ""
}

# Main logic
case "${1:-help}" in
    visual)
        run_agent "Visual Enhancement Agent" "$AGENTS_DIR/visual-enhancement-agent" "🎨" "$MODEL" "${LOOPS:-15}"
        ;;

    help|--help|-h)
        show_help
        ;;

    *)
        echo -e "${RED}❌ Unknown agent: $1${NC}"
        echo ""
        show_help
        exit 1
        ;;
esac
