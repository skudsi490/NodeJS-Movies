# Project Documentation: NodeJS movies

## **Overview**

**NodeJS movies** is a web application designed for movie enthusiasts to explore, add, and manage their favorite movies. The platform features a user-friendly interface for browsing movies, a private area for personal movie collections, and user authentication for secure access. Developed using a Node.js backend and a simple HTML, CSS, and JavaScript frontend, the project showcases fundamental full-stack development concepts.

## **Structure**

The project is structured into two main directories: **`client`** and **`server`**, representing the frontend and backend components, respectively.

### **Client (Frontend)**

- **Assets**: Contains static files such as images and logos used across the web application.
- **Pages**: Houses HTML files for different views, including:
    - **`index.html`**: The homepage that lists all movies and includes a form to add new movies.
    - **`login.html`**: A login form for user authentication.
    - **`privatearea.html`**: A private area for users to view and manage their movie collections.
    - **`register.html`**: A registration form for new users.
- **Scripts**: JavaScript files providing interactivity and functionality to the web pages.
    - **`script.js`**: Contains common functionality such as user authentication and movie listing.
    - **`privateArea.js`**: Dedicated to the private area functionalities, including movie management.
- **Styles**: CSS files for styling the web pages, ensuring a consistent and responsive design.

### **Server (Backend)**

- **BLL (Business Logic Layer)**: Contains JavaScript files encapsulating the business logic.
    - **`authBLL.js`**: Handles user authentication processes.
    - **`movieBLL.js`**: Manages movie-related operations.
    - **`usersBLL.js`**: Deals with user account operations.
- **Configs**: Configuration files for the project.
    - **`connectDB.js`**: Manages database connection setup.
- **Logs**: Stores log files for various activities within the application.
- **Middleware**: Custom middleware functions for the Express app.
- **Models**: Defines Mongoose schemas for the application's data models.
    - **`movieModel.js`**: Schema for movie data.
    - **`usersModel.js`**: Schema for user account data.
- **Routers**: Express routers defining the application's endpoints.
    - **`authRouter.js`**: Endpoints related to user authentication.
    - **`movieRouter.js`**: Endpoints for movie-related operations.
    - **`usersRouter.js`**: Endpoints for user account management.
- **.env**: Environment variables for database connection strings, JWT secret keys, etc.
- **main.js**: The entry point of the Node.js application, setting up the Express server and middleware.

## **Key Features**

- **User Authentication**: Secure login and registration system with JWT for session management.
- **Movie Exploration**: Users can browse through an extensive list of movies on the homepage.
- **Private Movie Collections**: Authenticated users can add, edit, and delete movies in their private collection.
- **Responsive Design**: The frontend is designed to be responsive, providing a seamless experience across various devices.

## **Technologies**

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM for schema definition and data management.
- **Authentication**: JSON Web Tokens (JWT) for secure user authentication and session management.
- **Other Libraries**: bcrypt for password hashing, dotenv for environment variable management, and multer for file uploads.

## **Setup and Installation**

1. **Clone the Repository**: Clone the project to your local machine.
2. **Install Dependencies**: Navigate to the **`server`** directory and run **`npm install`** to install the necessary Node.js packages.
3. **Database Setup**: Ensure MongoDB is installed and running on your machine. Update the **`.env`** file with your MongoDB connection string.
4. **Start the Server**: Run **`node main.js`** from within the **`server`** directory to start the backend server.
5. **Access the Client**: Open the **`index.html`** file in a browser to access the frontend application.

## **Contributions**

This project is designed and developed by Sami Kudsi as part of a learning exercise in full-stack web development. Contributions, suggestions, and feedback are welcome to enhance the platform's features and user experience.