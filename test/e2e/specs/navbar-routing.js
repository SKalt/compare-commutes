module.exports = {
  'clicking router links changes url': function(browser) {
    const devServer = browser.globals.devServerURL;
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    browser
      .url(devServer)
      .waitForElementVisible(`#to-add-origins`, 5000)
      .assert.elementPresent(`#to-add-origins`)
      .assert.containsText(`#to-add-origins`, `Add Origins`)
      .click(`#to-add-origins`)
      .waitForElementVisible('body', 1000)
      .assert.urlEquals(devServer + `/#/add/locations/origin`)
      .assert.containsText('#app h2', 'Add Origins')
      //
      .waitForElementVisible(`#to-add-destinations`, 5000)
      .assert.elementPresent(`#to-add-destinations`)
      .assert.containsText(`#to-add-destinations`, `Add Destinations`)
      .click(`#to-add-destinations`)
      .waitForElementVisible('body', 1000)
      .assert.urlEquals(devServer + `/#/add/locations/destination`)
      .assert.containsText('#app h2', 'Add Destinations')
      //
      .waitForElementVisible(`#to-add-commutes`, 5000)
      .assert.elementPresent(`#to-add-commutes`)
      .assert.containsText(`#to-add-commutes`, `Add Commutes`)
      .click(`#to-add-commutes`)
      .waitForElementVisible('body', 1000)
      .assert.urlEquals(devServer + `/#/add/commutes`)
      .assert.containsText('#app h2', 'Add Commutes')
      //
      .waitForElementVisible(`#to-compare`, 5000)
      .assert.elementPresent(`#to-compare`)
      .assert.containsText(`#to-compare`, `Compare`)
      .click(`#to-compare`)
      .waitForElementVisible('body', 1000)
      .assert.urlEquals(devServer + `/#/compare`)
      .assert.containsText('#app h2', 'Compare')
      //
      .end();
  },
  'The navbar does not change the url query': function(browser) {
    const devServer = browser.globals.devServerURL;
    browser
      .url(`${devServer}/#/?foo=true`)
      .waitForElementVisible(`#to-add-origins`, 5000)
      .click(`#to-add-origins`)
      .waitForElementVisible('body', 1000)
      .assert.urlEquals(devServer + `/#/add/locations/origin?foo=true`)
      .end();
  }
};
