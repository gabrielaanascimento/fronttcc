import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import session from 'express-session'

const app = express()
const port = process.env.PORT || 4000

app.use(express.json())

app.use(session({
    secret: process.env.SESSION_SECRET || "dhcsinfhiasbvvsbfvsfvbissf",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
    },
}))

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const publicDirectoryPath = path.join(__dirname, 'public')

app.use(express.static(publicDirectoryPath))

app.get('/', (req, res) => {
    res.sendFile(path.join(publicDirectoryPath, 'html', 'index.html'))
})

app.get('/login', (req, res) => {
    res.sendFile(path.join(publicDirectoryPath, 'html', 'login.html'))
})

app.post('/verificar', (req, res) => {
    const {status, id, nome} = req.body 
    console.log(status);
    console.log(id);
    console.log(nome);
    
    if(id && nome) {

        if(status) {
        req.session.loggedIn = true
        req.session.username = nome
        req.session.userId = id
        
        res.json({ session: true })
        }
    }

})

app.get('/home', (req, res) => {
    if (req.session.loggedIn) {
    res.sendFile(path.join(publicDirectoryPath, 'html', 'logado.html'))  
    } else {
        res.redirect('/')
    }     
})

app.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Erro ao fazer logout:', err);
            return res.status(500).json({ message: 'Erro ao fazer logout.' });
        }
        res.redirect('/')

    });
})

app.listen(port, () => console.log(`http://localhost:${port}`))

