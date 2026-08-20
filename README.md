# Thumbly

Thumbly is an AI-powered thumbnail generator that helps content creators design eye-catching YouTube thumbnails in seconds. Just describe your video, pick a style and color scheme, and let AI generate a click-worthy thumbnail.

## Features

- **AI Image Generation** – Generate custom thumbnails from a title and description
- **Style Presets** – Choose from Bold & Graphic, Minimalist, Photorealistic, Illustrated, and Tech/Futuristic styles
- **Color Schemes** – Multiple curated palettes (Vibrant, Sunset, Ocean, Forest, Purple Dream, Monochrome, Neon, Pastel)
- **Aspect Ratio Support** – 16:9, 1:1, and 9:16 formats
- **User Authentication** – Secure sign-up and login
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
- Session-based authentication

**AI / Image Generation**
- Pollinations.ai for free-tier image generation

## Project Structure

```
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
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Cloudinary account (free tier works)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/YOUR_USERNAME/Thumbly.git
   cd Thumbly
   ```

2. Install backend dependencies
   ```bash
   cd server
   npm install
   ```

3. Install frontend dependencies
   ```bash
   cd ../Client
   npm install
   ```

4. Set up environment variables

   Create a `.env` file in `server/`:
   ```
   MONGODB_URI=your_mongodb_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```

   Create a `.env` file in `Client/`:
   ```
   VITE_API_URL=http://localhost:3000
   ```

5. Run the backend
   ```bash
   cd server
   npm run server
   ```

6. Run the frontend
   ```bash
   cd Client
   npm run dev
   ```

7. Open `http://localhost:5173` in your browser

## How It Works

1. Enter a title/topic for your video
2. Choose a thumbnail style and color scheme
3. Add optional details to guide the generation
4. Thumbly builds a tailored prompt and generates an image
5. The result is uploaded to Cloudinary and saved to your gallery

## License

This project is open source and available for personal and educational use.
