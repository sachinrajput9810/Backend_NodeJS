const express = require('express')
const users = require('./MOCK_DATA.json')
const fs = require('fs')
const PORT = 3000
const app = express()

app.get('/' , (req , res) => {
    res.send('Home Page')
})

// Using Middleware
app.use(express.urlencoded({extended : false}))

app.get('/users' , (req , res) => {
    const html = `

    <ul>
        ${users.map(user  => ` <li> ${user.first_name}  </li> ` ).join("")}
    </ul>

    `
    res.send(html)
})

// Rest 
app.get('/api/users' , (req , res) => {
    res.json(users)
})

app.route('/api/users/:id')
.get( (req , res) => {
    const ID = Number(req.params.id)
    const user = users.find(user => user.id === ID)
    res.json(user)
})
.post( (req , res) => {
    const ID = Number(req.params.id)
    res.json({status : "pending"})
})
.delete( (req , res) => {
    const ID = Number(req.params.id) 
    const data = users.filter(user => user.id !== ID)
    fs.writeFile('./MOCK_DATA.json' , JSON.stringify(data) , (err) => {
        res.json({status : `User with id ${ID} is deleted`})
    })
} )




app.post('/api/users' , (req , res) => {
    const body = req.body 
    users.push({...body , id : users.length+1 })
    fs.writeFile('./MOCK_DATA.json' , JSON.stringify(users) , (err ) => {
        res.json( {status : `User is created` ,  id : users.length})
    })
})


app.listen(PORT , () => {
    console.log(`Port running at ${PORT}`)
})