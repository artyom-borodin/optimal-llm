# Optimal LLM

Ranks LLMs by Artificial Analysis (AA) Intelligence Index v5.0.1 and estimated task execution cost, calculated from OpenRouter provider pricing and AA token usage metrics, alongside endpoint uptime, speed, quantization, context window, and data retention & usage policies.

## Features

- **Task Cost Profiles**:
  - **Complex Task (`agentic tasks`)**: Weighted average token usage per task across the 9 benchmarks in the AA Intelligence Index v5.0.1 suite, accounting for uncached input, cache write/read via AA cache hit rates, reasoning tokens, and answer tokens.
  - **Simple Task (`chat`)**: Single request with `20K` uncached input tokens and `1.5K` answer tokens, plus proportional reasoning tokens derived from each model's AA reasoning-to-answer ratio.
- **Smart Endpoint Selection & Filtering**: Automatically picks the best eligible OpenRouter endpoint per model by lowest cost, breaking ties by stricter data policy and higher throughput. Supports filtering by data retention & training policy (including Zero Data Retention), 4-bit quantization, minimum context window, 24h uptime, output speed, and Flex tier availability.
- **Baseline Comparison**: Select any model as a baseline to filter weaker models (or keep them visible) and inspect exact AA index and cost deltas.
- **Interactive Visualization & Table**: Zoomable Chart.js Pareto frontier scatter plot paired with a searchable, sortable comparison table.
- **Live Background Refresh**: Automatically refreshes the combined dataset every 10 minutes.

## Getting Started

### Prerequisites

- Node.js `>= 20.12.0`
- npm

### Installation & Build

```bash
npm install
npm --prefix frontend install
npm run build
```

### Running in Production

```bash
npm start
```

The server builds the initial dataset from Artificial Analysis and OpenRouter on startup and serves both the API and the built frontend (`public/`) at `http://localhost:8787` (override via `PORT` in environment variables).

### Development Mode

Run the backend server and Vite dev server (with `/api` proxied to `http://localhost:8787`) in separate terminals:

```bash
# Terminal 1: backend
npm start

# Terminal 2: frontend dev server
npm run dev:frontend
```

## API Endpoints

- `GET /api/meta` — Returns the list of available matched models (`modelsList`) for baseline selection.
- `POST /api/rank` — Ranks models and selects the optimal endpoint per model based on JSON options:
  - `costProfile`: `"agent"` | `"direct"`
  - `sortBy`: `"pareto_value"` | `"score"` | `"cost"` | `"value_ratio"`
  - `thresholdSlug`: baseline model slug or `null`
  - `includeBelowThreshold`: `boolean`
  - `quantizationMode`: `"prefer_non_4bit"` | `"allow_all"` | `"exclude_4bit"`
  - `dataPolicy`: `"any"` | `"no_training"` | `"no_retention"`
  - `minContext`: `number` (tokens)
  - `minUptime`: `number` (percentage)
  - `minSpeed`: `number` (tok/s)
  - `includeFlex`: `boolean`
