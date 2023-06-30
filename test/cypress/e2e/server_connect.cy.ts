describe('template spec', () => {
  const host = `ws://${Cypress.env('DOCKER_SERVER_HOSTNAME') || 'localhost'}`;
  const port = Cypress.env('DOCKER_SERVER_PORT') || '4000';
  const key =
    Cypress.env('DOCKER_SERVER_KEY') || '355b5636-3c3e-4e57-97ad-5e1dd40283a2';

  it('test change language to en-us', () => {
    cy.visit('/');
    cy.get('.server-configure .text-h6')
      .invoke('text')
      .should('eq', 'Server to connect');
    cy.get('.server-configure .text-subtitle2')
      .invoke('text')
      .should('eq', 'Configure server to run ZCode IDE');
    cy.get('.language')
      .invoke('attr', 'for')
      .then((forValue) => {
        cy.get('.language').click();
        cy.get(`#${forValue}_lb .q-item:first`).click();
        cy.get('.server-configure .text-h6')
          .invoke('text')
          .should('eq', 'Server to connect');
        cy.get('.server-configure .text-subtitle2')
          .invoke('text')
          .should('eq', 'Configure server to run ZCode IDE');
      });
  });

  it('test change language to pt-br', () => {
    cy.visit('/');
    cy.get('.server-configure .text-h6')
      .invoke('text')
      .should('eq', 'Server to connect');
    cy.get('.server-configure .text-subtitle2')
      .invoke('text')
      .should('eq', 'Configure server to run ZCode IDE');
    cy.get('.language')
      .invoke('attr', 'for')
      .then((forValue) => {
        cy.get('.language').click();
        cy.get(`#${forValue}_lb .q-item:last`).click();
        cy.get('.server-configure .text-h6')
          .invoke('text')
          .should('eq', 'Servidor para conectar');
        cy.get('.server-configure .text-subtitle2')
          .invoke('text')
          .should('eq', 'Configure um servidor para executar ZCode IDE');
      });
  });

  it('try connect with valid websocket host, port and key', () => {
    cy.visit('/');
    cy.url().should(
      'be.equals',
      `${Cypress.config().baseUrl}#/server/configure`
    );
    cy.get('[name="address"]').clear().type(host);
    cy.get('[name="port"]').clear().type(port);
    cy.get('[name="key"]').clear().type(key);
    cy.get('.btn_next').click();
    cy.get('.q-footer .q-toolbar div:first').then(($div) => {
      const texto = $div.clone().children().remove().end().text().trim();
      expect(texto).to.equal(`Connecting on ${host}:${port}`);
    });
    cy.wait(500);
    cy.get('.q-footer .q-toolbar div:first').then(($div) => {
      const text = $div.clone().children().remove().end().text().trim();
      const words = text.split(' ');
      words.pop();
      expect(words.join(' ')).to.equal(
        `Connected on ${host}:${port} - Version:`
      );
    });
    cy.wait(500);
    cy.url().should('be.equals', `${Cypress.config().baseUrl}#/server/prepare`);
  });

  it('try connect with valid websocket host, port and invalid key', () => {
    cy.visit('/');
    cy.url().should(
      'be.equals',
      `${Cypress.config().baseUrl}#/server/configure`
    );
    cy.get('[name="address"]').clear().type(host);
    cy.get('[name="port"]').clear().type(port);
    cy.get('[name="key"]').clear().type('key-test-wrong');
    cy.get('.btn_next').click();
    // cy.get('.error-message .q-banner__content div')
    //   .invoke('text')
    //   .should('eq', 'Server key not valid');
    cy.get('[name="key"]')
      .parent()
      .parent()
      .get('.q-field__append .q-icon')
      .invoke('text')
      .should('eq', 'arrow_drop_downerror');
    cy.get('.q-footer .q-toolbar div:first').then(($div) => {
      const texto = $div.clone().children().remove().end().text().trim();
      expect(texto).to.equal(`Error on try connect ${host}:${port}`);
    });
    cy.get('[name="next"]').should('not.be.disabled');
    cy.wait(5000);
    cy.get('.q-footer .q-toolbar div:first').then(($div) => {
      const texto = $div.clone().children().remove().end().text().trim();
      expect(texto).to.equal('Not connected');
    });
  });

  it('try connect with valid websocket port, key and invalid host', () => {
    cy.visit('/');
    cy.url().should(
      'be.equals',
      `${Cypress.config().baseUrl}#/server/configure`
    );
    cy.get('[name="address"]').clear().type('ws://host-wrong');
    cy.get('[name="port"]').clear().type(port);
    cy.get('[name="key"]').clear().type(key);
    cy.get('.btn_next').click();
    // cy.get('.error-message .q-banner__content div')
    //   .invoke('text')
    //   .should('eq', 'Could not connect to the server. Timeout');
    cy.get('[name="address"]')
      .parent()
      .parent()
      .get('.q-field__append .q-icon')
      .invoke('text')
      .should('eq', 'arrow_drop_downerrorerror');
    cy.get('[name="port"]')
      .parent()
      .parent()
      .get('.q-field__append .q-icon')
      .invoke('text')
      .should('eq', 'arrow_drop_downerrorerror');
    cy.get('.q-footer .q-toolbar div:first').then(($div) => {
      const texto = $div.clone().children().remove().end().text().trim();
      expect(texto).to.equal(`Error on try connect ws://host-wrong:${port}`);
    });
    cy.get('[name="next"]').should('not.be.disabled');
    cy.wait(5000);
    cy.get('.q-footer .q-toolbar div:first').then(($div) => {
      const texto = $div.clone().children().remove().end().text().trim();
      expect(texto).to.equal('Not connected');
    });
  });

  it('try connect with valid websocket host, key and invalid port', () => {
    cy.visit('/');
    cy.url().should(
      'be.equals',
      `${Cypress.config().baseUrl}#/server/configure`
    );
    cy.get('[name="address"]').clear().type(host);
    cy.get('[name="port"]').clear().type('9852');
    cy.get('[name="key"]').clear().type(key);
    cy.get('.btn_next').click();
    // cy.get('.error-message .q-banner__content div')
    //   .invoke('text')
    //   .should('eq', 'The server address or port is incorrect');
    cy.get('[name="address"]')
      .parent()
      .parent()
      .get('.q-field__append .q-icon')
      .invoke('text')
      .should('eq', 'arrow_drop_downerrorerror');
    cy.get('[name="port"]')
      .parent()
      .parent()
      .get('.q-field__append .q-icon')
      .invoke('text')
      .should('eq', 'arrow_drop_downerrorerror');
    cy.get('.q-footer .q-toolbar div:first').then(($div) => {
      const texto = $div.clone().children().remove().end().text().trim();
      expect(texto).to.equal(`Error on try connect ${host}:9852`);
    });
    cy.get('[name="next"]').should('not.be.disabled');
    cy.wait(5000);
    cy.get('.q-footer .q-toolbar div:first').then(($div) => {
      const texto = $div.clone().children().remove().end().text().trim();
      expect(texto).to.equal('Not connected');
    });
  });

  it('test button next disabled if host empty', () => {
    cy.visit('/');
    cy.get('[name="address"]').clear();
    cy.get('.q-field--error .q-field__messages div')
      .invoke('text')
      .should('eq', 'Type valid address');
    cy.get('[name="address"]')
      .parent()
      .parent()
      .get('.q-field__append .q-icon')
      .invoke('text')
      .should('eq', 'arrow_drop_downerror');
    cy.get('[name="next"]').should('be.disabled');
    cy.get('.q-footer .q-toolbar div:first').then(($div) => {
      const texto = $div.clone().children().remove().end().text().trim();
      expect(texto).to.equal('Not connected');
    });
  });

  it('test button next disabled if port empty', () => {
    cy.visit('/');
    cy.get('[name="port"]').clear();
    cy.get('.q-field--error .q-field__messages div')
      .invoke('text')
      .should('eq', 'Please type something');
    cy.get('[name="port"]')
      .parent()
      .parent()
      .get('.q-field__append .q-icon')
      .invoke('text')
      .should('eq', 'arrow_drop_downerror');
    cy.get('[name="next"]').should('be.disabled');
    cy.get('.q-footer .q-toolbar div:first').then(($div) => {
      const texto = $div.clone().children().remove().end().text().trim();
      expect(texto).to.equal('Not connected');
    });
  });

  it('test try input non number into port', () => {
    cy.visit('/');
    cy.get('[name="port"]').clear().type('test');
    cy.get('.q-field--error .q-field__messages div')
      .invoke('text')
      .should('eq', 'Please type something');
    cy.get('[name="port"]')
      .parent()
      .parent()
      .get('.q-field__append .q-icon')
      .invoke('text')
      .should('eq', 'arrow_drop_downerror');
    cy.get('[name="next"]').should('be.disabled');
    cy.get('[name="port"]')
      .invoke('val')
      .then((data) => {
        expect(data).to.empty;
      });
    cy.get('.q-footer .q-toolbar div:first').then(($div) => {
      const texto = $div.clone().children().remove().end().text().trim();
      expect(texto).to.equal('Not connected');
    });
  });

  it('test button next disabled if key empty', () => {
    cy.visit('/');
    cy.get('[name="key"]').clear();
    cy.get('.q-field--error .q-field__messages div')
      .invoke('text')
      .should('eq', 'Please type something');
    cy.get('[name="key"]')
      .parent()
      .parent()
      .get('.q-field__append .q-icon')
      .invoke('text')
      .should('eq', 'arrow_drop_downerror');
    cy.get('[name="next"]').should('be.disabled');
    cy.get('.q-footer .q-toolbar div:first').then(($div) => {
      const texto = $div.clone().children().remove().end().text().trim();
      expect(texto).to.equal('Not connected');
    });
  });

  it('test close error message', () => {
    cy.visit('/');
    cy.url().should(
      'be.equals',
      `${Cypress.config().baseUrl}#/server/configure`
    );
    cy.get('[name="address"]').clear().type(host);
    cy.get('[name="port"]').clear().type(port);
    cy.get('[name="key"]').clear().type('key-test-wrong');
    cy.get('.btn_next').click();
    // cy.get('.error-message .q-banner__content div')
    //   .invoke('text')
    //   .should('eq', 'Server key not valid');
    cy.get('.error-message .q-banner__actions i').click();
    cy.get('.error-message').should('not.exist');
  });

  it('test footer not connected', () => {
    cy.visit('/');
    cy.get('.q-footer .q-toolbar div:first').then(($div) => {
      const texto = $div.clone().children().remove().end().text().trim();
      expect(texto).to.equal('Not connected');
    });
  });

  it('test footer version', () => {
    cy.readFile('package.json').then((file) => {
      cy.visit('/');
      cy.get('.q-footer .q-toolbar div:last')
        .invoke('text')
        .should('eq', `Version: ${file.version}`);
    });
  });
});
