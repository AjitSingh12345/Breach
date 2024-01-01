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

// GET 
app.get('/breaches/:query', async (req, res) => {
    console.log('get breaches w query: ', req.params.query)
    const query = req.params.query
    if (query) {
        console.log("sp: ", query, " -> ", query.split(':'))
        const queries = query.split(':')

        /*
        need to make replacements from whats in search form modal to column names in db
        */
        var replacements = [['|', '%'], ['previous_employers', 'previous_experiences'], ['expereince_keywords', 'previous_experiences'], ['college_attended', 'school_name']]
        for (let i = 0; i < replacements.length; i++) {
            if (queries.length > 1) queries[1] = queries[1].replaceAll(replacements[i][0], replacements[i][1]) // replacements to turn backend query to valid sql query
        }
        console.log("in stuff: ", queries[0], " ... ", queries[1]) 

        /*
        steps:
        1. get all the breaches that match the breach query
        2. get all the doc_id's of docs that match the doc query = valid_docs
        3. for all those breaches -> if its doc_id is in valid_doc -> ret this breach
        4. ... in view more modal -> fetch the doc w that doc id from documents

        sql query:
        `select * 
        from breaches
        where {queries[0]} AND doc_id IN (
            select doc_id
            from documents
            where {queries[1]};
        );`

        -- work on below 
        cases:
        - q0 can be empty, q1 can be empty
        - this affects the where or and statement
        */
        try {
            var fq = 
            `select * 
            from breaches`

            if (queries[0].length > 0 && queries[1].length > 0) {
                fq += 
                ` ${queries[0]} AND doc_id IN (
                    select doc_id
                    from documents
                    ${queries[1]}
                );`
            } else if (queries[0].length > 0) {
                fq += 
                ` ${queries[0]};`
            } else if (queries[1].length > 0) {
                fq += 
                ` WHERE doc_id IN (
                    select doc_id
                    from documents
                    ${queries[1]}
                );`
            } else {
                fq += `;`
            }

            console.log("fq: ", fq)
            const docs = await pool.query(fq)        
            res.json(docs.rows)
            console.log(docs.rows)
        } catch (err) {
            console.log(err)
        }
    }
})

app.get('/breaches', async (req, res) => {
    console.log('get breaches: ')
    try {
        const docs = await pool.query('select * from breaches')
        res.json(docs.rows)
    } catch (err) {
        console.log(err)
    }
})

app.get('/documents', async (req, res) => {
    try {
        console.log('heyy')
        const docs = await pool.query('select * from documents')
        res.json(docs.rows)
    } catch (err) {
        console.log(err)
    }
})

// get all breaches uploaded by user w email thats passed in
app.get('/myBreaches/:userEmail', async (req, res) => {
    const { userEmail } = req.params
    console.log("em: ", userEmail)
    try {
        const docs = await pool.query('select * from breaches where user_email = $1', [userEmail])
        res.json(docs.rows)
        console.log("ret q: ", docs.rows)
    } catch (err) {
        console.log(err)
    }
})

// get all documents uploaded by user w email thats passed in
app.get('/documents/:userEmail', async (req, res) => {
    const { userEmail } = req.params
    console.log(req.params)
    try {
        const docs = await pool.query('select * from documents where user_email = $1', [userEmail])
        res.json(docs.rows)
    } catch (err) {
        console.log(err)
    }
})

// get all documents uploaded by user w email thats passed in
app.get('/documents/byId/:id', async (req, res) => {
    const { id } = req.params
    console.log(req.params, "...", id)
    try {
        const docs = await pool.query('select * from documents where doc_id = $1', [id])
        res.json(docs.rows)
        console.log("res of doc by id: ", docs.rows)
    } catch (err) {
        console.log(err)
    }
})

