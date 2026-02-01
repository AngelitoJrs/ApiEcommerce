const express = require('express');
const router = express.Router();
const path = require('path');

const publicPath = path.join(__dirname, '../public');

router.get('/', (req, res) => res.sendFile(path.join(publicPath, 'index.html')));
router.get('/orders', (req, res) => res.sendFile(path.join(publicPath, 'orders.html')));
router.get('/success', (req, res) => res.sendFile(path.join(publicPath, 'success.html')));
router.get('/cancel', (req, res) => res.sendFile(path.join(publicPath, 'cancel.html')));

module.exports = router;