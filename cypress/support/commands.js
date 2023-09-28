Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  return false;
});

// type password email with selector and params
Cypress.Commands.add("clearAndType", (selec, params) => {
  cy.get(selec).clear().type(params);
});

// click the button
Cypress.Commands.add("clickLogin", () => {
  cy.get("input[value ='Login']").click();
});

// login with password and email
Cypress.Commands.add("Login", (email, password) => {
  cy.clearAndType("#login", email);
  cy.clearAndType("#login_password", password);
  cy.clickLogin();
});

Cypress.Commands.add("checkTick", (classname) => {
  cy.get("#form")
    .should("have.class", classname)
    .get(".icon-inside-field.input-container.validate_icon")
    .should("be.visible");
});

Cypress.Commands.add("checkMasking", (type) => {
  cy.get("#login_password").invoke("prop", "type").should("eq", type);
});

Cypress.Commands.add("formValidator", (selector, message) => {
  cy.get(selector).should("have.prop", "validationMessage").and("eq", message);
});

Cypress.Commands.add("LoginValidator", (selec, message) => {
  cy.get(selec).should("contain", message);
});

Cypress.Commands.add("dropdownValidator", (selec, selectValue, value) => {
  cy.get(selec).select(selectValue).invoke("val").should("eq", value);
});

//dashboard commands

//create task

Cypress.Commands.add("createTask", (taskName, listName, priority, dateTime) => {
  cy.get(".date-section > .btn").click();

  cy.get(".modal-body .task-form").within(() => {
    cy.clearAndType("#task-name", taskName);

    cy.get("#select-list").select(listName);
    cy.get("#select-priority").select(priority);

    cy.clearAndType("#date_time", dateTime);
    cy.get("#date_time").click();

    cy.get("button[type='submit']").click();
  });
  cy.get(".toast").should("be.be.visible");

  cy.get(".toast-body .o_notification_content").should(
    "have.text",
    "New Task Created!!"
  );
});

Cypress.Commands.add("editTask", (taskName, listName) => {
  cy.get(".accordion-header")
    .contains("h3", listName)
    .click()
    .parents(".accordion-item")
    .get(".accordion-content .task-inside-list")
    .contains("p", taskName)
    .parent()
    .within(() => {
      cy.get(".kebab-div .dots-div")
        .click()
        .parent()
        .find(".menu-items .edit-task-btn")
        .click();
    });

  cy.get("#taskEditModal .modal-content").should("be.visible");
});
Cypress.Commands.add("deleteTask", (taskName, listName) => {
  cy.get(".accordion-header")
    .contains("h3", listName)
    .click()
    .parents(".accordion-item")
    .get(".accordion-content .task-inside-list")
    .contains("p", taskName)
    .parent()
    .within(() => {
      cy.get(".kebab-div .dots-div")
        .click()
        .parent()
        .find(".menu-items .delete-task-btn")
        .click();
    });
});

Cypress.Commands.add("editList", (listName) => {
  cy.contains(".accordion-header", listName)
    .find(".kebab-div .dots-div")
    .click()
    .parent()
    .find(".menu-items .edit-list-btn")
    .click();
  cy.get(".modal-content").should("be.visible");
});

Cypress.Commands.add("deleteList", (listName) => {
  cy.contains(".accordion-header", listName)
    .find(".kebab-div .dots-div")
    .click()
    .parent()
    .find(".menu-items .delete-list-btn")
    .click();
  cy.get(".accordion-header").find(listName).should("not.exist");
});

Cypress.Commands.add("compareTaskCount", (taskSelector) => {
  cy.get(taskSelector)
    .invoke("text")
    .then((text) => {
      const overDueCount = text;
      cy.get(taskSelector).click();
      cy.wait(1000);
      cy.get(".count-div-task p")
        .invoke("text")
        .then((text) => {
          const insidecount = text;

          expect(insidecount).eq(overDueCount);

         
        });
    });
});

Cypress.Commands.add(
  "markTaskCompleted",
  (taskSelector, taskName, listName) => {
    cy.get(taskSelector).click();
    cy.wait(1000);
    cy.get(".task-section .form-check")
      .contains("h3", taskName)
      .parent()
      .contains("p", listName)
      .parents(".checkbox-name")
      .find(".button-task")
      .click();

    cy.get(".toast-body .o_notification_content").should(
      "have.text",
      "Congratulations Task Completed"
    );
  }
);
