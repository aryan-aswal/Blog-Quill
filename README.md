# BlogQuill

## Live Link: [BlogQuill - https://blog-quill.vercel.app/](https://blog-quill.vercel.app/)
## Overview

BlogQuill is a MERN stack blog platform to enhance content management. It provides a seamless blogging experience with secure authentication and essential blog functionalities.

## Features
- **Enhanced Content Management**: Interactive and responsive UI for content management.
- **User Authentication**: Google authentication via Firebase for secure and convenient sign-ins.
- **JWT-Based Security**: Secure authentication system to protect user sessions.
- **Blogging Features**: Post creation, editing, commenting, and categorization.

## Tech Stack

### Frontend
- React
- Tailwind CSS
- Firebase Authentication

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Cloudinary

## Installation

### Prerequisites

Make sure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn
- MongoDB

### Setup

1. Clone the repository:
```bash
git clone https://github.com/aryan-aswal/Blog-Quill
cd BlogQuill
```

2. Install dependencies for both client and server:
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

3. Create a `.env` file in the server directory with the following variables:
```
PORT = 3000
DATABASE_URI = your_database_uri (MongoDB URI)
MAIL_HOST = your_mail_host
MAIL_PASS = your_mail_password
MAIL_USER = your_mail_user
JWT_SECRET = your_jwt_secret
CLOUD_NAME = your_cloud_name (cloudinary)
API_KEY = your_api_key (cloudinary) 
API_SECRET = your_api_secret (cloudinary)
ASSET_FOLDER = your_asset_folder_path (cloudinary)
FIREBASE_SERVICE_ACCOUNT = your_firebase_service_account_json_file_path
```

3. Create a `.env` file in the client directory with the following variables:
```
VITE_APP_BASE_URL=your_app_base_url
```

4. Start the backend server:
```bash
cd server
npm run dev
```

5. Start the frontend client:
```bash
cd client
npm run dev
```

The application should now be running on `http://localhost:5173` with the backend server on `http://localhost:5000`.

## Usage

1. Sign up using Google authentication.
2. Create and edit blog posts.
3. Categorize and manage blog content efficiently.
4. Engage with posts through commenting.

## Folder Structure

```
/BlogQuill
├── client/          # Frontend React application
│   ├── public/      # Static files
│   ├── src/         # Source files
│   └── package.json # Frontend dependencies
├── server/          # Backend Node.js application
│   ├── config/      # Configuration files
│   ├── controllers/ # Request handlers
│   ├── models/      # Database models
│   ├── routes/      # API routes
│   └── package.json # Backend dependencies
├── .gitignore       # Git ignore file
└── README.md        # Project documentation
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/improvement`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature/improvement`)
6. Submit a Pull Request

## Contact

If you have any questions or suggestions, please feel free to reach out:

- GitHub Issues: [Create an issue](https://github.com/aryan-aswal/Blog-Quill)
- Email: [aryanaswal45@gmail.com](mailto:aryanaswal45@gmail.com)
- LinkedIn: [Aryan Aswal](https://www.linkedin.com/in/aryanaswal)

