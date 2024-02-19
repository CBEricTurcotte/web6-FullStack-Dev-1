describe('FullStack Dev-1 Automated Grading', () => {
  // beforeEach(() => {
  //   // Before each test, delete contact data from MongoDB using the custom Cypress task
  //   cy.task('deleteContactData');
  // });
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
      tier: 'basic'
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
  it('Calc Endpoint 4 - commercial - The /calc route validate the proper query parameter and returns valid results', () => {
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

  it.skip('Contact Endpoint 1 - The endpoint has been update to accept all fields from the form', () => {
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
    });
    // Delete the contact form data using the task
    cy.task('deleteContactDataFromMongoDB');
  });
  // it.skip('Contact Endpoint 2 - All the fields from the form are persisting in MongoDB - except attachment', () => {
  //   // Define form data
  // });
  // it.skip('Agent Table 1 - Residential landing page a table displays agents data pulled from MongoDB', () => {
  //   // Define form data
  // });
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
  it.skip('Agent Table 4 - Color rating green/100 blue/90+ purple for the rest', () => {
    /// need a specific color to be required ////
    cy.visit('http://localhost:3004/residential.html')
  });
  it.only('Agent Table 5 - Table is sortable by name/rating and fee', () => {
    cy.visit('http://localhost:3004/residential.html')
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