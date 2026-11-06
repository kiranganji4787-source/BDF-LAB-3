
require("dotenv").config();

const express = require("express");
const { dbReady, run, get, all } = require("./db");

const app = express();

// Middleware
app.use(express.json());

// Validate book data
function validateBook(title, author, price) {
    if (
        typeof title !== "string" ||
        !title.trim() ||
        typeof author !== "string" ||
        !author.trim() ||
        price === undefined ||
        price === null ||
        price === "" ||
        !Number.isFinite(Number(price)) ||
        Number(price) < 0
    ) {
        return false;
    }

    return true;
}

// GET / - Display all books
app.get("/", async (req, res, next) => {
    try {
        const books = await all("SELECT * FROM books");
        res.status(200).json(books);
    } catch (error) {
        next(error);
    }
});

// GET /books - Get all books with search, sorting and pagination
app.get("/books", async (req, res, next) => {
    try {
        const {
            search_q,
            title,
            order_by = "id",
            order = "ASC",
            limit = 10,
            offset = 0,
            min_price,
            max_price
        } = req.query;

        const allowedColumns = ["id", "title", "author", "price"];

        if (!allowedColumns.includes(order_by)) {
            return res.status(400).json({
                error: "Invalid sorting column"
            });
        }

        if (!["ASC", "DESC"].includes(order.toUpperCase())) {
            return res.status(400).json({
                error: "Invalid sorting order"
            });
        }

        const pageLimit = Number(limit);
        const pageOffset = Number(offset);

        if (
            !Number.isInteger(pageLimit) ||
            pageLimit < 1 ||
            !Number.isInteger(pageOffset) ||
            pageOffset < 0
        ) {
            return res.status(400).json({
                error: "Invalid limit or offset"
            });
        }

        let sql = "SELECT * FROM books WHERE 1=1";
        const params = [];

        const search = search_q || title;

        if (search) {
            sql += " AND (title LIKE ? OR author LIKE ?)";
            params.push(`%${search}%`, `%${search}%`);
        }

        if (min_price !== undefined) {
            if (!Number.isFinite(Number(min_price))) {
                return res.status(400).json({
                    error: "Invalid minimum price"
                });
            }

            sql += " AND price >= ?";
            params.push(Number(min_price));
        }

        if (max_price !== undefined) {
            if (!Number.isFinite(Number(max_price))) {
                return res.status(400).json({
                    error: "Invalid maximum price"
                });
            }

            sql += " AND price <= ?";
            params.push(Number(max_price));
        }

        sql += ` ORDER BY ${order_by} ${order.toUpperCase()}`;
        sql += " LIMIT ? OFFSET ?";

        params.push(pageLimit, pageOffset);

        const books = await all(sql, params);

        res.status(200).json({
            count: books.length,
            books
        });
    } catch (error) {
        next(error);
    }
});

// GET /books/:id - Get book by ID
app.get("/books/:id", async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: "Invalid book ID"
            });
        }

        const book = await get(
            "SELECT * FROM books WHERE id = ?",
            [id]
        );

        if (!book) {
            return res.status(404).json({
                error: "Book not found"
            });
        }

        res.status(200).json(book);
    } catch (error) {
        next(error);
    }
});

// POST /books - Add a new book
app.post("/books", async (req, res, next) => {
    try {
        const { title, author, price } = req.body;

        if (!validateBook(title, author, price)) {
            return res.status(400).json({
                error: "Please provide valid title, author and price"
            });
        }

        const result = await run(
            "INSERT INTO books (title, author, price) VALUES (?, ?, ?)",
            [title.trim(), author.trim(), Number(price)]
        );

        const newBook = await get(
            "SELECT * FROM books WHERE id = ?",
            [result.lastID]
        );

        res.status(201).json({
            message: "Book added successfully",
            book: newBook
        });
    } catch (error) {
        next(error);
    }
});

// PUT /books/:id - Update a book
app.put("/books/:id", async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const { title, author, price } = req.body;

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: "Invalid book ID"
            });
        }

        if (!validateBook(title, author, price)) {
            return res.status(400).json({
                error: "Please provide valid title, author and price"
            });
        }

        const existingBook = await get(
            "SELECT * FROM books WHERE id = ?",
            [id]
        );

        if (!existingBook) {
            return res.status(404).json({
                error: "Book not found"
            });
        }

        await run(
            "UPDATE books SET title = ?, author = ?, price = ? WHERE id = ?",
            [title.trim(), author.trim(), Number(price), id]
        );

        const updatedBook = await get(
            "SELECT * FROM books WHERE id = ?",
            [id]
        );

        res.status(200).json({
            message: "Book updated successfully",
            book: updatedBook
        });
    } catch (error) {
        next(error);
    }
});

// DELETE /books/:id - Delete a book
app.delete("/books/:id", async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                error: "Invalid book ID"
            });
        }

        const existingBook = await get(
            "SELECT * FROM books WHERE id = ?",
            [id]
        );

        if (!existingBook) {
            return res.status(404).json({
                error: "Book not found"
            });
        }

        await run(
            "DELETE FROM books WHERE id = ?",
            [id]
        );

        res.status(200).json({
            message: "Book deleted successfully"
        });
    } catch (error) {
        next(error);
    }
});

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found"
    });
});

// Handle errors
app.use((err, req, res, next) => {
    console.error(err);

    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({
            error: "Invalid JSON format"
        });
    }

    res.status(500).json({
        error: "Internal server error"
    });
});

// Start server after database initialization
const PORT = process.env.PORT || 3000;

dbReady
    .then(() => {
        console.log("Database connected and initialized");

        app.listen(PORT, "0.0.0.0", () => {
           console.log("Server running at http://localhost:3000");
        });
    })
    .catch((error) => {
        console.error("Database initialization failed:", error);
        process.exit(1);
    });
