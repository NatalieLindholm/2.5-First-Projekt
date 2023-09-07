const express = require('express')
const path = require('path')
const fs = require('fs')
const server = express()

server.use(express.urlencoded({ extended: true })) //Dekrypterar url till text
server.use(express.static(path.resolve("../client")))
server.use(express.json())

const userPath = path.resolve("users.json")

function saveUser(user) {
    const users = getUsers()
    users.push(user)
    fs.writeFileSync(userPath, JSON.stringify(users, null, 2))
}

function getUsers() {
    const data = fs.readFileSync(userPath, "utf8")
    return JSON.parse(data)
}

server.get("/signup", (req, res) => {
    res.sendFile(path.resolve("../client/signup.html"))
})

server.post("/signup", (req, res) => {
    console.log(req.body)
    const newUser = {
        username: req.body.user,
        password: req.body.password
    }
    saveUser(newUser)

    res.redirect("/login")
})

server.get("/login", (req, res) => {
    res.sendFile(path.resolve("../client/login.html"))
})

server.post('/login', (req, res) => {
    const username = req.body.user
    const password = req.body.password

    const users = getUsers()

    const user = users.find(user => user.username === username)

    if (!user) {
        return res.send("User not existing :(")
    }

    if (user.password === password) {
        return res.redirect("/home")
    } else {
        return res.send("Incorrect password :P")
    }

})

server.get("/home", (req, res) => {
    res.sendFile(path.resolve("../client/home.html"))
})

server.listen(3000, () => {
    console.log("It do be running")
})