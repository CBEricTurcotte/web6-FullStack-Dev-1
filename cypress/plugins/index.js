// cypress/plugins/index.js

const { openMongoConnection, Contact } = require('../../src/shared/db/mongodb/mongo-manager'); // Adjust the path accordingly

module.exports = (on, config) => {
  on('task', {
    deleteContactDataFromMongoDB: async () => {
      // Ensure MongoDB connection is open
      await openMongoConnection();

      try {
        // Use Mongoose to delete all contact data
        const result = await Contact.deleteMany({});

        console.log('Successfully deleted all contact data');
        return { success: true };
      } catch (error) {
        console.error('Error deleting contact data:', error.message);
        return { success: false, error: 'Internal Server Error' };
      }
    },
  });
};