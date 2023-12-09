import { addMatchImageSnapshotCommand } from '@simonsmith/cypress-image-snapshot/command';

/**
 * Drupal login.
 */
Cypress.Commands.add('drupalLogin', (user, password, url) => {

  url = (typeof url != "undefined") ? url : '';
  let options = {
    method: 'POST',
    url: url + '/user/login',
    form: true,
    body: {
      name: user,
      pass: password,
      form_id: 'user_login_form',
    },
  };

  // Add basic auth headers to request.
  const basic_auth_login = Cypress.env('basic_auth_login') || null;
  const basic_auth_password = Cypress.env('basic_auth_password') || null;
  if (basic_auth_login && basic_auth_password) {
    options.auth = {
      'username': basic_auth_login,
      'password': basic_auth_password
    };
  }

  return cy.request(options);
});

/**
 * Drupal logout.
 */
Cypress.Commands.add('drupalLogout', (url) => {
  url = (typeof url != "undefined") ? url : '';
  let options = {
    method: 'GET',
    url: url + '/user/logout',
  };

  // Add basic auth headers to request.
  const basic_auth_login = Cypress.env('basic_auth_login') || null;
  const basic_auth_password = Cypress.env('basic_auth_password') || null;
  if (basic_auth_login && basic_auth_password) {
    options.auth = {
      'username': basic_auth_login,
      'password': basic_auth_password
    };
  }

  return cy.request(options);
});

/**
 * Click on checkbox in Google reCAPTCHA v2.
 */
Cypress.Commands.add('solveGoogleReCAPTCHAv2', () => {
  // Wait until the iframe (Google reCAPTCHA) is totally loaded
  cy.wait(500);
  cy.get('.g-recaptcha *> iframe')
    .then($iframe => {
      const $body = $iframe.contents().find('body');
      cy.wrap($body)
        .find('.recaptcha-checkbox-border')
        .should('be.visible')
        .click();
    });
});

/**
 * Get e-mail confirmation url.
 *
 * @param type
 *   Type of e-mail confirmation. Possible values:
 *     - yopmail
 *     - reroute_email
 */
Cypress.Commands.add('getConfirmUrl', (type, url) => {
  cy.task('loadData').then((userData) => {
    let confirm_url = '';
    let regexp = RegExp(/\/user\/registrationpassword\/[0-9]*\/[0-9]*\/[0-9a-zA-Z_-]*/);
    url = (typeof url != "undefined") ? url : '';

    if (type === 'reroute_email') {
      // Login as admin.
      cy.drupalLogin(Cypress.env('admin_user'), Cypress.env('admin_password'), url);

      // Go to DBlog and click on last reroute_email message.
      cy.visit(url + '/admin/reports/dblog?type[]=reroute_email');
      cy.get('tr.reroute-email a').first().click();

      // Parse confirmation url.
      cy.get('td').contains(regexp).then((theElement) => {
        let message = theElement.text();
        confirm_url = regexp.exec(message)[0];
        // Logout from admin.
        cy.drupalLogout(url);

        // Store confirmation url in temp data.
        userData.confirmUrl = confirm_url;
        cy.task('saveData', userData);
      });
    }
    else if(type === 'yopmail') {
      cy.visit('https://yopmail.com/en/');
      cy.get('#accept').click();

      // Fill the username
      cy.get('input[name="login"]')
        .type(userData.randomEmail)
        .should('have.value', userData.randomEmail);

      cy.wait(5000);
      // Go to mail box.
      cy.get('#refreshbut').click();

      // Inside iframe found last e-mail container and parse confirmation url.
      cy.get('iframe#ifmail')
        .then($iframe => {
          const $body = $iframe.contents().find('body');
          cy.wrap($body)
            .find('#mail')
            .contains(regexp).then((theElement) => {
            let message = theElement.text();
            confirm_url = regexp.exec(message)[0];

            // Store confirmation url in temp data.
            userData.confirmUrl = confirm_url;
            cy.task('saveData', userData);
          });
        });
    }
  })
});

/**
 * Drupal logout.
 *
 * @param textareaId
 *   ID of textarea where attached CKEditor.
 *
 * @param text
 *   Text which should be added inside CKEditor.
 */
Cypress.Commands.add('ckeditorAddText', (textareaId, text) => {
  cy.window().then(win => {
    win.CKEDITOR.instances[textareaId].setData(text);
  });
});

/**
 * Pause flexsliders and switch on the first slide.
 */
Cypress.Commands.add('pauseFlexslider', () => {
  cy.window().then(win => {
    if (win.jQuery('.flexslider').length) {
      win.jQuery('.flexslider').flexslider('pause');
      win.jQuery('.flexslider').flexslider(0);
    }
  });
});

/**
 * Overwrite "visit" command.
 *
 * Add basic auth credentials from env variables.
 */
Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
  const basic_auth_login = Cypress.env('basic_auth_login') || null;
  const basic_auth_password = Cypress.env('basic_auth_password') || null;

  if (basic_auth_login && basic_auth_password) {
    if (!options) {
      options = {};
    }
    options.auth = {
      'username': basic_auth_login,
      'password': basic_auth_password
    };
  }

  return originalFn(url, options);
});

addMatchImageSnapshotCommand({
  failureThreshold: 0.0005,
  failureThresholdType: 'percent',
  customDiffConfig: { threshold: 0.1 },
  customDiffDir: 'cypress/snapshots_diff',
  onBeforeScreenshot($el) {
    $el.css('overflow', 'hidden');
  },
  onAfterScreenshot($el, props) {
    $el.css('overflow', 'auto');
  },
});

Cypress.Cookies.defaults({
  preserve: /SESS/,
});
