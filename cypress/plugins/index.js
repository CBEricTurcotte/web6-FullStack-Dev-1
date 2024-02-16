// cypress/plugins/index.js

const { openMongoConnection, Agent, Contact } = require('../../src/shared/db/mongodb/mongo-manager'); // Adjust the path accordingly

module.exports = (on, config) => {
  on('task', {
    deleteAgentByLastNameFromMongoDB: async ({ agentLastName }) => {
      // Ensure MongoDB connection is open
      await openMongoConnection();

      try {
        // Use Mongoose to delete the agent by last name
        const result = await Agent.deleteOne({ last_name: agentLastName });

        if (result.deletedCount > 0) {
          console.log('Successfully deleted agent with last name:', agentLastName);
          return { success: true };
        } else {
          console.log('Agent with last name not found:', agentLastName);
          return { success: false, error: 'Agent not found' };
        }
      } catch (error) {
        console.error('Error deleting agent:', error.message);
        return { success: false, error: 'Internal Server Error' };
      }
    },

    deleteContactDataFromMongoDB: async () => {
      try {
        console.log('Opening MongoDB connection...');
        await openMongoConnection();
        console.log('MongoDB connection opened successfully.');

        console.log('Deleting contact data...');
        await Contact.deleteMany({});
        console.log('Successfully deleted all contact data.');

        return { success: true };
      } catch (error) {
        console.error('Error deleting contact data:', error.message);
        return { success: false, error: 'Internal Server Error' };
      }
    },

    verifyContactDataInMongoDB: async ({ formData }) => {
      // Ensure MongoDB connection is open
      await openMongoConnection();

      try {
        // Use Mongoose to find contact data that matches the form data
        const contact = await Contact.findOne(formData);

        if (contact) {
          console.log('Contact data found in MongoDB:', contact);
          return { success: true };
        } else {
          console.log('Contact data not found in MongoDB');
          return { success: false, error: 'Contact data not found' };
        }
      } catch (error) {
        console.error('Error verifying contact data:', error.message);
        return { success: false, error: 'Internal Server Error' };
      }
    },
  });
};