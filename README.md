# 📚 Books REST API

## 📌 Project Overview

The **Books REST API** is a backend application developed using Node.js, Express.js, and SQLite. It provides a simple and efficient way to manage book information through RESTful API endpoints.

The application allows users to perform CRUD operations (Create, Read, Update, and Delete) on book records. It uses an SQLite database to store and manage book details.

## 🎯 Project Objectives

- Understand the fundamentals of backend development.
- Learn how to build RESTful APIs using Express.js.
- Perform CRUD operations using HTTP methods.
- Connect a Node.js application with an SQLite database.
- Test API endpoints using Postman.
- Understand request handling and HTTP response codes.

## 🛠️ Technologies and Tools

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime environment |
| Express.js | Backend web framework |
| SQLite | Database management |
| JavaScript | Programming language |
| Postman | API testing |
| Visual Studio Code | Code editor |
| Git & GitHub | Version control and project hosting |

## ✨ Key Features

- **View All Books:** Retrieve all available book records.
- **View Book by ID:** Get details of a specific book.
- **Add New Book:** Insert a new book into the database.
- **Update Book:** Modify existing book information.
- **Delete Book:** Remove a book from the database.
- **Database Integration:** Store book records using SQLite.
- **Input Validation:** Validate incoming book information.
- **Error Handling:** Handle invalid requests and server errors.
- **Search and Filtering:** Find books based on supported search and filter options.
- **Sorting and Pagination:** Organize book results using supported options.

## 📂 Project Structure

```text
BDF-LAB-3/
│
├── app.js
├── db.js
├── package.json
├── package-lock.json
├── README.md
├── .gitignore
└── node_modules/
```

*Note: `node_modules/` is generated after installing dependencies and should not be uploaded to GitHub.*

## ⚙️ Installation and Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/kiranganji4787-source/BDF-LAB-3.git
```

### Step 2: Navigate to the Project Folder

```bash
cd BDF-LAB-3
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Start the Application

```bash
npm start
```

For development mode:

```bash
npm run dev
```

### Step 5: Access the Application

Open your browser and visit:

```text
http://localhost:3000
```

The application runs locally on port 3000.

## 🔗 API Endpoints

| HTTP Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Display all books |
| GET | `/books` | Retrieve all books |
| GET | `/books/:id` | Retrieve a book by ID |
| POST | `/books` | Add a new book |
| PUT | `/books/:id` | Update an existing book |
| DELETE | `/books/:id` | Delete a book |

## 📝 Sample API Requests

### 1. Add a New Book

**Method:** POST

**URL:** `http://localhost:3000/books`

**Request Body:**

```json
{
  "title": "React JS",
  "author": "Kiran Kumar",
  "price": 750
}
```

### 2. Update a Book

**Method:** PUT

**URL:** `http://localhost:3000/books/1`

**Request Body:**

```json
{
  "title": "Advanced JavaScript",
  "author": "John Smith",
  "price": 850
}
```

*Use an existing book ID when testing.*

### 3. Delete a Book

**Method:** DELETE

**URL:** `http://localhost:3000/books/1`

*Replace `1` with the ID of the book you want to delete.*

## 🧪 API Testing

The API endpoints were tested using **Postman**.

The following operations were tested:

- GET request to retrieve all books.
- GET request to retrieve a specific book.
- POST request to insert a new book.
- PUT request to update book details.
- DELETE request to remove a book.

## 🗄️ Database Details

The application uses SQLite as its database.

The `books` table stores the following information:

| Field | Description |
|---|---|
| id | Unique identifier for each book |
| title | Name of the book |
| author | Name of the book's author |
| price | Price of the book |

The database table is initialized automatically when the application starts.

## 🔐 Error Handling

The application handles common API errors, including:

- Invalid book ID.
- Book not found.
- Missing or invalid input fields.
- Invalid API routes.
- Internal server errors.

## 📖 Learning Outcomes

Through this project, the following concepts were practiced:

1. Creating a backend server using Node.js.
2. Building REST APIs with Express.js.
3. Understanding HTTP methods and status codes.
4. Connecting and interacting with an SQLite database.
5. Implementing CRUD operations.
6. Testing APIs using Postman.
7. Managing project versions using Git and GitHub.

## 🚀 Future Enhancements

- Add user authentication and authorization.
- Implement advanced book search.
- Add book categories and ratings.
- Create a frontend interface.
- Deploy the application to a cloud platform.
- Add automated API testing.

## 📄 License

This project is created for educational and learning purposes.
