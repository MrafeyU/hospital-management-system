# 🏥 Hospital Management System

A comprehensive full-stack hospital management system built with React.js, Node.js, Express, MySQL, and Firebase. This system provides role-based access for administrators, doctors, and patients with features including appointment scheduling, medical records management, vitals monitoring, and AI-powered chatbot assistance.

## 🌟 Features

### 👨‍⚕️ **Admin Features**
- User management (doctors, patients, admins)
- Appointment management and scheduling
- Billing and financial reports
- System analytics and statistics
- User registration and role assignment

### 🩺 **Doctor Features**
- Patient management and medical records
- Appointment scheduling and management
- Vitals monitoring and alerts
- Schedule management
- Patient history access

### 🏥 **Patient Features**
- Appointment booking
- Medical history viewing
- Vitals monitoring (for in-house patients)
- Bill management
- Profile management

### 🤖 **AI Features**
- Gemini AI-powered chatbot
- Role-based contextual responses
- Medical assistance and information

## 🛠️ Tech Stack

### **Frontend**
- React.js 18.3.1
- React Router DOM 7.1.5
- Firebase Authentication
- Recharts for data visualization
- React Icons
- Axios for API calls

### **Backend**
- Node.js
- Express.js 4.21.2
- MySQL2 3.12.0
- Firebase Admin SDK
- Nodemailer for email services
- Gemini AI integration

### **Database**
- MySQL
- Firebase Authentication
- Firebase Admin SDK

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MySQL** (v8.0 or higher)
- **Git**

## 🚀 Installation & Setup

### 1. **Clone the Repository**
```bash
git clone https://github.com/MrafeyU/hospital-management-system.git
cd hospital-management-system
```

### 2. **Backend Setup**

#### Install Dependencies
```bash
cd Backend
npm install
```

#### Database Setup
1. Create a MySQL database named `hospital_management_system`
2. Import the database schema (create tables as needed)

#### Environment Configuration
1. Copy the environment example file:
```bash
cp env.example .env
```

2. Update the `.env` file with your configuration:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=hospital_management_system

# Server Configuration
PORT=5001

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key
```

#### Firebase Admin Setup
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing project
3. Go to Project Settings > Service Accounts
4. Generate a new private key
5. Download the JSON file and rename it to `firebaseAdminConfig.json`
6. Place it in the `Backend` directory

### 3. **Frontend Setup**

#### Install Dependencies
```bash
cd ../Frontend
npm install
```

#### Environment Configuration
1. Copy the environment example file:
```bash
cp env.example .env
```

2. Update the `.env` file with your Firebase configuration:
```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

#### Firebase Web App Setup
1. In Firebase Console, go to Project Settings > General
2. Scroll down to "Your apps" section
3. Click "Add app" and select Web
4. Register your app and copy the configuration
5. Update your Frontend `.env` file with the copied values

## 🔧 Configuration Guide

### **Database Connection**
The system uses MySQL for data storage. Update the database configuration in `Backend/.env`:

```env
DB_HOST=localhost          # Your MySQL host
DB_USER=your_username      # Your MySQL username
DB_PASSWORD=your_password  # Your MySQL password
DB_NAME=hospital_management_system  # Database name
```

### **Firebase Authentication**
1. **Backend (Admin SDK):**
   - Download `firebaseAdminConfig.json` from Firebase Console
   - Place it in the `Backend` directory
   - The file contains private keys and should never be committed to version control

2. **Frontend (Web SDK):**
   - Get your Firebase config from Project Settings
   - Update the Frontend `.env` file with the configuration values
   - All React environment variables must start with `REACT_APP_`

### **Email Service (Nodemailer)**
Configure Gmail for sending critical alerts:

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password:**
   - Go to Google Account settings
   - Security > 2-Step Verification > App passwords
   - Generate a new app password for "Mail"
3. **Update `.env`:**
   ```env
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_16_character_app_password
   ```

### **Gemini AI Integration**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Update your Backend `.env`:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   ```

## 🏃‍♂️ Running the Application

### **Start Backend Server**
```bash
cd Backend
npm start
```
The backend server will run on `http://localhost:5001`

### **Start Frontend Development Server**
```bash
cd Frontend
npm start
```
The frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
hospital-management-system/
├── Backend/
│   ├── config/
│   │   └── db.js                 # Database configuration
│   ├── routes/                   # API routes
│   │   ├── adminRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── authRoutes.js
│   │   ├── chatbotRoutes.js
│   │   ├── doctorRoutes.js
│   │   ├── patientRoutes.js
│   │   └── ...
│   ├── utilis/
│   │   └── emailService.js       # Email service
│   ├── server.js                 # Main server file
│   ├── firebaseAdmin.js          # Firebase Admin setup
│   └── firebaseAuth.js           # Firebase Auth functions
├── Frontend/
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── admin/
│   │   │   ├── doctors/
│   │   │   ├── patients/
│   │   │   └── ...
│   │   ├── pages/                # Page components
│   │   ├── api/                  # API utilities
│   │   └── styles/               # CSS files
│   └── public/
└── README.md
```

## 🔐 Security Features

- **Environment Variables:** All sensitive data stored in environment variables
- **Firebase Authentication:** Secure user authentication and authorization
- **Role-based Access Control:** Different access levels for admin, doctor, and patient
- **Input Validation:** Server-side validation for all user inputs
- **CORS Configuration:** Proper cross-origin resource sharing setup

## 🚨 Important Security Notes

1. **Never commit sensitive files:**
   - `.env` files
   - `firebaseAdminConfig.json`
   - Any files containing API keys or passwords

2. **Environment Variables:**
   - Backend: Use `process.env.VARIABLE_NAME`
   - Frontend: Use `process.env.REACT_APP_VARIABLE_NAME`

3. **Firebase Security:**
   - Keep your Firebase Admin SDK private key secure
   - Configure Firebase Security Rules properly
   - Use Firebase Authentication for user management

## 🐛 Troubleshooting

### **Common Issues:**

1. **Database Connection Error:**
   - Check MySQL service is running
   - Verify database credentials in `.env`
   - Ensure database exists

2. **Firebase Authentication Error:**
   - Verify Firebase configuration in `.env`
   - Check Firebase project settings
   - Ensure Firebase Admin SDK is properly configured

3. **Email Service Error:**
   - Verify Gmail app password is correct
   - Check 2-factor authentication is enabled
   - Ensure EMAIL_USER and EMAIL_PASS are set

4. **Gemini AI Error:**
   - Verify GEMINI_API_KEY is correct
   - Check API key permissions
   - Ensure API key is not expired

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**MrafeyU**
- GitHub: [@MrafeyU](https://github.com/MrafeyU)

## 🙏 Acknowledgments

- Firebase for authentication services
- Google AI for Gemini integration
- React.js community for excellent documentation
- MySQL for reliable database services

## 📞 Support

If you encounter any issues or have questions, please:
1. Check the troubleshooting section above
2. Search existing issues in the repository
3. Create a new issue with detailed information

---

**⚠️ Important:** Make sure to keep all sensitive information (API keys, passwords, etc.) in environment variables and never commit them to version control.
