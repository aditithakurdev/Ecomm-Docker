'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // ✅ Add 'otp' column to 'Users' table
    await queryInterface.addColumn('Users', 'otp', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    // 🔁 Remove 'otp' column from 'Users' table
    await queryInterface.removeColumn('Users', 'otp');
  }
};
