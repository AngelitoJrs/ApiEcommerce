require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./src/config/db');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();

// 1. WEBHOOK (Siempre antes de los middlewares de JSON)
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const { product_id, user_id, price } = session.metadata;
        try {
            await db.query(
                'INSERT INTO orders (user_id, product_id, total_price, status, stripe_session_id) VALUES (?, ?, ?, ?, ?)',
                [user_id, product_id, price, 'completed', session.id]
            );
            await db.query('UPDATE products SET stock = stock - 1 WHERE id = ? AND stock > 0', [product_id]);
        } catch (dbErr) { console.error('Error en DB:', dbErr); }
    }
    res.json({ received: true });
});

// 2. MIDDLEWARES GENERALES
app.use(cors());
app.use(express.json());

// 3. ARCHIVOS ESTÁTICOS (Apunta a la carpeta correcta que creaste)
app.use(express.static(path.join(__dirname, 'src', 'public')));

// 4. IMPORTACIONES
const authRoutes = require('./src/routes/authRoutes');
const viewRoutes = require('./src/routes/viewRoutes');
const orderController = require('./src/controllers/orderController');
const { verifyToken } = require('./src/middlewares/authMiddleware');

// 5. RUTAS DE VISTA (HTML)
app.use('/', viewRoutes);

// 6. RUTAS DE API (JSON)
app.use('/api/auth', authRoutes);
app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM products');
        res.json(rows);
    } catch (err) { res.status(500).send(err); }
});
app.post('/api/checkout', orderController.createCheckout);
app.get('/api/my-orders', verifyToken, orderController.getMyOrders);

app.listen(3000, () => console.log('🚀 Servidor listo en http://localhost:3000'));