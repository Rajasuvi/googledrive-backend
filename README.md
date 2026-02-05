# Google Drive Clone - Backend API

A robust Node.js backend API for a Google Drive-like cloud storage application with user authentication, file management, and AWS S3 integration.

## 🚀 Features

- **User Authentication**
  - Registration with email verification
  - Two-step activation workflow
  - JWT-based authentication
  - Password encryption with bcrypt
  - Forgot password with email reset

- **File Management**
  - Upload files to AWS S3
  - Download files with signed URLs
  - Delete files
  - Private bucket access (owner only)

- **Folder Management**
  - Create folders
  - Nested folder structure
  - Delete folders (with all contents)
  - Rename folders

- **Security**
  - JWT token authentication
  - Password hashing
  - Private S3 bucket
  - CORS protection
  - Input validation

## 📋 Prerequisites

- Node.js 18 or higher
- npm or yarn
- MongoDB Atlas account
- AWS account with S3
- Gmail account (for emails)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/googledrive-backend.git
   cd googledrive-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` with your credentials:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=your-mongodb-uri
   JWT_SECRET=your-secret-key
   AWS_ACCESS_KEY_ID=your-aws-key
   AWS_SECRET_ACCESS_KEY=your-aws-secret
   AWS_REGION=us-east-1
   AWS_BUCKET_NAME=your-bucket-name
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   EMAIL_FROM=GoogleDrive <noreply@domain.com>
   FRONTEND_URL=http://localhost:5173
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "password123"
}
```

#### Verify Email
```http
GET /api/auth/verify-email/:token
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

#### Reset Password
```http
POST /api/auth/reset-password/:token
Content-Type: application/json

{
  "password": "newpassword123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### File Endpoints

#### Upload File
```http
POST /api/files/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <file>
folderId: <optional-folder-id>
```

#### Get Files
```http
GET /api/files?folderId=<optional-folder-id>
Authorization: Bearer <token>
```

#### Download File
```http
GET /api/files/download/:id
Authorization: Bearer <token>
```

#### Delete File
```http
DELETE /api/files/:id
Authorization: Bearer <token>
```

### Folder Endpoints

#### Create Folder
```http
POST /api/folders
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "My Folder",
  "parentId": "<optional-parent-id>"
}
```

#### Get Folder
```http
GET /api/folders/:id
Authorization: Bearer <token>
```

#### Rename Folder
```http
PUT /api/folders/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Folder Name"
}
```

#### Delete Folder
```http
DELETE /api/folders/:id
Authorization: Bearer <token>
```

## 🏗️ Project Structure

```
googledrive-backend/
├── config/
│   ├── database.js      # MongoDB connection
│   ├── aws.js           # AWS S3 configuration
│   └── email.js         # Email transporter setup
├── controllers/
│   ├── auth.controller.js
│   ├── file.controller.js
│   └── folder.controller.js
├── middleware/
│   ├── auth.middleware.js
│   ├── upload.middleware.js
│   └── error.middleware.js
├── models/
│   ├── User.model.js
│   ├── File.model.js
│   └── Folder.model.js
├── routes/
│   ├── auth.routes.js
│   ├── file.routes.js
│   └── folder.routes.js
├── utils/
│   ├── email.utils.js
│   ├── s3.utils.js
│   └── token.utils.js
├── .env.example
├── .gitignore
├── package.json
├── README.md
└── server.js
```

## 🔐 Security Features

- JWT authentication with Bearer tokens
- Password hashing with bcrypt (10 rounds)
- Private S3 bucket with signed URLs
- Input validation with express-validator
- CORS protection
- Environment variable configuration
- Token-based email verification and password reset

## 🚀 Deployment

### Deploy to Render

1. Push code to GitHub
2. Connect repository to Render
3. Add environment variables
4. Deploy

### Deploy to Railway

```bash
railway init
railway up
```

## 📝 Environment Variables

| Variable | Description |
|----------|-------------|
| PORT | Server port (default: 5000) |
| NODE_ENV | Environment (development/production) |
| MONGODB_URI | MongoDB connection string |
| JWT_SECRET | Secret key for JWT |
| JWT_EXPIRE | JWT expiration time |
| AWS_ACCESS_KEY_ID | AWS access key |
| AWS_SECRET_ACCESS_KEY | AWS secret key |
| AWS_REGION | AWS S3 region |
| AWS_BUCKET_NAME | S3 bucket name |
| EMAIL_HOST | SMTP host |
| EMAIL_PORT | SMTP port |
| EMAIL_USER | Email username |
| EMAIL_PASSWORD | Email password |
| EMAIL_FROM | From email address |
| FRONTEND_URL | Frontend URL |

## 🐛 Common Issues

### MongoDB Connection Failed
- Check MONGODB_URI format
- Verify network access in MongoDB Atlas
- Ensure IP whitelist is configured

### AWS S3 Upload Failed
- Verify AWS credentials
- Check bucket permissions
- Ensure bucket exists in specified region

### Email Not Sending
- Use Gmail App Password
- Enable 2-FA on Gmail account
- Check EMAIL_* environment variables

## 📄 License

This project is for assessment purposes only.

## 🤝 Contributing

This is an assessment project. Fork for your own learning.

---

**Built with Node.js, Express, MongoDB, and AWS S3**
