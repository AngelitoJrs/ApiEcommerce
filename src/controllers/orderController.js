const db = require('../config/db');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createCheckout = async (req, res) => {
    const { productId, userId } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
        const product = rows[0];
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: { 
                    currency: 'usd', 
                    product_data: { name: product.name }, 
                    unit_amount: Math.round(product.price * 100) 
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: 'http://localhost:3000/success',
            cancel_url: 'http://localhost:3000/cancel',
            metadata: { 
                product_id: productId.toString(),
                user_id: userId.toString(),
                price: product.price.toString()
            }
        });

        res.json({ url: session.url });
    } catch (err) {
        res.status(500).json({ message: "Error al crear sesión de pago" });
    }
};

exports.getMyOrders = async (req, res) => {
    const userIdFromToken = req.user.id;
    try {
        const query = `
            SELECT 
                ROW_NUMBER() OVER (ORDER BY o.created_at ASC) AS userOrderNumber,
                o.id AS dbOrderId, o.total_price, o.status, o.created_at, p.name AS productName
            FROM orders o
            JOIN products p ON o.product_id = p.id
            WHERE o.user_id = ?
            ORDER BY o.created_at DESC
        `;
        const [rows] = await db.query(query, [userIdFromToken]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener historial" });
    }
};