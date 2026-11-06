
require("dotenv").config();

const express = require("express");
const { dbReady, run, get, all } = require("./db");

const app = express();

app.use(express.json());

// HOME ROUTE - DISPLAY ALL BOOKS
app.get("/", async (req, res, next) => {
    try {
        await dbReady;
        const books = await all("SELECT * FROM books ORDER BY id ASC");
        res.status(200).json(books);
    } catch (error) {
        next(error);
    }
});

// GET ALL BOOKS WITH SEARCH, SORTING, FILTERING AND PAGINATION
app.get("/books", async (req, res, next) => {
    try {
        const {
            search_q,
            order_by = "id",
            order = "ASC",
            limit = "10",
            offset = "0",
            min_price,
            max_price
        } = req.query;

        const allowedColumns = ["id", "title", "author", "price"];

        if (!allowedColumns.includes(order_by)) {
            return res.status(400).json({
                message: "Invalid order_by value"
            });
        }

        const sortOrder = order.toUpperCase();

        if (!["ASC", "DESC"].includes(sortOrder)) {
            return res.status(400).json({
                message: "Order must be ASC or DESC"
            });
        }

        const pageLimit = Number(limit);
        const pageOffset = Number(offset);

        if (
            !Number.isInteger(pageLimit) ||
            pageLimit <= 0 ||
            !Number.isInteger(pageOffset) ||
            pageOffset < 0
        ) {
            return res.status(400).json({
                message: "Invalid limit or offset"
            });
        }

        const conditions = [];
        const params = [];

        if (search_q !== undefined) {
            conditions.push("title LIKE ?");
            params.push(`%${search_q}%`);
        }

        if (min_price !== undefined) {
            const min = Number(min_price);

            if (!Number.isFinite(min) || min < 0) {
                return res.status(400).json({
                    message: "Invalid minimum price"
                });
            }

            conditions.push("price >= ?");
            params.push(min);
        }

        if (max_price !== undefined) {
            const max = Number(max_price);

            if (!Number.isFinite(max) || max < 0) {
                return res.status(400).json({
                    message: "Invalid maximum price"
                });
            }

            conditions.push("price <= ?");
            params.push(max);
        }

        if (
            min_price !== undefined &&
            max_price !== undefined &&
            Number(min_price) > Number(max_price)
        ) {
            return res.status(400).json({
                message: "Minimum price cannot exceed maximum price"
            });
        }

        let sql = "SELECT * FROM books";

        if (conditions.length > 0) {
            sql += " WHERE " + conditions.join(" AND ");
        }

        sql += ` ORDER BY ${order_by} ${sortOrder} LIMIT ? OFFSET ?`;

        params.push(pageLimit, pageOffset);

        const books = await all(sql, params);

        res.status(200).json(books);

    } catch (error) {
        next(error);
    }
});

// GET BOOK BY ID
app.get("/books/:id", async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid book ID"
            });
        }

        const book = await get(
            "SELECT * FROM books WHERE id = ?",
            [id]
        );

        if (!book) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.status(200).json(book);

    } catch (error) {
        next(error);
    }
});

// VALIDATE BOOK DETAILS
function validateBook(req, res, next) {
    const { title, author, price } = req.body || {};

    if (
        typeof title !== "string" ||
        !title.trim() ||
        typeof author !== "string" ||
        !author.trim() ||
        typeof price !== "number" ||
        !Number.isFinite(price) ||
        price < 0
    ) {
        return res.status(400).json({
            message: "Title, author and valid numeric price are required"
        });
    }

    req.bookData = {
        title: title.trim(),
        author: author.trim(),
        price
    };

    next();
}

// POST - CREATE BOOK
app.post("/books", validateBook, async (req, res, next) => {
    try {
        const { title, author, price } = req.bookData;

        const result = await run(
            "INSERT INTO books (title, author, price) VALUES (?, ?, ?)",
            [title, author, price]
        );

        const newBook = await get(
            "SELECT * FROM books WHERE id = ?",
            [result.lastID]
        );

        res.status(201).json({
            message: "Book created successfully",
            book: newBook
        });

    } catch (error) {
        next(error);
    }
});

// PUT - UPDATE BOOK
app.put("/books/:id", validateBook, async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid book ID"
            });
        }

        const { title, author, price } = req.bookData;

        const result = await run(
            `UPDATE books
             SET title = ?, author = ?, price = ?
             WHERE id = ?`,
            [title, author, price, id]
        );

        if (result.changes === 0) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

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

// DELETE - DELETE BOOK
app.delete("/books/:id", async (req, res, next) => {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Invalid book ID"
            });
        }

        const result = await run(
            "DELETE FROM books WHERE id = ?",
            [id]
        );

        if (result.changes === 0) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.status(200).json({
            message: "Book deleted successfully"
        });

    } catch (error) {
        next(error);
    }
});

// HANDLE UNKNOWN ROUTES
app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});

// ERROR HANDLER
app.use((error, req, res, next) => {
    console.error(error);

    if (
        error instanceof SyntaxError &&
        error.status === 400 &&
        "body" in error
    ) {
        return res.status(400).json({
            message: "Invalid JSON format"
        });
    }

    res.status(500).json({
        message: "Internal server error"
    });
});

// START SERVER AFTER DATABASE INITIALIZATION
const PORT = process.env.PORT || 3000;

dbReady
    .then(() => {
        console.log("Database connected and initialized");

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Database initialization failed:", error);
        process.exit(1);
    });
