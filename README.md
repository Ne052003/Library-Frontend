# 📚 Online Library - Frontend

## Description

This project is a web frontend application for an online bookstore, developed with **React** and **Vite**. The application allows users to explore, purchase, and rent books, as well as manage their invoices and profiles.

## 🚀 Features

- **Authentication & Authorization:** User registration and login with JWT.
- **Book Catalog:** Browse and search for available books.
- **Shopping Cart:** Add books for purchase or rental.
- **Invoice Management:** View purchase and rental history.
- **User Profile:** Manage personal information.
- **Admin Panel:** Manage books, users, and invoices (Admin only).
- **Responsive Design:** Optimized for different screen sizes.

## 🛠️ Technologies Used

- **React:** Library for building user interfaces.
- **Vite:** Fast development build tool.
- **React Router:** Page navigation.
- **Material UI:** UI components.
- **Axios:** HTTP client for API communication.
- **JWT:** Token-based authentication.
- **Formik & Yup:** Form handling and validation.

## 📋 Prerequisites

- **Node.js** (v14.0.0 or higher)
- **npm** (v6.0.0 or higher)
- **Library REST API** (Spring Boot) running at `http://localhost:8080`

## 📦 Installation

1️⃣ Clone the repository:

```sh
git clone https://github.com/Ne052003/Library-Frontend.git
cd library-frontend
```

2️⃣ Install dependencies:

```sh
npm install
```

3️⃣ Create a `.env` file in the root directory:

```sh
VITE_API_URL=http://localhost:8080/library
```

4️⃣ Modify the `vite.config.js` file to add

```sh
base: "./",
```

5️⃣ Start the development server:

```sh
npm run dev
```

Open your browser at `http://localhost:5173`

## 📂 Project Structure

```
📦 library-frontend
 ┣ 📂 public
 ┣ 📂 src
 ┃ ┣ 📂 api
 ┃ ┣ 📂 components
 ┃ ┣ 📂 context
 ┃ ┣ 📂 pages
 ┃ ┣ 📂 utils
 ┃ ┣ 📜 App.jsx
 ┃ ┣ 📜 main.jsx
 ┣ 📜 .env
 ┣ 📜 package.json
 ┣ 📜 vite.config.js
```

## 🔄 Application Flow

1. **Home Page:** Users can browse the book catalog without logging in.
2. **Authentication:** To purchase or rent, users must sign up and log in.
3. **Exploration:** Users can search and view book details.
4. **Cart:** Users can add books to the cart (purchase or rent).
5. **Invoices:** Users can view their purchase and rental history.
6. **Administration:** Admins can manage books, users, and invoices.

## 👥 User Roles

- **User:** Can browse books, purchase, rent, and view their history.
- **Admin:** Can access the admin panel to manage the application.

## 📡 API Endpoints

The application interacts with a **Spring Boot REST API**. Key endpoints:

- `POST /auth/register`, `POST /auth/login` → User authentication.
- `GET /library/books`, `POST /library/books` → Book management.
- `GET /library/users`, `POST /library/users` → User management.
- `GET /library/bills`, `POST /library/bills` → Invoice management.

## 🚀 Deployment

To build the application for production:

```sh
npm run build
```

This generates a `dist` folder with optimized files ready for deployment on any static web server.

## 🤝 Contributing

1. **Fork the repository**
2. **Create a new branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request** 🚀

## 📜 License

This project is licensed under the **MIT License**.

## 📬 Contact

Neoly Alexis Moreno - alxism16@gmail.com

**Project Link:** [GitHub Repository](https://github.com/Ne052003/Library-Frontend.git)
