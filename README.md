# URL Shortener

A modern, minimalist URL shortener built with Next.js, TypeScript, and PostgreSQL. Features a clean UI built with Tailwind CSS and shadcn/ui components.

## Features

- ✨ **Clean, modern UI** - Responsive design with dark/light mode support
- 🔗 **Custom slugs** - Create memorable short links with custom paths
- 📊 **Link management** - Full CRUD operations (Create, Read, Update, Delete)
- 🚀 **Fast redirects** - Optimized redirect handling with proper HTTP status codes
- 🛡️ **Validation** - Duplicate slug prevention and URL validation
- 📱 **Mobile responsive** - Works perfectly on desktop and mobile devices
- 🔒 **TypeScript** - Full type safety throughout the application

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## Quick Setup

### 1. Database Setup

1. Create a free account at [Neon](https://neon.tech/)
2. Create a new database project
3. Copy your connection string from the dashboard

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Required: Your Neon PostgreSQL connection string
DATABASE_URL=postgresql://username:password@ep-xxx-xxx.us-east-1.aws.neon.tech/dbname?sslmode=require

# Optional: Your domain for the UI (defaults to localhost:3000)
NEXT_PUBLIC_DOMAIN=yourdomain.com
```

### 3. Install and Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your URL shortener!

## Usage

### Creating Short Links
1. Enter your desired slug (the part after the domain)
2. Enter the destination URL
3. Click "Create Link"

### Managing Links
- **Edit**: Click the edit icon to modify slug or destination
- **Delete**: Click the trash icon to remove a link
- **Visit**: Click the short link to test the redirect

### API Endpoints

The application provides a REST API:

- `GET /api/links` - Get all links
- `POST /api/links` - Create a new link
- `PUT /api/links` - Update an existing link
- `DELETE /api/links?id={id}` - Delete a link

## Deploy on Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/simple-url-redirector)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Vercel

In your Vercel dashboard, add these environment variables:

- `DATABASE_URL` - Your Neon PostgreSQL connection string
- `NEXT_PUBLIC_DOMAIN` - Your deployed domain (e.g., yourapp.vercel.app)

## Project Structure

```
src/
├── app/
│   ├── [slug]/           # Dynamic redirect handler
│   ├── api/links/        # CRUD API routes
│   ├── globals.css       # Global styles & CSS variables
│   ├── layout.tsx        # Root layout
│   ├── not-found.tsx     # 404 page
│   └── page.tsx          # Main UI page
├── components/ui/        # Reusable UI components
└── lib/
    ├── db.ts            # Database operations
    └── utils.ts         # Utility functions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).
