# Thumbly

Thumbly is an AI-powered thumbnail generator that helps content creators design eye-catching YouTube thumbnails in seconds. Just describe your video, pick a style and color scheme, and let AI generate a click-worthy thumbnail.

## Features

- **AI Image Generation** – Generate custom thumbnails from a title and description
- **Style Presets** – Choose from Bold & Graphic, Minimalist, Photorealistic, Illustrated, and Tech/Futuristic styles
- **Color Schemes** – Multiple curated palettes (Vibrant, Sunset, Ocean, Forest, Purple Dream, Monochrome, Neon, Pastel)
- **Aspect Ratio Support** – 16:9, 1:1, and 9:16 formats
- **User Authentication** – Secure sign-up and login (bcrypt + cookie sessions stored in MongoDB)
- **Security basics** – Input validation, rate limiting, Helmet headers, CSRF header check
- **Thumbnail Gallery** – View, manage, and delete your past generations
- **Cloud Image Hosting** – Generated thumbnails are stored and served via Cloudinary

## Tech Stack

**Frontend**
- React + TypeScript
- Vite
- Tailwind CSS

**Backend**
- Node.js + Express
- TypeScript
- MongoDB (Mongoose)
- Cloudinary (image hosting)
- Session-based authentication (express-session + connect-mongo)
- Helmet and express-rate-limit

**AI / Image Generation**
- Cloudflare Workers AI (FLUX.1 schnell) for image generation

## Project Structure

~~~
Thumbly/
├── Client/          # React frontend (Vite + TypeScript)
│   ├── src/
│   │   ├── components/
│   │   └── pages/
│   └── ...
└── server/          # Express backend (TypeScript)
    ├── configs/
    ├── controllers/
    ├── middlewares/
    ├── models/
    └── routes/
~~~

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Cloudinary account (free tier works)
- Cloudflare account with a Workers AI API token (free tier works)

### Installation

1. Clone the repository
   ~~~bash
   git clone https://github.com/YOUR_USERNAME/Thumbly.git
   cd Thumbly
   ~~~

2. Install backend dependencies
   ~~~bash
   cd server
   npm install
   ~~~

3. Install frontend dependencies
   ~~~bash
   cd ../Client
   npm install
   ~~~

4. Set up environment variables

   Create a `.env` file in `server/`:
   ~~~
   MONGODB_URI=your_mongodb_connection_string
   SESSION_SECRET=a_long_random_string
   CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id
   CLOUDFLARE_API_TOKEN=your_cloudflare_workers_ai_token
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   # optional: extra allowed frontend origins, comma separated
   CLIENT_URLS=
   ~~~
   (Instead of the three Cloudinary variables you can set a single `CLOUDINARY_URL`.)

   Create a `.env` file in `Client/`:
   ~~~
   VITE_BASE_URL=http://localhost:3000
   ~~~

5. Run the backend
   ~~~bash
   cd server
   npm run server
   ~~~

6. Run the frontend
   ~~~bash
   cd Client
   npm run dev
   ~~~

7. Open `http://localhost:5173` in your browser

## How It Works

1. Enter a title/topic for your video
2. Choose a thumbnail style, color scheme and aspect ratio
3. Add optional details to guide the generation
4. Thumbly builds a tailored prompt and generates an image with Cloudflare Workers AI
5. The result is uploaded to Cloudinary and saved to your gallery

## API Overview

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | No | Create an account and log in |
| POST | `/api/auth/login` | No | Log in |
| GET | `/api/auth/verify` | Yes | Get the current user |
| POST | `/api/auth/logout` | Yes | Log out |
| POST | `/api/thumbnail/generate` | Yes | Generate a thumbnail |
| DELETE | `/api/thumbnail/delete/:id` | Yes | Delete one of your thumbnails |
| GET | `/api/user/thumbnails` | Yes | List your thumbnails |
| GET | `/api/user/thumbnail/:id` | Yes | Get one of your thumbnails |

Requests that change data (POST/DELETE) must include the header `X-Requested-With: XMLHttpRequest`. The bundled frontend sends it automatically.

## Deployment

- **Client:** deploy `Client/` to Vercel and set `VITE_BASE_URL` to your API URL. `vercel.json` rewrites all routes to `/` for React Router.
- **Server:** deploy `server/` to Vercel (see `server/vercel.json`). Set all server environment variables, plus `NODE_ENV=production`. Add your client URL to `CLIENT_URLS` if it is not already allowed.

## License

This project is open source and available for personal and educational use.[`typescript-eslint`](https://typescript-eslint.io) in your project.
