# E-commerce Dashboard

![Project Banner](E:\Udemy\MERN Stack Projects\e-commerce-dashboard\github-cover.png)

A full-stack, responsive E-commerce Dashboard application built with the MERN stack (MongoDB, Express, React, Node.js) and styled with Tailwind CSS. It provides a clean and intuitive interface for visualizing key business metrics and sales data.

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![GitHub issues](https://img.shields.io/github/issues/Shahriyar-Rahim/ecommerce-dashboard)](https://github.com/Shahriyar-Rahim/ecommerce-dashboard/issues)
[![GitHub stars](https://img.shields.io/github/stars/Shahriyar-Rahim/ecommerce-dashboard)](https://github.com/Shahriyar-Rahim/ecommerce-dashboard/stargazers)

---

## 🚀 Live Demo

**[View the live project here]** (*<-- Add your Vercel deployment link here!*)

---

## 📸 Screenshots

*Replace these placeholders with actual screenshots of your application.*

| Dashboard View                               | Mobile View                                |
| -------------------------------------------- | ------------------------------------------ |
| ![Dashboard Screenshot](E:\Udemy\MERN Stack Projects\e-commerce-dashboard\github-cover.png\800x500\1a202c\ffffff?text=Dashboard+View) | ![Mobile Screenshot](E:\Udemy\MERN Stack Projects\e-commerce-dashboard\github-cover.png\400x500\1a202c\ffffff?text=Mobile+View)    |

---

## ✨ Features

-   **Data Visualization:** Interactive charts and graphs powered by **Recharts** to display sales trends, revenue, and other key metrics.
-   **Key Performance Indicators (KPIs):** At-a-glance view of essential data like total sales, active users, and order volume.
-   **Responsive Design:** A fully responsive user interface built with **Tailwind CSS**, ensuring a seamless experience on all devices.
-   **Fast & Efficient Backend:** A robust RESTful API built with **Express.js** and **Node.js**.
-   **Server-Side Caching:** Implemented with `node-cache` to reduce database load and improve API response times.
-   **Optimized Performance:** The frontend is built with **Vite** for a faster and more efficient development and build process.

---

## 🛠️ Tech Stack

### Backend (Server-side)

| Technology      | Description                              |
| --------------- | ---------------------------------------- |
| **Node.js** | JavaScript runtime environment           |
| **Express.js** | Web application framework for Node.js    |
| **MongoDB** | NoSQL database                           |
| **CORS** | Middleware for enabling Cross-Origin Resource Sharing |
| **dotenv** | Module for loading environment variables |
| **node-cache** | In-memory caching for performance        |
| **Compression** | Middleware for GZIP compression          |

### Frontend (Client-side)

| Technology         | Description                                     |
| ------------------ | ----------------------------------------------- |
| **React** | A JavaScript library for building user interfaces |
| **Vite** | Next-generation frontend tooling                |
| **Tailwind CSS** | A utility-first CSS framework                   |
| **Axios** | Promise-based HTTP client for the browser       |
| **Recharts** | A composable charting library built on React    |
| **React Icons** | Library for including popular icons in React projects |

---

## ⚙️ Getting Started

Follow these instructions to set up the project locally on your machine.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   [Git](https://git-scm.com/)
-   A [MongoDB](https://www.mongodb.com/) database instance (local or cloud-based like MongoDB Atlas)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Shahriyar-Rahim/ecommerce-dashboard.git](https://github.com/Shahriyar-Rahim/ecommerce-dashboard.git)
    cd ecommerce-dashboard
    ```

2.  **Set up the Backend:**
    ```bash
    # Navigate to the server directory
    cd server

    # Install dependencies
    npm install

    # Create a .env file in the /server directory
    touch .env
    ```

3.  **Configure Environment Variables:**
    Add the following variables to your `server/.env` file. Replace the placeholder with your own MongoDB connection string.
    ```env
    # .env
    PORT=5000
    MONGODB_URI=your_mongodb_connection_string_here
    ```

4.  **Set up the Frontend:**
    ```bash
    # Navigate to the client directory from the root
    cd ../client

    # Install dependencies
    npm install
    ```

### Running the Application

You will need to run the backend and frontend servers in two separate terminal windows.

1.  **Start the Backend Server:**
    ```bash
    # From the /server directory
    npm start
    ```
    The server should now be running on `http://localhost:5000`.

2.  **Start the Frontend Development Server:**
    ```bash
    # From the /client directory
    npm run dev
    ```
    The React application will open and run on `http://localhost:5173` (or another port if 5173 is in use).

---

## 📦 API Endpoints

Here are the main API endpoints provided by the backend server.

| Method | Endpoint        | Description                               |
| ------ | --------------- | ----------------------------------------- |
| `GET`  | `/api/dashboard/analytics`    | Retrieves key statistics for the dashboard. |

*(You can add more endpoints here as you develop them)*

---

## 📜 License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for more details.

---

## 👨‍💻 Author

**Shahriyar Rahim**

-   GitHub: [@Shahriyar-Rahim](https://github.com/Shahriyar-Rahim)

Feel free to reach out if you have any questions or feedback!