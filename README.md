# Relationship Growth Partner (RGP)

Private AI-powered journaling and relationship growth tool for Harist & Dian.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Supabase (PostgreSQL)
- Claude Sonnet 4.6 via Anthropic API
- html2pdf.js for PDF export

## Setup

```bash
npm install
cp .env.example .env.local
# Fill in API keys and PINs
npm run dev
```

## Supabase

Run `supabase/schema.sql` in the Supabase SQL Editor.

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/harist/login` | Harist PIN login |
| `/harist` | Harist dashboard |
| `/harist/chat` | Harist chat (mode selector + ChatWindow) |
| `/dian/login` | Dian PIN login |
| `/dian` | Dian dashboard |
| `/dian/chat` | Dian chat |
| `/growth` | Shared growth overview |

## Color Palette

- Primary green: `#074836`
- Accent yellow: `#FFD700`
- Background: `#F9F7F2`
