# linkedin-dummy

Mini LinkedIn-like Community Platform
A full-stack social community platform built for the CIAAN Cyber Tech Pvt Ltd Full Stack Development Internship assessment. This application allows users to register, create posts with text and images, and interact with content from other users in a clean, modern, and responsive interface.

Live Demo: [https://linkedin-dummy.vercel.app](https://linkedin-dummy.vercel.app/)


✨ Features
This project includes all the required features from the assessment, plus several unique additions to showcase a more comprehensive skill set.

Core Features
User Authentication: Secure user registration and login using email and password, powered by JSON Web Tokens (JWT).

Public Post Feed: A central home feed that displays all user posts in chronological order.

Post Creation: Logged-in users can create text-only posts.

User Profiles: Viewable public profiles for all users, displaying their name, bio, and all their posts.

unique Features
📸 Image Uploads: Users can upload profile pictures and include images in their posts, with cloud storage managed by Cloudinary.

❤️ Post Likes & Comments: A complete engagement system allowing users to like/unlike posts and add comments in real-time.

🔍 User Search: A functional search bar in the navbar to easily find and navigate to other user profiles.

✏️ Profile & Password Editing: Users can edit their name and bio or change their password through intuitive modals on their profile page.

🌙 Dark Mode: A sleek, midnight-dark theme that can be toggled and is saved to the user's local preferences.

UX Polish:

Loading Skeletons: Professional loading states for the post feed, improving perceived performance.

Toast Notifications: Non-intrusive feedback for actions like creating a post, updating a profile, or encountering an error.

Responsive Design: The entire application is fully responsive and optimized for a seamless experience on both desktop and mobile devices.

🛠️ Tech Stack
Frontend: React (Vite), Tailwind CSS, React Router

Backend: Node.js, Express.js

Database: MongoDB (with Mongoose)

Authentication: JSON Web Tokens (JWT)

Image Storage: Cloudinary

Deployment:

Frontend deployed on Vercel.

Backend deployed on Render.

⚙️ Local Setup Instructions
Prerequisites
Node.js (v18+)

npm

A MongoDB Atlas account for the database URI.

A Cloudinary account for image storage credentials.

Backend (/server)
Navigate to the server directory: cd server

Install dependencies: npm install

Create a .env file in the /server root and add the following variables:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
Start the server: npm start
The backend will run on http://localhost:5000.

Frontend (/client)
Navigate to the client directory: cd client

Install dependencies: npm install

Create a .env file in the /client root and add the following variable:

VITE_API_URL=http://localhost:5000
Start the client: npm run dev
The frontend will run on http://localhost:5173.

🔑 Demo Credentials
You can register a new user or use the following demo account for testing:

Email: test2@example.com

Password: 123456
