// cypress.config.js

const { defineConfig } = require('cypress');
const { openMongoConnection, Contact } = require('./src/shared/db/mongodb/mongo-manager');

module.exports = defineConfig({
  watchForFileChanges: false,

  e2e: {
    baseUrl: 'http://localhost:3004',
    setupNodeEvents(on, config) {
      on('task', {
        deleteContactByFullnameFromMongoDB: async (fullname) => {
          try {
            await openMongoConnection(); // Ensure MongoDB connection is open
            const result = await Contact.deleteMany({ fullname: fullname });
            if (result.deletedCount > 0) {
              console.log(`Successfully deleted contact with fullname "${fullname}"`);
              return { success: true };
            } else {
              console.log(`No contact with fullname "${fullname}" found`);
              return { success: false, error: 'Contact not found' };
            }
          } catch (error) {
            console.error('Error deleting contact:', error.message);
            return { success: false, error: 'Internal Server Error' };
          }
        },
        verifyContactDataInMongoDB: async (formData) => {
          try {
            await openMongoConnection(); // Ensure MongoDB connection is open
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
    },
    supportFile: 'cypress/support/index.js',
  },

  component: {
    devServer: {
      framework: 'vue',
      bundler: 'webpack',
    },
    supportFile: 'cypress/support/index.js',
  },
});