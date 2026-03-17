const express = require('express');
const router = express.Router();

// Import the correct function names from menuController
const { 
    getMenuItems,       // FIXED: Was 'getMenu'
    getMenuItemById, 
    createMenuItem, 
    updateMenuItem, 
    deleteMenuItem 
} = require('../controllers/menuController'); 

// Import your custom security middlewares
const { protect, admin } = require('../middlewares/auth');

// -----------------------------------------
// PUBLIC ROUTES (No login required)
// -----------------------------------------

// Anyone can view the menu
router.get('/', getMenuItems); // FIXED: Was 'getMenu'

// Anyone can view a specific menu item's details
router.get('/:id', getMenuItemById);

// -----------------------------------------
// ADMIN ROUTES (Requires 'protect' AND 'admin')
// -----------------------------------------

// Only Admin can add a new food item
router.post('/', protect, admin, createMenuItem);

// Only Admin can update a food item (e.g., change price, mark 'isOutofStock')
router.put('/:id', protect, admin, updateMenuItem);

// Only Admin can delete a food item
router.delete('/:id', protect, admin, deleteMenuItem);

module.exports = router;