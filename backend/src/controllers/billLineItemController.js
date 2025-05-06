const { BillLineItem, Bill } = require('../models');

// Get all line items for a bill
exports.getBillLineItems = async (req, res) => {
  try {
    const { billId } = req.params;
    const lineItems = await BillLineItem.findAll({
      where: { bill_id: billId },
      include: [{
        model: Bill,
        as: 'bill'
      }]
    });
    res.json(lineItems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new line item
exports.createBillLineItem = async (req, res) => {
  try {
    const { billId } = req.params;
    const lineItemData = {
      ...req.body,
      bill_id: billId
    };
    const lineItem = await BillLineItem.create(lineItemData);
    res.status(201).json(lineItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a line item
exports.updateBillLineItem = async (req, res) => {
  try {
    const { id } = req.params;
    const lineItem = await BillLineItem.findByPk(id);
    if (!lineItem) {
      return res.status(404).json({ error: 'Line item not found' });
    }
    await lineItem.update(req.body);
    res.json(lineItem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a line item
exports.deleteBillLineItem = async (req, res) => {
  try {
    const { id } = req.params;
    const lineItem = await BillLineItem.findByPk(id);
    if (!lineItem) {
      return res.status(404).json({ error: 'Line item not found' });
    }
    await lineItem.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 