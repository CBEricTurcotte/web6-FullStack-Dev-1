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

  it('Contact Endpoint 1 - The endpoint has been update to accept all fields from the form', () => {
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
});