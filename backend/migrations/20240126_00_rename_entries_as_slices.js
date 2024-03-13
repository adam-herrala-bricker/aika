module.exports = {
  up: async ({context: queryInterface}) => {
    await queryInterface.renameTable('entries', 'slices');
  },

  down: async ({context: queryInterface}) => {
    await queryInterface.renameTable('slices', 'entries');
  }
};
