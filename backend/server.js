require('dotenv').config()
const express = require('express')
const client = require('./connection.js')
const app = express()

client.connect()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log('connected to db & listening to port ', process.env.PORT)
        })
    })
    .catch((err) => {
        console.log(err)
    })

app.get('/users', (req, res) => {
    client.query('Select * from users', (err, result) => {
        if (!err) {
            res.send(result.rows)
        }
    })
    client.end
})

app.get('/users/:id&:location', (req, res) => {
    console.log(req.params)
    client.query('select * from users where id = $1 and location = $2', [req.params.id, req.params.location], (err, result) => {
        if (!err) {
            res.send(result.rows)
        }
    })
    client.end
})