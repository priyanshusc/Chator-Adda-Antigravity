const Order = require('../models/Order');

// Create new order
const addOrderItems = async (req, res) => {
    const { items, totalAmount, paymentMethod, transactionId } = req.body;

    if (items && items.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    }

    try {
        const order = new Order({
            user: req.user._id,
            items,
            totalAmount,
            paymentMethod,
            transactionId,
            paymentStatus: paymentMethod === 'UPI' && transactionId ? 'Completed' : 'Pending',
        });

        const createdOrder = await order.save();

        // Broadcast new order to admins
        const io = req.app.get('socketio');
        if (io) {
            io.emit('new_order', createdOrder);
        }

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get order by ID
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email').populate('items.menuItem');
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update order status (Admin)
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.status = req.body.status || order.status;
            const updatedOrder = await order.save();

            // Emit real-time status update to the specific user's room
            const io = req.app.get('socketio');
            if (io) {
                io.to(`order_${order._id}`).emit('order_status_update', updatedOrder);
                // Also let admins know the status changed
                io.emit('admin_order_update', updatedOrder);
            }

            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get logged in user orders
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).populate('items.menuItem');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all orders (Admin)
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('user', 'id name').populate('items.menuItem');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addOrderItems, getOrderById, updateOrderStatus, getMyOrders, getOrders };
