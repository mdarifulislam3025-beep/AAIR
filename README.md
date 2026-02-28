# AAIR — AI Agent for IATA Rules & Airline Regulations

An intelligent AI-powered agent that specializes in IATA rules, airline regulations, baggage policies, ticketing, dangerous goods, passenger rights, and more. Features an admin panel for training the AI with custom knowledge.

## Features

### Chat Interface
- Expert AI assistant for IATA and airline regulation queries
- Built-in knowledge base covering 17+ major IATA topics
- Context-aware responses with source citations
- Suggested questions for quick start
- Session-based chat history

### Admin Panel (Trainable AI)
- **Knowledge Manager**: Add, edit, delete knowledge entries with categories and tags
- **Document Upload**: Upload `.txt`, `.md`, `.json`, `.csv` files to expand the knowledge base
- **AI Configuration**: Configure OpenAI API key, model selection, and custom API endpoints
- **Dashboard**: View stats — total entries, documents, chat sessions, categories

### Built-in IATA Knowledge
Pre-loaded with comprehensive knowledge covering:
- Baggage rules (checked, carry-on, lost/delayed)
- Ticketing (e-tickets, fare rules, refunds)
- Dangerous goods regulations (DGR, lithium batteries)
- Passenger rights (EU261, denied boarding, delays)
- Airport & airline codes
- Safety standards (IOSA)
- Cargo operations (AWB, e-freight, ULD)
- Travel documents (Timatic, APIS)
- Ground handling (SGHA, ISAGO)
- Airline operations (codeshare, interline, alliances)
- Environmental regulations (CORSIA, SAF)
- Passenger accessibility & special assistance

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: JSON file storage (`data/aair.json`)
- **AI**: OpenAI-compatible API (configurable)

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Install dependencies
npm install

# Unified app (chat + admin) on one port
npm run dev

# Agent-only app (chat APIs/UI only) on AGENT_PORT (default 3000)
npm run dev:agent

# Admin-only app (admin APIs/UI only) on ADMIN_PORT (default 3001)
npm run dev:admin
```

Open [http://localhost:3000](http://localhost:3000) for the chat interface (unified or agent mode).
Open [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel in unified mode, or [http://localhost:3001](http://localhost:3001) in admin-only mode.


### Split Agent/Admin ports

You can run the app in 3 modes with environment variables:

- `APP_MODE=unified` (default): both chat and admin are enabled.
- `APP_MODE=agent`: only user-facing chat routes/APIs are enabled.
- `APP_MODE=admin`: only admin routes/APIs are enabled.

The client-side mode flag (`NEXT_PUBLIC_APP_MODE`) is set automatically from `APP_MODE` via `next.config.mjs`, so you only need to set `APP_MODE`.

Port variables:
- `AGENT_PORT` (default `3000`)
- `ADMIN_PORT` (default `3001`)

In split mode, disabled routes return `404` for better isolation.

### AI Configuration

The agent works in two modes:

1. **Without API Key** (default): Uses rule-based responses from the knowledge base. Searches and formats relevant entries directly.

2. **With API Key**: Uses OpenAI (or compatible) API for intelligent, contextual responses. Configure in Admin Panel → Settings:
   - Enter your OpenAI API key
   - Select a model (GPT-3.5 Turbo, GPT-4, GPT-4o, etc.)
   - Optionally change the API base URL for alternative providers (Azure, Groq, Together AI, local LLMs)

### Training the AI

Admins can expand the knowledge base through:

1. **Manual Entries**: Add individual knowledge entries with title, content, category, and tags
2. **Document Upload**: Upload files in supported formats:
   - `.txt` — Split into sections by paragraphs
   - `.md` — Split by headings
   - `.json` — Parse structured entries
   - `.csv` — Parse rows with headers

## Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Chat interface
│   ├── globals.css             # Global styles
│   ├── admin/page.tsx          # Admin panel
│   └── api/
│       ├── chat/route.ts       # Chat endpoint
│       ├── knowledge/route.ts  # Knowledge CRUD
│       ├── upload/route.ts     # Document upload
│       └── settings/route.ts   # Settings management
├── components/
│   ├── ChatInterface.tsx       # Main chat UI
│   ├── AdminPanel.tsx          # Admin panel container
│   ├── KnowledgeManager.tsx    # Knowledge CRUD UI
│   ├── DocumentUploader.tsx    # File upload UI
│   └── SettingsPanel.tsx       # AI settings & dashboard
└── lib/
    ├── db.ts                   # JSON datastore layer
    ├── ai.ts                   # AI response engine
    ├── iata-data.ts            # Built-in IATA knowledge
    └── seed.ts                 # Database seeder
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chat` | Send a chat message |
| GET | `/api/knowledge` | List knowledge entries |
| POST | `/api/knowledge` | Create knowledge entry |
| PUT | `/api/knowledge` | Update knowledge entry |
| DELETE | `/api/knowledge?id=` | Delete knowledge entry |
| POST | `/api/upload` | Upload a document |
| GET | `/api/settings` | Get settings & stats |
| POST | `/api/settings` | Update settings |

## License

MIT
