# Breach

Breach is a Full Stack web application developed using the PERN stack (PostgreSQL, Express, React, Node.js). The application allows users to upload and manage resumes and job data, as well as perform advanced queries on a database of resumes based on various criteria such as school name, GPA, major, previous experience, and skills.

The platform aims to demystify the resume screening process by enabling users to benchmark their resumes against those of successful applicants and share their own resumes and job application outcomes.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup and Installation](#setup-and-installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Demo](#demo)

## Features

- **User Authentication**: Secure user authentication using JSON Web Tokens (JWT).
- **Resume and Job Management**: Users can upload, manage, and delete their resumes and job application data.
- **Advanced Search Functionality**: Allows users to query the database based on various criteria to find relevant resumes.
- **Responsive Design**: The application is designed to be responsive and user-friendly across different devices.

## Tech Stack

- **Frontend**: React, React Router, Ant Design
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT, bcrypt
- **Other Tools**: Tailwind CSS, dotenv, nodemon

## Setup and Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/breach.git
   cd breach
   ```

2. **Install dependencies**:
    ```bash
   npm install
   ```

3. **Set up the PostgreSQL database**:
- Ensure PostgreSQL is installed and running.
- Create a new database for the project.
- Run the data.sql script to set up the necessary tables:
    ```bash
   psql -U yourusername -d yourdatabase -f data.sql
   ```

4. **Set up environment variables**:
- Create a .env file in the root directory and add the following variables:
```bash
PORT=8000
HOST=localhost
USER=your_db_user
PASSWORD=your_db_password
DATABASE=your_db_name
DBPORT=5432
REACT_APP_SERVERURL=http://localhost:8000
```

5. **Start the server**:
    ```bash
    cd backend
    npm start
    ```

6. **Run the frontend**:
    ```bash
    cd frontend
    npm start
    ```

## Usage
- **Sign Up/Login**: Users can sign up and log in using their email and password.
- **Upload Documents**: After logging in, users can upload resumes and job application data.
- **Search**: Users can query the database based on various criteria to find relevant resumes.

## API Endpoints

### Authentication
- **POST /signup**: Register a new user.
- **POST /login**: Log in an existing user.

### Resumes and Jobs
- **GET /breaches**: Retrieve all breaches.
- **GET /breaches/:query**: Retrieve breaches based on the query.
- **POST /documents**: Upload a new document.
- **POST /breaches**: Upload a new breach.
- **GET /myBreaches/:userEmail**: Retrieve all breaches uploaded by a specific user.
- **GET /documents/:userEmail**: Retrieve all documents uploaded by a specific user.

## Demo
https://github.com/user-attachments/assets/cf6c62eb-e528-47b8-9be1-265282ccb056
