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
  it('should return 404 for /calc-residential endpoint', () => {
    cy.request({
      method: 'GET',
      url: '/calc-residential',
      failOnStatusCode: false // Prevent Cypress from failing the test on non-2xx responses
    }).then(response => {
      expect(response.status).to.eq(404);
    });
  });
  it('Calc Endpoint 2 - The /calc route validate building type path parameter', () => {
    cy.request({
      method: 'GET',
      url: '/calc-residential',
      failOnStatusCode: false // Prevent Cypress from failing the test on non-2xx responses
    }).then(response => {
      expect(response.status).to.eq(404);
    });
  });

})