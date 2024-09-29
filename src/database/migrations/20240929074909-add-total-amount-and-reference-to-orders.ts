'use strict';

/** @type {import('sequelize-cli').Migration} */


import { QueryInterface, DataTypes } from 'sequelize';

export default {
  up: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.addColumn('orders', 'total_amount', {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    });

    await queryInterface.addColumn('orders', 'reference', {
      type: DataTypes.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface: QueryInterface): Promise<void> => {
    await queryInterface.removeColumn('orders', 'total_amount');
    await queryInterface.removeColumn('orders', 'reference');
  },
};
