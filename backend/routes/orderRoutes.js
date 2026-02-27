const express = require('express');
const router = express.Router();
// Import the perfectly working functions from your controller
const { 
    addOrderItems, 
    getOrderById, 
    updateOrderStatus, 
    getMyOrders, 
    getOrders 
} = require('../controllers/orderController');

// Import your custom security middlewares
const { protect, admin } = require('../middlewares/auth');

// -----------------------------------------
// STUDENT ROUTES (Requires 'protect')
// -----------------------------------------

// Create a new order (Only logged in students)
router.post('/', protect, addOrderItems); 

// Get their own order history
router.get('/myorders', protect, getMyOrders);

// Get a specific order by ID
router.get('/:id', protect, getOrderById);


// -----------------------------------------
// ADMIN ROUTES (Requires 'protect' AND 'admin')
// -----------------------------------------

// Get ALL orders for the dashboard
router.get('/', protect, admin, getOrders); 

// Update order status (Pending -> Preparing -> Ready)
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;