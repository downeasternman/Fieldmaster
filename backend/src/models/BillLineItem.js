const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class BillLineItem extends Model {
    static associate(models) {
      BillLineItem.belongsTo(models.Bill, {
        foreignKey: 'bill_id',
        as: 'bill'
      });
    }
  }

  BillLineItem.init({
    description: {
      type: DataTypes.STRING,
      allowNull: false
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 1
    },
    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_labor: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    is_taxable: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    employee_number: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    bill_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'bills',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'BillLineItem',
    tableName: 'bill_line_items',
    timestamps: true
  });

  return BillLineItem;
}; 