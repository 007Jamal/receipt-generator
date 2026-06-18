# Receipt Generator

Professional business receipt generator with 3 themes: Light, Dark, and Ethereal.

## Features
- 3 themes: Light, Dark, Ethereal (aurora glass)
- Live receipt preview as you type
- Add/remove line items dynamically
- Auto-calculates subtotal, tax, and total
- Naira (₦) currency
- Print to PDF with one click
- Business info, customer info, notes/terms

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Run locally
npm run dev

# 3. Open browser at http://localhost:5173
```

## Build for production

```bash
npm run build
```

## Deploy to Netlify

1. Push this folder to a GitHub repo
2. Go to netlify.com → Add new site → Import from GitHub
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Click Deploy
