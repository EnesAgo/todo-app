const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3001

// Middleware
app.use(express.json())
app.use(cors())

// MongoDB connection
const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/todoapp'
mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err))

// Todo schema and model
const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
})

const Todo = mongoose.model('Todo', todoSchema)

// Routes

// Get all todos
app.get('/toDoList', async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 })
    res.json(todos)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todos' })
  }
})

// Create new todo
app.post('/newToDo', async (req, res) => {
  try {
    const { text } = req.body
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Todo text is required' })
    }

    const newTodo = new Todo({ text: text.trim() })
    const savedTodo = await newTodo.save()
    res.status(201).json(savedTodo)
  } catch (error) {
    res.status(500).json({ error: 'Failed to create todo' })
  }
})

// Delete todo
app.delete('/deleteToDo', async (req, res) => {
  try {
    const { id } = req.query
    if (!id) {
      return res.status(400).json({ error: 'Todo ID is required' })
    }

    const deletedTodo = await Todo.findByIdAndDelete(id)
    if (!deletedTodo) {
      return res.status(404).json({ error: 'Todo not found' })
    }

    res.json({ message: 'Todo deleted successfully', todo: deletedTodo })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo' })
  }
})

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Todo API is running!' })
})

app.listen(port, () => {
  console.log(`Todo API listening on port ${port}`)
})
