# Websites For Sale

A self-hosted website marketplace where sellers list websites for sale and buyers browse and contact them directly — no fees, no commissions.

**Stack:** Next.js 16, React 19, Drizzle ORM, Neon Postgres, shadcn/ui, Tailwind CSS, Resend email, Vercel Blob

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Agents

Autonomous Claude-powered agents for development and QA. Requires the shared ENGINE at `~/Projects/claude-lab/ENGINE/run.sh`.

### Visual Enhancement Agent

Screenshots each page, identifies visual/UI issues, and fixes them directly in the source code.

**Start the dev server first:**
```bash
npm run dev
```

**Run the agent (in a separate terminal):**
```bash
cd agents && ./run-agent.sh visual
```

**Options:**
```bash
./run-agent.sh visual                  # Default: opus model, 15 loops
./run-agent.sh visual opus 15          # Explicit: opus model, 15 loops
./run-agent.sh visual sonnet 10        # Faster: sonnet model, 10 loops
./run-agent.sh visual haiku 20         # Quickest: haiku model, 20 loops
```

**Or run directly via ENGINE:**
```bash
WORK=/Users/brandonhopkins/Projects/websitesforsale/agents/visual-enhancement-agent \
  MODEL="opus" \
  MAX_LOOPS=15 \
  bash ~/Projects/claude-lab/ENGINE/run.sh
```

**Watch logs:**
```bash
tail -f agents/visual-enhancement-agent/output/agent-log.md
```

**Stop the agent:**
```bash
touch agents/visual-enhancement-agent/output/STOP
```

**Output:** `agents/visual-enhancement-agent/output/agent-log.md`

### Models

| Model | Quality | Speed | Use when |
|-------|---------|-------|----------|
| `opus` | Best | Slowest | Full visual pass, production quality (default) |
| `sonnet` | Good | Medium | Quick iteration or targeted fixes |
| `haiku` | Basic | Fastest | Rapid scan, low-cost runs |

### Loops

Each loop is one full agent run (screenshot → analyze → fix → log). More loops = more pages audited and more fixes applied.

- `10` — Quick pass, main pages only
- `15` — Standard full audit (default)
- `20+` — Deep pass, catches edge cases and revisits pages
