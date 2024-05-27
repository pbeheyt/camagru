'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'confirmationToken', {
      type: Sequelize.UUID,
      allowNull: true
    });

    await queryInterface.addColumn('users', 'isConfirmed', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'confirmationToken');
    await queryInterface.removeColumn('users', 'isConfirmed');
  }
};
