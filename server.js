require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors()); 

const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY;

app.post('/api/initialize-payment', async (req, res) => {
    const { amount, email, first_name, last_name } = req.body;
    const tx_ref = `LIDIYA-TX-${Date.now()}`; 

    try {
        const chapaResponse = await axios.post('https://api.chapa.co/v1/transaction/initialize', {
            amount: amount,
            currency: 'ETB',
            email: email,
            first_name: first_name,
            last_name: last_name,
            tx_ref: tx_ref,
            // Directs the user back to the order page with a "success" tag to trigger the SMS
            return_url: 'https://spiderweb-dev26.github.io/Lidiya-cafe/index.html?status=success' 
        }, {
            headers: {
                'Authorization': `Bearer ${CHAPA_SECRET_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (chapaResponse.data.status === 'success') {
            res.json({ checkout_url: chapaResponse.data.data.checkout_url });
        } else {
            res.status(400).json({ error: 'Failed to initialize payment' });
        }
        
    } catch (error) {
        console.error('Chapa API Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Server error while contacting Chapa' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Payment server running on port ${PORT}`));