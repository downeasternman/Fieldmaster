const express = require('express');
const router = express.Router({ mergeParams: true });
const billLineItemController = require('../controllers/billLineItemController');

// Get all line items for a bill
router.get('/', billLineItemController.getBillLineItems);

// Create a new line item
router.post('/', billLineItemController.createBillLineItem);

// Update a line item
router.put('/:id', billLineItemController.updateBillLineItem);

// Delete a line item
router.delete('/:id', billLineItemController.deleteBillLineItem);

module.exports = router; 