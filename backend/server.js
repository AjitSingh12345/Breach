const PORT = process.env.PORT ?? 8000
const express = require('express')
const { v4: uuidv4 } = require('uuid')
const app = express()
const pool = require('./connection')
const cors = require('cors')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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

// signup
app.post('/signup', async (req, res) => {
    const { email, password } = req.body
    // # of rounds u salt password w
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)
    try {
        const signup = await pool.query(`insert into users (email, hashed_password) VALUES($1, $2)`, 
        [email, hashedPassword])
        const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' })
        res.json({ email, token })
    } catch (err) {
        console.error(err)
        if (err) {
            res.json({ detail: err.detail })
        }
    }
})

// login
app.post('/login', async (req, res) => {
    const { email, password } = req.body
    try {
        // check against hashed password
        const users = await pool.query('select * from users where email = $1', [email])
        
        if (!users.rows.length) return res.json({ detail: 'User does not exist!' })
        
        const success = await bcrypt.compare(password, users.rows[0].hashed_password)
        const token = jwt.sign({ email }, 'secret', { expiresIn: '1hr' })

        if (success) {
            res.json({ 'email' : users.rows[0].email, token })
        } else {
            res.json({ detail: "Login failed" })
        }
    } catch (err) {
        console.error(err)
    }
})

app.listen(PORT, () => {
    console.log('connected to db & listening to port', PORT)
})

