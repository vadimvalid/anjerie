describe('Example screenshots comparison', () => {

  let sites = Cypress.env('sites') || [];
  let resolutions = Cypress.env('resolutions') || [];
  let environment = Cypress.env('environment') || '';

  if (sites && sites.length) {
    sites.forEach((site) => {
      const testName = `Example for ${site.name}`;
      it(testName, () => {
        cy.visit(site.url);
        cy.get('body').then((body) => {
          if (body.find('.nav.pages').length) {
            cy.get('.nav.pages a').each(($el) => {
              if ($el.attr('href').startsWith('/') !== false) {

                const href = site.url + $el.attr('href');
                cy.visit(href);

                resolutions.forEach((resolution) => {
                  cy.viewport(resolution.viewportWidth, resolution.viewportHeight);
                  cy.wait(1000);
                  cy.matchImageSnapshot(environment + '/' + site.name + '/' + $el.text().trim() + '_' + resolution.name);
                })
              }
            });
          }
        });
      });
    });
  }
});
