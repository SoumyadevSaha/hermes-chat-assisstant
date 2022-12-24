import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();
console.log(process.env.OPENAI_API_KEY)
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

// create an instance of the OpenAI API
const openai = new OpenAIApi(configuration);

// initialize the express app
const app = express();
app.use(cors()); // for using the cross-origin requests (CORS)
app.use(express.json()) // allows json to be sent by the client

// dummy app rote ->
app.get('/', async(req, res) => {
    res.status(200).send({
        message: 'Hello from Hermes !'
    })
})

// the get allows us to receive from the front-end, but the post allows us to have a body or payload
app.post('/', async(req, res) => {
    try {
        const prompt = req.body.prompt;
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            temperature: 0.1,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });

        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({error: error.message})
    }
})

// listen to the port
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port http://localhost:${process.env.PORT}`)
})