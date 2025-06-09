import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import session from 'express-session'
import { imoveis } from './imoveis.js'
import  env from 'dotenv'
env.config()

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
    res.sendFile(path.join(publicDirectoryPath, 'html', 'chat.html'))  
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

app.post("/pergunta", async (req, res) => {
    const text = req.body.text

    const apiKey = process.env.API_KEY;
    const apiUrl = process.env.API_URL;
    const instru = `Responda com base nesses imóveis: ${JSON.stringify(imoveis)}, caso a pergunta não seja relacionada ao objeto rotorne 'Imovel não encontrado ou indisponível'`;
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: instru }] },
            { role: 'user', parts: [{ text: text }] }
          ],
        }),
      });

        if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro na resposta da API:", errorData);
        throw new Error(`Erro na requisição: ${response.status}`);
      }
  
      const data = await response.json();
      const msg = data.candidates?.[0]?.content?.parts?.[0]?.text;
      const msgRobo = msg?.replace(/\*/g, '') || '';
      res.status(220).json(msgRobo);
  
    } catch (error) {
      console.error(`Erro ao enviar prompt para o Gemini: ${error}`);
      return;
    }

})


app.listen(port, () => console.log(`http://localhost:${port}`))

