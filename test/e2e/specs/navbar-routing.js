module.exports = {
  'clicking router links changes url': function(browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL;
    browser
      .url(devServer)
      .waitForElementVisible(`#to-add-origins`, 5000)
      .assert.elementPresent(`#to-add-origins`)
      .assert.containsText(`#to-add-origins`, `Add Origins`)
      .click(`#to-add-origins`)
      .waitForElementVisible('body', 1000)
      .assert.urlEquals(devServer + `/#/add/origins`)
      .assert.containsText('#app h2', 'Add Origins')
      //
      .waitForElementVisible(`#to-add-destinations`, 5000)
      .assert.elementPresent(`#to-add-destinations`)
      .assert.containsText(`#to-add-destinations`, `Add Destinations`)
      .click(`#to-add-destinations`)
      .waitForElementVisible('body', 1000)
      .assert.urlEquals(devServer + `/#/add/destinations`)
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
    // const _test1 = (toAdd)=>{
    //   browser
    //     .url(devServer)
    //     .waitForElementVisible(`#to-add-${toAdd}`, 5000)
    //     .assert.elementPresent(`#to-add-${toAdd}`)
    //     .assert.containsText(`#to-add-${toAdd}`, `Add ${
    //       toAdd[0].toUpperCase() + toAdd.slice(1)
    //     }`)
    //     .click(`#to-add-${toAdd}`)
    //     .waitForElementVisible('body', 1000)
    //     .assert.urlEquals(devServer + `/#/add/${toAdd}`)
    //     .end();
    // };
    // _test1('origins');
    // _test1('destinations');
    // _test1('commutes');
    // browser
    //   .url(devServer)
    //   .waitForElementVisible(`#to-compare`, 5000)
    //   .assert.elementPresent(`#to-compare`)
    //   .assert.containsText(`#to-compare`, 'Compare Commutes')
    //   .click(`#to-compare`)
    //   .waitForElementVisible('body', 1000)
    //   .assert.urlEquals(devServer + `/#/compare`)
    //   .end();
  }
};
