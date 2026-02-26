const MenuItem = require('../models/MenuItem');

// Get all menu items
const getMenuItems = async (req, res) => {
    try {
        const items = await MenuItem.find({});
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Create Menu Item
const createMenuItem = async (req, res) => {
    const { name, description, price, category, imageUrl, isOutofStock, isSpicy } = req.body;
    try {
        const item = await MenuItem.create({
            name, description, price, category, imageUrl, isOutofStock, isSpicy
        });
        res.status(201).json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Update Menu Item
const updateMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.findById(req.params.id);
        if (item) {
            item.name = req.body.name || item.name;
            item.description = req.body.description || item.description;
            item.price = req.body.price || item.price;
            item.category = req.body.category || item.category;
            item.imageUrl = req.body.imageUrl || item.imageUrl;
            item.isOutofStock = req.body.isOutofStock !== undefined ? req.body.isOutofStock : item.isOutofStock;
            item.isSpicy = req.body.isSpicy !== undefined ? req.body.isSpicy : item.isSpicy;

            const updatedItem = await item.save();
            res.json(updatedItem);
        } else {
            res.status(404).json({ message: 'Menu item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Delete Menu Item
const deleteMenuItem = async (req, res) => {
    try {
        const item = await MenuItem.findById(req.params.id);
        if (item) {
            await MenuItem.deleteOne({ _id: item._id });
            res.json({ message: 'Menu item removed' });
        } else {
            res.status(404).json({ message: 'Menu item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem };
