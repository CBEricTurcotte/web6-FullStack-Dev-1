describe('FullStack Dev-1 Automated Grading', () => {

  it('Log on Local', () => {
    cy.visit('/')
  })

  ////////////////////
  // Calc Endpoint //
  ///////////////////

  it('Calc Endpoint 1 - The /calc-residential route has been rename to /calc', () => {
    cy.request({
      method: 'OPTIONS',
      url: '/calc',
      failOnStatusCode: false,
      headers: {
        Authorization: 'password', // Use the expected authentication token
      },
    }).then((response) => {
      // Check if the status code indicates the endpoint exists (e.g., 200 or 204)
      expect([200, 204]).to.include(response.status);
    });
  })
  it('Calc Endpoint 1-2 - should return 404 for /calc-residential endpoint', () => {
    cy.request({
      method: 'GET',
      url: '/calc-residential',
      failOnStatusCode: false // Prevent Cypress from failing the test on non-2xx responses
    }).then(response => {
      expect(response.status).to.eq(404);
    });
  });
  it('Calc Endpoint 2 - residential - The /calc route validate type path parameter', () => {
    cy.request('/calc/residential').then(response => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('elevators_required');
      expect(response.body).to.have.property('cost');
    });
  });

  // Test for commercial building type
  it('Calc Endpoint 2 - commercial - The /calc route validate type path parameter', () => {
    cy.request('/calc/commercial').then(response => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('elevators_required');
      expect(response.body).to.have.property('cost');
    });
  });

  // Test for industrial building type
  it('Calc Endpoint 2 - industrial - The /calc route validate type path parameter', () => {
    cy.request('/calc/industrial').then(response => {
      expect(response.status).to.eq(200);
      expect(response.body).to.have.property('elevators_required');
      expect(response.body).to.have.property('cost');
    });
  });
  it('Calc Endpoint 3 - industrial - The /calc route validate the proper query parameter and returns valid results', () => {
    // Define valid query parameters for the industrial building type
    const queryParams = {
      elevators: 5,
      tier: 'standard'
      // Add more query parameters as needed
    };

    // Send a GET request to the /calc/industrial endpoint with valid query parameters
    cy.request({
      method: 'GET',
      url: '/calc/industrial',
      qs: queryParams // Attach query parameters to the request
    }).then(response => {
      // Assert that the response status is 200
      expect(response.status).to.equal(200);

      // Assert that the response body contains the expected properties
      expect(response.body).to.have.property('elevators_required');
      expect(response.body).to.have.property('cost');
    });
  });

  it('Calc Endpoint 4 - commercial - The /calc route validate the proper query parameter and returns valid results', () => {
    // Define valid query parameters for the commercial building type
    const queryParams = {
      floors: 10,
      maxOccupancy: 50,
      tier: 'premium'
      // Add more query parameters as needed
    };

    // Send a GET request to the /calc/commercial endpoint with valid query parameters
    cy.request({
      method: 'GET',
      url: '/calc/commercial',
      qs: queryParams // Attach query parameters to the request
    }).then(response => {
      // Assert that the response status is 200
      expect(response.status).to.equal(200);

      // Assert that the response body contains the expected properties
      expect(response.body).to.have.property('elevators_required');
      expect(response.body).to.have.property('cost');
    });
  });
  it('Calc Endpoint 5 - commercial - The /calc route validate the proper query parameter and returns valid results', () => {
    // Define valid query parameters for the residential building type
    const queryParams = {
      floors: 5,
      apts: 20,
      tier: 'standard'
      // Add more query parameters as needed
    };

    // Send a GET request to the /calc/residential endpoint with valid query parameters
    cy.request({
      method: 'GET',
      url: '/calc/residential',
      qs: queryParams // Attach query parameters to the request
    }).then(response => {
      // Assert that the response status is 200
      expect(response.status).to.equal(200);

      // Assert that the response body contains the expected properties
      expect(response.body).to.have.property('elevators_required');
      expect(response.body).to.have.property('cost');
    });
  });

  /////////////////////////
  // Contact Endpoint //
  ////////////////////////

  it('Contact Endpoint 1 - The endpoint has been updated to accept all fields from the form', () => {
    // Define form data
    const formData = {
      fullname: 'John Doe',
      email: 'johndoe@example.com',
      phone: '1234567890',
      company_name: 'Example Company',
      project_name: 'Example Project',
      project_desc: 'This is an example project description.',
      department: 'commercial',
      message: 'This is a test message.'
    };

    // Send a POST request to the /contact endpoint with form data
    cy.request({
      method: 'POST',
      url: '/contact',
      body: formData
    }).then(response => {
      // Assert that the response status is 200 (assuming success)
      expect(response.status).to.equal(200);

      // Delete the contact by fullname using the Cypress task
      cy.task('deleteContactByFullnameFromMongoDB', formData.fullname).then(taskResponse => {
        // Ensure that the task was successful
        expect(taskResponse.success).to.be.true;
      });
    });
  });

  it('Contact Endpoint 2 - All the fields from the form are persisting in MongoDB - except attachment', () => {
// Define form data
    const formData = {
      fullname: 'John Doe',
      email: 'johndoe@example.com',
      phone: '1234567890',
      company_name: 'Example Company',
      project_name: 'Example Project',
      project_desc: 'This is an example project description.',
      department: 'commercial',
      message: 'This is a test message.'
    };

    // Send a POST request to the /contact endpoint with form data
    cy.request({
      method: 'POST',
      url: '/contact',
      body: formData
    }).then(response => {
      // Assert that the response status is 200
      expect(response.status).to.equal(200);

      // Validate that all fields are persisted in MongoDB
      cy.task('verifyContactDataInMongoDB', formData).then(verificationResult => {
        expect(verificationResult.success).to.be.true;
      });

      // Delete the contact form data using the task
      cy.task('deleteContactByFullnameFromMongoDB', formData.fullname).then(taskResponse => {
        // Ensure that the task was successful
        expect(taskResponse.success).to.be.true;
      });
    });
  });


  /////////////////////////
  // Agent Table //
  ////////////////////////

  it('Agent Table 1 - Residential landing page a table displays agents data pulled from MongoDB', () => {
    // Send a request to the /agents endpoint
    cy.request('/agents').then((response) => {
      // Verify that the response status is 200
      expect(response.status).to.equal(200);

      // Verify that the response body is not empty and is an object
      expect(response.body).to.not.be.empty;
      expect(response.body).to.be.an('object');

      // Assuming the response body is an object with a 'data' property
      // Check if the 'data' property is an array
      expect(response.body.data).to.be.an('array').that.is.not.empty;

      // Check if each agent object in the array has a 'last_name' property
      response.body.data.forEach((agent) => {
        expect(agent).to.have.property('last_name');
      });

      // Optionally, you can add more assertions based on the structure of your response data
    });
  });

  it('Agent Table 2 - Information displayed are Full name-rating and fee', () => {
    cy.visit('http://localhost:3004/residential.html')
    cy.get('#agent_table_head').should('be.visible')
    cy.get('#agents_list').should('exist') // Check if the agents list section exists
    cy.get('#agents_list').should('exist') // Check if the agents list section exists
    cy.get('#full_name').should('exist') // Check if the full name button exists
    cy.get('#rating').should('exist') // Check if the rating button exists
    cy.get('#fee').should('exist') // Check if the fee button exists
  });
  it('Agent Table 3 - Fee is displayed in currency format', () => {
    cy.visit('http://localhost:3004/residential.html')
    cy.get('#agent_table_body > :nth-child(1) > :nth-child(3)').invoke('text').then(text => {
      // Remove any non-numeric characters (like commas or currency symbols)
      const numericValue = Number(text.replace(/[^0-9.-]+/g, ""))

      // Check if the numeric value is formatted as currency (assuming USD format)
      expect(numericValue).to.be.a('number').and.to.satisfy(value => value >= 0)
      expect(text).to.match(/^\$?(\d{1,3})(,\d{3})*(\.\d{2})?$/)
    });
  });
  it('Agent Table 4 - should have green color when rating is 100', () => {
    /// need a specific color to be required ////
    cy.visit('http://localhost:3004/residential.html')   // Get the table row with rating 100
    // Get the table row with rating 100
    cy.get('#agent_table_body')
      .contains('tr', '100')
      .should('have.class', 'rating-green');
  });

  it('Agent Table 4 - should have blue color when rating is >= 90 but not 100', () => {
    // Visit the page containing the agent table
    cy.visit('http://localhost:3004/residential.html');

    // Get the table rows with rating 90 or above but not equal to 100
    cy.get('#agent_table_body')
      .find('tr')
      .each(($row) => {
        const rating = parseInt($row.find('td').eq(3).text().trim());
        if (rating >= 90 && rating !== 100) {
          cy.wrap($row).should('have.class', 'rating-blue');
        }
      });
  });

  it('Agent Table 4 - should have purple color for the rest of ratings', () => {
    // Visit the page containing the agent table
    cy.visit('http://localhost:3004/residential.html');

    // Get the table rows with ratings other than 100 or >= 90
    cy.get('#agent_table_body')
      .find('tr')
      .each(($row) => {
        const rating = parseInt($row.find('td').eq(3).text().trim());
        if (rating !== 100 && rating < 90) {
          cy.wrap($row).should('have.class', 'rating-purple');
        }
      });
  });
  it('Agent Table 5 - Table is sortable by name', () => {
    // Visit the page containing the agent table
    cy.visit('http://localhost:3004/residential.html');

    // Click on the Full Name button once to sort in ascending order
    cy.get('#full_name').click();

    // Get the list of names from the table
    cy.get('#agent_table_body')
      .find('tr')
      .then(rows => {
        const names = [];
        rows.each((index, row) => {
          // Assuming the full name is contained within the second <td> of each row
          const fullName = Cypress.$(row).find('td').eq(1).text();
          names.push(fullName.trim()); // Trim to remove leading/trailing spaces
        });

        // Log out the actual and expected arrays for debugging
        cy.log('Actual names:', names);
        const sortedNames = [...names].sort();
        cy.log('Expected sorted names:', sortedNames);

        // Check if the names are sorted in ascending order
        expect(names).to.deep.equal(sortedNames);
      });
  });

  it('Agent Table 5 - Table is sortable by rating', () => {
    /// need a specific color to be required ////
    cy.visit('http://localhost:3004/residential.html')    // Click on the Rating button once to sort in ascending order
    cy.get('#rating').click();

    // Get the list of ratings from the table
    cy.get('#agent_table_body')
      .find('tr')
      .then(rows => {
        const ratings = [];
        rows.each((index, row) => {
          // Assuming the rating is contained within the fourth <td> of each row
          const rating = Cypress.$(row).find('td').eq(3).text();
          ratings.push(parseFloat(rating.trim())); // Parse rating and remove leading/trailing spaces
        });

        // Log out the actual and expected arrays for debugging
        cy.log('Actual ratings:', ratings);
        const sortedRatings = [...ratings].sort((a, b) => a - b);
        cy.log('Expected sorted ratings:', sortedRatings);

        // Check if the ratings are sorted in ascending order
        expect(ratings).to.deep.equal(sortedRatings);
      });
  });
  it('Agent Table 5 - Table is sortable by fee', () => {
    /// need a specific color to be required ////
    cy.visit('http://localhost:3004/residential.html')
    // Click on the Fee button once to sort in ascending order
    cy.get('#fee').click();

    // Get the list of fees from the table
    cy.get('#agent_table_body')
      .find('tr')
      .then(rows => {
        const fees = [];
        rows.each((index, row) => {
          // Assuming the fee is contained within the third <td> of each row
          const fee = Cypress.$(row).find('td').eq(2).text();
          fees.push(parseFloat(fee.trim().replace('$', ''))); // Parse fee and remove leading/trailing spaces and '$' sign
        });

        // Log out the actual and expected arrays for debugging
        cy.log('Actual fees:', fees);
        const sortedFees = [...fees].sort((a, b) => a - b);
        cy.log('Expected sorted fees:', sortedFees);

        // Check if the fees are sorted in ascending order
        expect(fees).to.deep.equal(sortedFees);
      });
  });

  it('Agent Table 6 - Table is sortable by region', () => {
    cy.visit('http://localhost:3004/residential.html')

    // Define an array of regions
    const regions = ['north', 'south', 'east', 'west', 'all']

    // Iterate through each region
    regions.forEach(region => {
      // Select the region from the dropdown menu
      cy.get('#regions').select(region)

      // Wait for the agents list to update (you may need to adjust the wait time)
      cy.wait(1000)

      // Assert that the agents list is filtered by the selected region
      cy.get('#agents_list').within(() => {
        cy.contains(region.charAt(0).toUpperCase() + region.slice(1)).should('exist')
      })
   });
  });
  it('Agent Table 7 - Validator middleware is used to validate passed region', () => {
    cy.request({
      method: 'GET',
      url: '/agents-by-region?region=north', // Adjust the query parameter as necessary
      failOnStatusCode: false, // To not fail the test on non-2xx responses
    }).then((response) => {
      // Check if the response status is 400 indicating validation failure
      if (response.status === 400) {
        // Assert that the response body contains the expected validation error message
        expect(response.body).to.contain('Invalid region');
      } else {
        // If validation succeeds, assert that the status is 200
        expect(response.status).to.equal(200);
      }
    });
  });
});