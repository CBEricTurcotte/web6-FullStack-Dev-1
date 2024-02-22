// cypress/support/index.js

const { openMongoConnection, Contact } = require('/src/shared/db/mongodb/mongo-manager'); // Adjust the path accordingly

module.exports = (on, config) => {
  on('task', {
    deleteContactByFullnameFromMongoDB: (fullname) => {
      return openMongoConnection() // Ensure MongoDB connection is open
        .then(() => Contact.deleteMany({ fullname: fullname }))
        .then(result => {
          if (result.deletedCount > 0) {
            console.log(`Successfully deleted contact with fullname "${fullname}"`);
            return { success: true };
          } else {
            console.log(`No contact with fullname "${fullname}" found`);
            return { success: false, error: 'Contact not found' };
          }
        })
        .catch(error => {
          console.error('Error deleting contact:', error.message);
          return { success: false, error: 'Internal Server Error' };
        });
    },
  });
};