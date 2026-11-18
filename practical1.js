
const express = require('express');
const app = express();

const books = require('./data/books');


app.use(express.json());

app.get('/', (req, res) => {
    res.send("Welcome to Library Management System");
    
});


// 1. GET - Get all books
app.get('/books', (req, res) => {
    res.status(200).json({
        message: "All books fetched successfully",
        books: books
    });
});


// 2. GET - Get book by ID
app.get('/books/:id', (req, res) => {

    const id = parseInt(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    res.status(200).json(book);
});


// 3. POST - Add a new book
app.post('/books', (req, res) => {

    const { title, author, category } = req.body;

    if (!title || !author || !category) {
        return res.status(400).json({
            message: "Please provide title, author and category"
        });
    }

    const newBook = {
        id: books.length > 0
            ? Math.max(...books.map(b => b.id)) + 1
            : 1,
        title: title,
        author: author,
        category: category,
        available: true
    };

    books.push(newBook);

    res.status(201).json({
        message: "Book added successfully",
        book: newBook
    });
});


// 4. PUT - Update complete book details
app.put('/books/:id', (req, res) => {

    const id = parseInt(req.params.id);

    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const { title, author, category, available } = req.body;

    if (!title || !author || !category ||
        typeof available !== 'boolean') {
        return res.status(400).json({
            message: "Provide all book details"
        });
    }

    books[index] = {
        id: id,
        title,
        author,
        category,
        available
    };

    res.status(200).json({
        message: "Book updated successfully",
        book: books[index]
    });
});


// 5. PATCH - Update partial book details
app.patch('/books/:id', (req, res) => {

    const id = parseInt(req.params.id);

    const book = books.find(b => b.id === id);

    if (!book) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const { title, author, category, available } = req.body;

    if (
        (title !== undefined && typeof title !== 'string') ||
        (author !== undefined && typeof author !== 'string') ||
        (category !== undefined && typeof category !== 'string') ||
        (available !== undefined && typeof available !== 'boolean')
    ) {
        return res.status(400).json({
            message: "Invalid book details"
        });
    }

    Object.assign(book, req.body);

    res.status(200).json({
        message: "Book updated successfully",
        book: book
    });
});


// 6. DELETE - Delete a book
app.delete('/books/:id', (req, res) => {

    const id = parseInt(req.params.id);

    const index = books.findIndex(b => b.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Book not found"
        });
    }

    const deletedBook = books.splice(index, 1);

    res.status(200).json({
        message: "Book deleted successfully",
        book: deletedBook[0]
    });
});


// Start server
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Library server running on port ${PORT}`);
});
