const PORT = process.env.PORT ?? 8000
const express = require('express')
const { v4: uuidv4 } = require('uuid')
const app = express()
const pool = require('./connection')
const cors = require('cors')

app.use(cors())
app.use(express.json())

app.get('/todos/:userEmail', async (req, res) => {
    const { userEmail } = req.params
    try {
        const todos = await pool.query('select * from todos where user_email = $1', [userEmail])
        res.json(todos.rows)
    } catch (err) {
        console.log(error)
    }
})

// create a new todo
app.post('/todos', async (req, res) => {
    const { user_email, title, progress, date } = req.body 
    console.log(user_email, title, progress, date)
    const id = uuidv4()
    try {
        const newToDo = await pool.query(`insert into todos(id, user_email, title, progress, date) VALUES($1, $2, $3, $4, $5)`, 
        [id, user_email, title, progress, date])
        res.json(newToDo)
    } catch(err) {
        console.error(err)
    }
})

// edit a todo -- put req
app.put('/todos/:id', async (req, res) => {
    const { id } = req.params
    const { user_email, title, progress, date } = req.body
    try {
        // sql query to update 
        const editToDo = await pool.query(`UPDATE todos SET user_email = $1, title = $2, progress = $3, date = $4 where id = $5;`, 
        [user_email, title, progress, date, id])
        res.json(editToDo)
    } catch (err) {
        console.error(err)
    }
})


// delete a todo by its id (primary key)
app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params
    try {
        const deleteToDo = await pool.query('DELETE FROM todos where id = $1;', [id])
        res.json(deleteToDo)
    } catch (err) {
        console.error(err)
    }
})

app.listen(PORT, () => {
    console.log('connected to db & listening to port', PORT)
})

