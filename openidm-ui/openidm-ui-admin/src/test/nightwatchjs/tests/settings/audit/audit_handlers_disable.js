var auditPage,
    handlersSection,
    handlersDialogSection;

module.exports = {
    before: function(client, done) {
        client.globals.login.helpers.setSession(client, function() {
            auditPage = client.page.configureSysPrefAudit();
            auditPage
                .navigate()
                .expect.section("@eventHandlers").to.be.visible.before(2000);
            handlersSection = auditPage.section.eventHandlers;
            handlersDialogSection = auditPage.section.eventHandlersDialog;
            done();
        });
    },
    after: function(client) {
        client.end();
    },

    "It should not allow disable when the 'use for query' handler": function(client) {
        var useForQueriesRadio = handlersSection.elements.useForQueriesRadio.selector;

        client.getAttribute(useForQueriesRadio, "checked", function(result) {
            if (!result.value) {
                client
                .pause(250)
                .click(useForQueriesRadio);
            }

        });

        handlersSection
            .click("@editHandlerButton");

        handlersDialogSection
            .waitForElementPresent("@name", 2000)
            .expect.element("@enabledCheck").to.not.be.present;

        handlersDialogSection
            .expect.element("@enableField").to.contain.text("Hander required for queries");

        handlersDialogSection
            .click("@closeButton");
    },

    "It should allow disable when not the 'use for query' hanlder": function(client) {
        var editHandlerButton = handlersSection.elements.editHandlerButton.selector;

        client
            .elements("css selector", editHandlerButton, function(result) {
                client.assert.ok(result.value.length > 1, "More than one handler present");
            })
            .pause(275);

        handlersSection
            .click("@repoUseForQueries")
            .click("@editHandlerButton");

        handlersDialogSection
            .waitForElementPresent("@name", 2000)
            .expect.element("@enabledCheck").to.be.present;
    },

    "It should allow disable when adding a hanlder": function(client) {
        handlersSection
            .click("@addEventHandlerButton");

        handlersDialogSection
            .waitForElementPresent("@name", 2000)
            .expect.element("@enabledCheck").to.be.present;
    }

};
