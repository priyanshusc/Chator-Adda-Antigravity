const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    menuItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    price: {
        type: Number,
        required: true,
    }
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        // NEW: Added 'Picked Up' to the allowed list of statuses
        enum: ['Pending', 'Preparing', 'Ready', 'Picked Up', 'Completed', 'Cancelled'],
        default: 'Pending',
    },
    paymentMethod: {
        type: String,
        enum: ['UPI', 'Cash'],
        default: 'UPI',
    },
    transactionId: {
        type: String,
        trim: true,
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Completed', 'Failed'],
        default: 'Pending',
    },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);