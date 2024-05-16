const express = require('express');
require('dotenv').config();
const cors=require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello World!');
    });
    
app.post('/api/payment/create-payment-intent', async (req, res) => {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'eur',
        });
    res.send({
        clientSecret: paymentIntent.client_secret,
        });
    }

    );

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    });