// get document title from id 
app.get('/documents/TitleFromId/:id', async (req, res) => {
    const { id } = req.params
    console.log(req.params, "...", id)
    try {
        const docs = await pool.query('select doc_title from documents where doc_id = $1', [id])
        res.json(docs.rows)
        console.log("res of  title by id: ", docs.rows)
    } catch (err) {
        console.log(err)
    }
})

// POSTS
async function post_entry(body_entry, res, isArr) {
    console.log("in: ", body_entry)
    var { doc_title, user_email, school_name, gpa, major, minor, grad_date, previous_experiences, skills, clubs_activities, awards_honors, ethnicity, gender, doc_added_date } = body_entry
    console.log(doc_title, user_email, school_name, gpa, major, minor, grad_date, previous_experiences, skills, clubs_activities, awards_honors, ethnicity, gender, doc_added_date)
    const id = uuidv4()

    // format previous_experiences into a string
    var tmp = ""
    for (var item of previous_experiences) {
        if (tmp != "") tmp += "; "
        tmp += item.first + ": " + item.last
    }
    previous_experiences = tmp

    // format clubs_activities into a string
    tmp = ""
    for (var item of clubs_activities) {
        if (tmp != "") tmp += "; "
        tmp += item.first + ": " + item.last
    }
    clubs_activities = tmp
    
    // format skills into a string
    tmp = ""
    for (var item of skills) {
        if (tmp != "") tmp += ", "
        tmp += item.first
    }
    skills = tmp

    // format awards into a string
    tmp = ""
    for (var item of awards_honors) {
        if (tmp != "") tmp += ", "
        tmp += item.first
    }
    awards_honors = tmp

    // console.log("final:", previous_experiences, ",", clubs_activities, ",", skills, ",", awards_honors)
    try {
        const newDoc = await pool.query(`insert into documents (doc_id, doc_title, user_email, school_name, gpa, major, minor, grad_date, previous_experiences, skills, clubs_activities, awards_honors, ethnicity, gender, doc_added_date) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)`, 
        [id, doc_title, user_email, school_name, gpa, major, minor, grad_date, previous_experiences, skills, clubs_activities, awards_honors, ethnicity, gender, doc_added_date])
        if (isArr) {
            res.write(JSON.stringify(newDoc))
        } else {
            res.json(newDoc)
        }
    } catch(err) {
        if (isArr) {
            res.write(JSON.stringify(err))
        } else {
            res.send(err)
        }
        console.error(err)
    }
}

// upload a new document to the table
app.post('/documents', async (req, res) => {
    console.log("doc p: ", req.body)

    if (Array.isArray(req.body)) {
        res.writeHead(200, { 'Content-Type': 'application/json' })
        console.log("is arr")
        for (const body_entry of req.body) {
            post_entry(body_entry, res, true)
        }
        res.end()
    } else {
        console.log("is not arr")
        post_entry(req.body, res, false)
    }
    console.log("done")
})

// upload a new breach to the table
app.post('/breaches', async (req, res) => {
    console.log("in breaches endpt")
    const { company_name, user_email, position, year_applied, doc_id, job_added_date } = req.body 
    console.log(company_name, user_email, position, year_applied, doc_id, job_added_date)
    const id = uuidv4()
    try {
        const newBreach = await pool.query(`insert into breaches (breach_id, user_email, company_name, position, year_applied, doc_id, breach_added_date) VALUES($1, $2, $3, $4, $5, $6, $7)`, 
        [id, user_email, company_name, position, year_applied, doc_id, job_added_date])
        res.json(newBreach)
    } catch(err) {
        res.json(err)
        console.error(err)
    }
})


// delete a document by its id (primary key)
app.delete('/documents/:id', async (req, res) => {
    const { id } = req.params
    try {
        const deleteDoc = await pool.query('DELETE FROM documents where doc_id = $1;', [id])
        res.json(deleteDoc)
    } catch (err) {
        console.error(err)
    }
})

// delete all documents
app.delete('/documents', async (req, res) => {
    try {
        const deleteDoc = await pool.query('DELETE FROM documents;')
        res.json(deleteDoc)
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

