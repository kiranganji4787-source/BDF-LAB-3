
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

// Database location
const databasePath = path.resolve(
    process.env.DB_PATH || "./books.db"
);

// Create database directory if it does not exist
const databaseDirectory = path.dirname(databasePath);
fs.mkdirSync(databaseDirectory, { recursive: true });

// Connect to SQLite database
const db = new sqlite3.Database(databasePath);

function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (error) {
            if (error) {
                reject(error);
            } else {
                resolve({
                    lastID: this.lastID,
                    changes: this.changes
                });
            }
        });
    });
}

function get(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.get(sql, params, (error, row) => {
            if (error) {
                reject(error);
            } else {
                resolve(row);
            }
        });
    });
}

function all(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (error, rows) => {
            if (error) {
                reject(error);
            } else {
                resolve(rows);
            }
        });
    });
}

// Initialize database
async function initializeDatabase() {
    await run(`
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            price REAL NOT NULL
        )
    `);

    const result = await get(
        "SELECT COUNT(*) AS count FROM books"
    );

    if (result.count === 0) {
        const books = [
            ["Python Programming", "John Smith", 500],
            ["Java Programming", "Robert Martin", 600],
            ["C Programming", "Dennis Ritchie", 450],
            ["C++ Programming", "Bjarne Stroustrup", 550],
            ["JavaScript Basics", "David Flanagan", 400],
            ["HTML and CSS", "Jon Duckett", 350],
            ["Data Structures", "Mark Allen Weiss", 700],
            ["Database Management", "Raghu Ramakrishnan", 650],
            ["Machine Learning", "Tom Mitchell", 800],
            ["Artificial Intelligence", "Stuart Russell", 900]
        ];

        for (const book of books) {
            await run(
                "INSERT INTO books (title, author, price) VALUES (?, ?, ?)",
                book
            );
        }
    }
}

const dbReady = initializeDatabase();

module.exports = {
    db,
    dbReady,
    run,
    get,
    all
};
