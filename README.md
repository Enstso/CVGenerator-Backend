
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

| Method | Endpoint                              | Description                                   |
|--------|--------------------------------------|-----------------------------------------------|
| POST   | `/api/auth/register`                 | Register a new user                           |
| POST   | `/api/auth/login`                    | Log in user and set a session cookie with JWT |
| GET    | `/api/auth/logout`                   | Log out the authenticated user               |
| GET    | `/api/users`                         | Retrieve information of the authenticated user |
| PUT    | `/api/users`                         | Update user account information              |
| DELETE | `/api/users`                         | Delete the authenticated user account        |
| POST   | `/api/cvs`                           | Create a new CV                              |
| GET    | `/api/cvs`                           | Get all public CVs                           |
| GET    | `/api/cvs/{id}`                      | Retrieve a specific CV by its ID             |
| PUT    | `/api/cvs/{id}`                      | Update a CV by its ID                        |
| DELETE | `/api/cvs/{id}`                      | Delete a CV by its ID                        |
| GET    | `/api/cvs/user/myCvs`                | Retrieve all CVs created by the authenticated user |
| POST   | `/api/recommendations`               | Create a new recommendation for a CV         |
| GET    | `/api/recommendations`               | Get all recommendations by the authenticated user |
| GET    | `/api/recommendations/{id}`          | Retrieve a specific recommendation by its ID |
| GET    | `/api/recommendations/cv/{cvId}`     | Get all recommendations for a specific CV    |
| DELETE | `/api/recommendations/{id}`          | Delete a recommendation by its ID            |


---

## **Authentication Routes**

### **1. Register a New User**

**POST** `/api/auth/register`

- **Description**: Create a new user account.
- **Request Body**:
  ```json
  {
  "username": "johndoe",
  "email": "john.doe@example.com",
  "password": "P@ssw0rd!",
  "firstname": "John",
  "lastname": "Doe"
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

**GET** `/api/auth/logout`

- **Description**: Clear authentication cookies to log out the user.
- **Responses**:
  - `200`: Successfully logged out.
  - `500`: Internal server error.

---

## **User Routes**

### **1. Retrieve User Information**

**POST** `/api/users`

- **Description**: Fetches information of the currently authenticated user.
- **Headers**:
  - cookie: Contains the `jwt` session token.
- **Responses**:
  - `200`: User details retrieved successfully.
  - `401`: Unauthorized access (if no valid cookie is provided).
  - `500`: Internal server error.

---

### **2. Update User Information**

**PUT** `/api/users`

- **Description**: Allows the authenticated user to update their profile information, including their password.
- **Headers**:
  - cookie: Contains the `jwt` session token.
- **Request Body**:
  ```json
  {
      "username": "new_username",
      "firstname": "NewFirstName",
      "lastname": "NewLastName",
      "email": "new.email@example.com",
      "oldPassword": "CurrentPassword123",
      "password": "NewPassword123"
  }
  ```
- **Responses**:
  - `200`: User updated successfully.
  - `400`: Invalid input or incorrect current password.
  - `404`: User not found.
  - `500`: Internal server error.

---

### **3. Delete User**

**DELETE** `/api/users`

- **Description**: Deletes the authenticated user's account permanently.
- **Headers**:
  - cookie: Contains the `jwt` session token.
- **Responses**:
  - `200`: User deleted successfully.
  - `400`: Unauthorized access (if the user tries to delete another account).
  - `404`: User not found.
  - `500`: Internal server error.

---

## **CV Routes**

### **1. Create a CV**

**POST** `/api/cvs`

- **Description**: Create a new CV for the authenticated user.
- **Headers**:
  - cookie: Contains the `jwt` session token.
- **Request Body**:
  ```json
  {
      "title": "Software Engineer",
      "summary": "Experienced in full-stack development.",
      "skills": ["JavaScript", "React", "Node.js"],
      "experiences": [
        {
          "company": "Tech Corp",
          "position": "Developer",
          "startDate": "2020-01-01",
          "endDate": "2022-01-01",
          "description": "Worked on various projects using modern technologies."
        }
      ],
      "education": [
        {
          "school": "Tech University",
          "degree": "Bachelor's in Computer Science",
          "startDate": "2015-09-01",
          "endDate": "2019-06-01"
        }
      ],
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

- **Description**: Retrieve all publicly visible CVs.
- **Responses**:
  - `200`: List of publics CVs.
  - `500`: Internal server error.

---

### **3. Get a CV by ID**

**GET** `/api/cvs/{id}`

- **Description**: Retrieve a specific CV by its ID. Private CVs can only be accessed by their owners.
- **Headers**:
  - cookie: Contains the `jwt` session token.
- **Responses**:
  - `200`: CV details retrieved successfully.
  - `403`: Unauthorized to access a private CV.
  - `404`: CV not found.
  - `500`: Internal server error.
---

### **4. Get Authenticated User's CVs**

**GET** `/api/cvs/user/myCvs`

- **Description**: Retrieve all CVs created by the authenticated user.
- **Headers**:
  - cookie: Contains the `jwt` session token.
- **Responses**:
  - `200`: List of user's CVs.
  - `404`: No CVs found for the user.
  - `401`: Unauthorized.
  - `500`: Internal server error.
---

### **5. Update a CV**

**PUT** `/api/cvs/{id}`

- **Description**: Update a CV by ID. Only the owner of the CV can update it.
- **Headers**:
  - cookie: Contains the `jwt` session token.
- **Request Body**:
  ```json
  {
      "title": "Updated Software Engineer",
      "summary": "Updated description of professional experience.",
      "skills": ["UpdatedSkill1", "UpdatedSkill2"],
      "visibility": "private"
  }
  ```
- **Responses**:
  - `200`: CV updated successfully.
  - `403`: Unauthorized to update another user's CV.
  - `404`: CV not found.
  - `400`: Invalid input.
  - `500`: Internal server error.

---

### **6. Delete a CV**

**PUT** `/api/cvs/{id}`

- **Description**: Delete a CV by ID. Only the owner of the CV can delete it.
- **Headers**:
  - cookie: Contains the `jwt` session token.
- **Responses**:
  - `200`: CV deleted successfully.
  - `403`: Unauthorized to delete another user's CV.
  - `404`: CV not found.
  - `500`: Internal server error.
  
---

## **Recommendation Routes**

### **1. Retrieve Recommendations by User**

**GET** `/api/recommendations`

- **Description**: Fetches all recommendations created by the authenticated user.
- **Headers**:
  - cookie: Contains the `jwt` session token.
- **Responses**:
  - `200`: Successfully retrieved the user's recommendations.
  - `401`: Unauthorized access (if no valid token is provided).
  - `500`: Internal server error.

---

### **2. Create a Recommendation**

**POST** `/api/recommendations`

- **Description**: Allows an authenticated user to create a new recommendation for a specific CV.
- **Headers**:
  - cookie: Contains the `jwt` session token.
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
  - `404`: CV not found.
  - `500`: Internal server error.

---

### **3. Retrieve Recommendations by ID**

**GET** `/api/recommendations/{cvId}`

- **Description**: Fetches the details of a specific recommendation by its ID.
- **Responses**:
  - `200`: Recommendations retrieved successfully.
  - `404`: CV not found.
  - `500`: Internal server error.

---

### **4. Retrieve Recommendations for a CV**

**GET** `/api/recommendations/cv/{cvId}`

- **Description**: Retrieves all recommendations associated with a specific CV.
- **Responses**:
  - `200`: Recommendations retrieved successfully.
  - `404`: CV not found.
  - `500`: Internal server error.

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
