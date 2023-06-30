import registerCodeCoverageTasks from '@cypress/code-coverage/task';
import { injectQuasarDevServerConfig } from '@quasar/quasar-app-extension-testing-e2e-cypress/cct-dev-server';
import { defineConfig } from 'cypress';

const baseUrl = process.env.CYPRESS_HOST_TEST
  ? `http://${process.env.CYPRESS_HOST_TEST}/`
  : 'http://localhost:9000/';

console.log('Cypress baseUrl', {
  baseUrl,
});

export default defineConfig({
  fixturesFolder: 'test/cypress/fixtures',
  screenshotsFolder: 'test/cypress/screenshots',
  videosFolder: 'test/cypress/videos',
  video: false,
  e2e: {
    setupNodeEvents(on, config) {
      registerCodeCoverageTasks(on, config);
      return config;
    },
    baseUrl,
    supportFile: 'test/cypress/support/e2e.ts',
    specPattern: 'test/cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
  defaultCommandTimeout: 20000,
  env: {
    DOCKER_SERVER_HOSTNAME: process.env.DOCKER_SERVER_HOSTNAME,
    DOCKER_SERVER_PORT: process.env.DOCKER_SERVER_PORT,
    DOCKER_SERVER_KEY: process.env.DOCKER_SERVER_KEY,
  },
  component: {
    setupNodeEvents(on, config) {
      registerCodeCoverageTasks(on, config);
      return config;
    },
    supportFile: 'test/cypress/support/component.ts',
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
    indexHtmlFile: 'test/cypress/support/component-index.html',
    devServer: process.env.CYPRESS_HOST_TEST
      ? null
      : injectQuasarDevServerConfig(),
  },
});
