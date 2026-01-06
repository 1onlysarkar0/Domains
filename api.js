const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const customers = {
    "rahul": { owner: "Rahul Kumar", purchaseDate: "2026-01-05" },
    "priya": { owner: "Priya Sharma", purchaseDate: "2026-01-06" }
};

app.get('/api/check/:subdomain', (req, res) => {
    const subdomain = req.params.subdomain.toLowerCase();
    const customer = customers[subdomain];
    
    if (customer) {
        res.json({
            subdomain: subdomain,
            owner: customer.owner,
            purchaseDate: customer.purchaseDate,
            reserved: true
        });
    } else {
        res.json({
            subdomain: subdomain,
            owner: null,
            reserved: false
        });
    }
});

app.post('/api/add', (req, res) => {
    const { subdomain, owner, adminKey } = req.body;
    
    if (adminKey !== process.env.ADMIN_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    if (!subdomain || !owner) {
        return res.status(400).json({ error: 'Subdomain and owner required' });
    }
    
    if (customers[subdomain.toLowerCase()]) {
        return res.status(409).json({ error: 'Subdomain already reserved' });
    }
    
    customers[subdomain.toLowerCase()] = {
        owner: owner,
        purchaseDate: new Date().toISOString().split('T')[0]
    };
    
    res.json({
        success: true,
        message: `Subdomain ${subdomain} reserved for ${owner}`
    });
});

app.get('/api/customers', (req, res) => {
    const adminKey = req.headers['x-admin-key'];
    
    if (adminKey !== process.env.ADMIN_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    res.json(customers);
});

app.delete('/api/delete/:subdomain', (req, res) => {
    const adminKey = req.headers['x-admin-key'];
    
    if (adminKey !== process.env.ADMIN_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const subdomain = req.params.subdomain.toLowerCase();
    
    if (!customers[subdomain]) {
        return res.status(404).json({ error: 'Subdomain not found' });
    }
    
    delete customers[subdomain];
    
    res.json({
        success: true,
        message: `Subdomain ${subdomain} deleted`
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
});
