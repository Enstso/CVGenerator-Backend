
# **CV Generator API**

## **Description**
The CV Generator API provides functionalities for user authentication, CV management, recommendations, and user information management. It is designed to allow users to create, update, and manage their CVs, as well as receive recommendations from other users.

---

## **Table of Contents**
- [Getting Started](#getting-started)
- [Model Design Logic](#model-design-logic)
- [Routes Overview](#routes-overview)
- [Authentication Routes](#authentication-routes)
- [User Routes](#user-routes)
- [CV Routes](#cv-routes)
- [Recommendation Routes](#recommendation-routes)
- [Running the Project](#running-the-project)
- [API Documentation](#api-documentation)

---

## **Getting Started**

### **Installation**
1. Clone the repository:
   ```bash
   git clone https://github.com/ltran-hub/CVGenerator-Backend.git
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up the environment variables by copying the `.env_example` file and renaming it to `.env`. Then, update the values inside the file with your MongoDB Atlas cluster credentials and other necessary configurations. Example:
   ```bash
   cp .env_example .env
   ```
   Example `.env_example` File:
   ```
   DATABASE_URL=mongodb+srv://<db_username>:<db_password>@cluster??????.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```

4. Start the server:
   ```bash
   npm start
   ```

---
## **Model Design Logic**
### **1. User Model**
The user model represents the basic information necessary to register a user in the application. Here are the key design elements:
- **First Name and Last Name (firstname, lastname)**: Identify each user.
- **Email**: Used for authentication and communication; it must be unique and mandatory.
- **Password**: Protected and encrypted to ensure user security.

### **2. Curriculum Vitae (CV) Model**
The CV model is designed to capture structured information about a CV. The following points explain its logic:
- **User (user)**: Each CV is associated with a specific user through a foreign key (ObjectId).
- **Title (title)**: Provides an idea of the job position or professional objective (e.g., "Software Engineer").
- **Summary (summary)**: Briefly describes skills and professional experiences.
- **Skills (skills)**: A list of relevant skills for the CV (e.g., "JavaScript", "React").
- **Professional Experiences (experiences)**: A history of previous jobs, including details such as the company, position, dates, and a description.
- **Education (education)**: A list of degrees or certifications obtained, with dates and institutions.
- **Visibility (visibility)**: Specifies whether the CV is public or private, allowing control over its accessibility.

### **3. Recommendation Model**
The recommendation model is designed to allow users to leave recommendations for CVs. The following concepts are included:
- **CV**: Each recommendation is associated with a specific CV.
- **User (user)**: The user who creates the recommendation.
- **Content (content)**: The text of the recommendation, describing skills or achievements.
- **Rating (rating)**: A score on a scale of 1 to 5, reflecting the quality or performance.
- **Timestamps (timestamps)**: Automatically records the date and time of creation and updates.

This structure is designed to capture clear and organized information while maintaining the relationship between users, CVs, and recommendations.
## **Routes Overview**

| Method | Endpoint                 | Description                                |
|--------|--------------------------|--------------------------------------------|
| POST   | `/api/auth/register`     | Register a new user                       |
| POST   | `/api/auth/login`        | Login user and receive JWT token          |
| POST   | `/api/users/me`          | Get information of the authenticated user |
| PUT    | `/api/users/update`      | Update user information                   |
| POST   | `/api/cvs`               | Create a new CV                           |
| GET    | `/api/cvs`               | Get all public CVs                        |
| GET    | `/api/cvs/{id}`          | Get a specific CV by ID                   |
| PUT    | `/api/cvs/{id}`          | Update a CV                               |
| DELETE | `/api/cvs/{id}`          | Delete a CV                               |
| POST   | `/api/recommendations`   | Create a new recommendation               |
| GET    | `/api/recommendations/{id}` | Get a recommendation by ID             |
| GET    | `/api/recommendations/cv/{cvId}` | Get recommendations for a CV        |
| DELETE | `/api/recommendations/{id}` | Delete a recommendation                 |

---

## **Authentication Routes**

### **1. Register a New User**

**POST** `/api/auth/register`

- **Description**: Create a new user account.
- **Request Body**:
  ```json
  {
    "firstname": "John",
    "lastname": "Doe",
    "email": "john.doe@example.com",
    "password": "P@ssw0rd!"
  }
  ```
- **Responses**:
  - `201`: User registered successfully.
  - `400`: Invalid input or missing fields.
  - `500`: Internal server error.

---

### **2. Login User**

**POST** `/api/auth/login`

- **Description**: Authenticate a user and return a JWT token.
- **Request Body**:
  ```json
  {
    "email": "john.doe@example.com",
    "password": "P@ssw0rd!"
  }
  ```
- **Responses**:
  - `200`: Successfully authenticated. Returns JWT token and user details.
  - `401`: Unauthorized - Invalid credentials.
  - `500`: Internal server error.

---

## **User Routes**

### **1. Get Current User Info**

**POST** `/api/users/me`

- **Description**: Retrieve information of the authenticated user.
- **Headers**:
  - Authorization: Bearer `<JWT_TOKEN>`
- **Responses**:
  - `200`: User details retrieved successfully.
  - `401`: Unauthorized - Invalid or missing token.

---

### **2. Update User Information**

**PUT** `/api/users/update`

- **Description**: Update personal information of the authenticated user.
- **Request Body**:
  ```json
  {
    "firstName": "Jane",
    "lastName": "Smith",
    "email": "jane.smith@example.com",
    "password": "NewPassword123"
  }
  ```
- **Responses**:
  - `200`: User updated successfully.
  - `400`: Invalid input.
  - `404`: User not found.

---

## **CV Routes**

### **1. Create a CV**

**POST** `/api/cvs`

- **Description**: Create a new CV for the authenticated user.
- **Headers**:
  - Authorization: Bearer `<JWT_TOKEN>`
- **Request Body**:
  ```json
  {
    "title": "Software Engineer",
    "summary": "Experienced in full-stack development.",
    "skills": ["JavaScript", "React", "Node.js"],
    "visibility": "public"
  }
  ```
- **Responses**:
  - `201`: CV created successfully.
  - `400`: Invalid input.
  - `401`: Unauthorized.

---

### **2. Get All Public CVs**

**GET** `/api/cvs`

- **Description**: Retrieve a list of all public CVs.
- **Responses**:
  - `200`: Successfully retrieved CVs.
  - `500`: Internal server error.

---

### **3. Get a CV by ID**

**GET** `/api/cvs/{id}`

- **Description**: Retrieve a specific CV by its ID.
- **Responses**:
  - `200`: CV details retrieved successfully.
  - `404`: CV not found.

---

### **4. Update a CV**

**PUT** `/api/cvs/{id}`

- **Description**: Update a CV belonging to the authenticated user.
- **Headers**:
  - Authorization: Bearer `<JWT_TOKEN>`
- **Request Body**:
  ```json
  {
    "title": "Updated Title",
    "summary": "Updated summary",
    "skills": ["JavaScript", "React"],
    "visibility": "private"
  }
  ```
- **Responses**:
  - `200`: CV updated successfully.
  - `401`: Unauthorized.
  - `404`: CV not found.

---

## **Recommendation Routes**

### **1. Create a Recommendation**

**POST** `/api/recommendations`

- **Description**: Create a recommendation for a specific CV.
- **Headers**:
  - Authorization: Bearer `<JWT_TOKEN>`
- **Request Body**:
  ```json
  {
    "cv": "cv_id",
    "content": "Excellent developer with great communication skills.",
    "rating": 5
  }
  ```
- **Responses**:
  - `201`: Recommendation created successfully.
  - `400`: Invalid input.
  - `401`: Unauthorized.

---

### **2. Get Recommendations for a CV**

**GET** `/api/recommendations/cv/{cvId}`

- **Description**: Retrieve recommendations for a specific CV by its ID.
- **Responses**:
  - `200`: Recommendations retrieved successfully.
  - `404`: CV not found.

---

## **Running the Project**

1. Run the server:
   ```bash
   npm start
   ```
2. Access the API documentation at:
   ```
   http://localhost:3000/api-docs
   ```

---

## **API Documentation**

The API documentation is built using **Swagger**. You can explore and test the endpoints by accessing the Swagger UI at:
```
http://localhost:3000/api-docs
```

--- 
