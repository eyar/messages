import express, { Application, Request, Response, NextFunction } from 'express'
import morgan from 'morgan'
import { config } from 'dotenv'
import cors from 'cors'
import { getMessages, insertMessage } from './mongoClient'
import { sendMessage } from './twilioClient'

config()
const app = express();
app.use(morgan('tiny'))
app.use(cors())
app.use(express.json())

app.post('/send-message', async (req: Request, res: Response) => {
    try {
        const { To, Body } = req.body
        const { dateCreated } = await sendMessage(To, Body)
        await insertMessage(To, Body, dateCreated.getTime())
        res.status(201).json({ timestamp: dateCreated })
    } catch(e: any) {
        res.status(500).json({ error: e.message })
    }
})

app.get('/messages', async (req: Request, res: Response) => {
    try {
        res.json(await getMessages())
    } catch(e: any) {
        res.status(500).json({ error: e.message })
    }
})

app.listen(5001, () => {
    console.log('Server running on port 5001');
});