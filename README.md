# BDF LAB 3 – Book Management API

## Project Overview

This project is a **Book Management REST API** developed using Node.js and SQLite database.

It allows users to perform CRUD operations (Create, Read, Update, Delete) on books. It also supports searching, sorting, filtering, and pagination using query parameters.

**Deployed Application URL:**

https://bdf-lab-3-production.up.railway.app

**GitHub Repository:**

https://github.com/kiranganji4787-source/BDF-LAB-3

---

## API Operations

### 1. Get All Books

- **Method:** GET
- **Endpoint:** `/books`
- **URL:** https://bdf-lab-3-production.up.railway.app/books

**Explanation:**

This operation retrieves all books stored in the SQLite database. It displays the available book details, including ID, title, author, and price.

**Expected Result:** Returns a list of all available books.

### 2. Get Book By ID

- **Method:** GET
- **Endpoint:** `/books/:id`
- **Example URL:** https://bdf-lab-3-production.up.railway.app/books/1

**Explanation:**

This operation retrieves a particular book using its unique ID. The user provides the book ID in the URL, and the API returns the matching book details.

**Expected Result:** Returns the details of the book with the specified ID.

### 3. Add Book Using POST

- **Method:** POST
- **Endpoint:** `/books`

**URL:**
https://bdf-lab-3-production.up.railway.app/books

**Request Body (JSON):**

```json
{
  "title": "Java Programming",
  "author": "James Gosling",
  "price": 500
}
```

**Explanation:**

This operation adds a new book to the database. The user sends book details through the request body using the POST method.

**Expected Result:** A new book is created and stored in the database.

### 4. Sorting in Ascending Order

- **Method:** GET
- **Endpoint:** `/books?order_by=price&order=asc`

**URL:**
https://bdf-lab-3-production.up.railway.app/books?order_by=price&order=asc

**Explanation:**

This operation sorts books based on their price in ascending order. It displays books from the lowest price to the highest price.

**Expected Result:** Books are displayed in ascending order of price.

### 5. Offset (Pagination)

- **Method:** GET
- **Example Endpoint:** `/books?limit=5&offset=5`

**URL:**
https://bdf-lab-3-production.up.railway.app/books?limit=5&offset=5

**Explanation:**

Offset is used for pagination. The limit specifies the maximum number of books to retrieve, while offset specifies how many records to skip.

For example:
- `limit=5` retrieves 5 books.
- `offset=5` skips the first 5 books.

**Expected Result:** Returns the next 5 books after skipping the first 5 records.

### 6. Search Books Using GET

- **Method:** GET
- **Example Endpoint:** `/books?search_q=Java`

**URL:**
https://bdf-lab-3-production.up.railway.app/books?search_q=Java

**Explanation:**

This operation searches for books using a search keyword. It checks the book title and returns matching records.

**Expected Result:** Returns books matching the search keyword.

### 7. Book Not Found Using GET

- **Method:** GET
- **Endpoint:** `/books/:id`
- **Example URL:** https://bdf-lab-3-production.up.railway.app/books/999999

**Explanation:**

This operation checks what happens when a user requests a book ID that does not exist in the database.

**Expected Result:** Returns a 404 Not Found error with an appropriate error message.

### 8. Delete Book

- **Method:** DELETE
- **Endpoint:** `/books/:id`
- **Example URL:** https://bdf-lab-3-production.up.railway.app/books/1

**Explanation:**

This operation deletes a particular book from the database using its unique ID.

**Expected Result:** The selected book is deleted successfully.

### 9. Delete Book Not Found

- **Method:** DELETE
- **Endpoint:** `/books/:id`
- **Example URL:** https://bdf-lab-3-production.up.railway.app/books/999999

**Explanation:**

This operation attempts to delete a book using an ID that does not exist in the database.

**Expected Result:** Returns a 404 Not Found error because the requested book does not exist.

### 10. Update Book Using PUT

- **Method:** PUT
- **Endpoint:** `/books/:id`
- **Example URL:** https://bdf-lab-3-production.up.railway.app/books/1

**Request Body (JSON):**

```json
{
  "title": "Advanced Java",
  "author": "James Gosling",
  "price": 750
}
```

**Explanation:**

This operation updates the details of an existing book. The user provides the book ID in the URL and the updated details in the request body.

**Expected Result:** The existing book information is updated successfully.

### 11. Update Book Not Found Using PUT

- **Method:** PUT
- **Endpoint:** `/books/:id`
- **Example URL:** https://bdf-lab-3-production.up.railway.app/books/999999

**Request Body (JSON):**

```json
{
  "title": "Python Programming",
  "author": "Guido van Rossum",
  "price": 600
}
```

**Explanation:**

This operation attempts to update a book using an ID that does not exist in the database.

**Expected Result:** Returns a 404 Not Found error because the requested book does not exist.

---

## Technologies Used

- Node.js – Backend runtime environment.
- Express.js – Framework for building REST APIs.
- SQLite – Database for storing book records.
- Postman – Used for API testing.
- Git and GitHub – Used for version control and code hosting.
- Railway – Used for application deployment.

## Database Structure

The project uses an SQLite database with the following table structure:

| Column | Data Type | Description |
|---|---|---|
| id | INTEGER | Unique book ID |
| title | TEXT | Book title |
| author | TEXT | Book author |
| price | REAL | Book price |

## HTTP Methods Used

| Method | Purpose |
|---|---|
| GET | Retrieve book information |
| POST | Add a new book |
| PUT | Update an existing book |
| DELETE | Delete a book |

## Conclusion

The Book Management API demonstrates the implementation of REST API operations using Node.js, Express.js, and SQLite.

It supports retrieving, adding, updating, deleting, searching, sorting, filtering, and pagination of book records. All API operations were tested using Postman and the application was deployed on Railway.
