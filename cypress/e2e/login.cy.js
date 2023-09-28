///<reference.clearAndType = "Cypress"/>
describe("login test suite", () => {
  let credential, message;
  let email = Cypress.env("email");
  let password = Cypress.env("password");

  before(() => {
    cy.fixture("login").then((data) => {
      credential = data.credential;
      message = data.message;
    });
  });

  beforeEach(() => {
    cy.visit("/web");
  });

  it("Should display a validation message when the Email or the Password field is left empty. ", () => {
    //for both empty field
    cy.clickLogin();
    cy.formValidator("#login", message.validation);

    // for empty password field
    cy.clearAndType("#login", email);
    cy.clickLogin();
    cy.formValidator("#login_password", message.validation);

    cy.get("#login").clear();

    //for empty email field
    cy.clearAndType("#login_password", credential.invalidPassword);
    cy.clickLogin();
    cy.formValidator("#login", message.validation);
  });

  it("Should display a green tick upon entering a valid email.", () => {
    cy.clearAndType("#login", credential.validEmail);
    cy.checkTick("valid-email");
  });

  it("Should display a red cross upon entering an invalid email.", () => {
    cy.clearAndType("#login", credential.invalidEmail);
    cy.checkTick("invalid-email");

    cy.get("#validation_text")
      .invoke("text")
      .should("eq", message.emailValidation);
  });

  it("eye icon should hide and show password on click ", () => {
    // should display masked password when user enters password
    cy.clearAndType("#login_password", password);
    cy.checkMasking("password");

    // should display unmasked password after clicking eye icon
    cy.get(".toggle-password").click().checkMasking("text");

    // should display masked password after double clicking eye icon
    cy.get(".toggle-password").click().checkMasking("password");
  });

  it(`Should display error message after entering invalid credentials.`, () => {
    // Should display error message after entering invalid email and invalid password.
    cy.Login(credential.invalidEmail, credential.invalidPassword);
    cy.LoginValidator("p.alert", message.error);

    // `Should display error message after entering valid email but an invalid password.`
    cy.Login(email, credential.invalidPassword);
    cy.LoginValidator("p.alert", message.error);

    // `Should display error message after entering invalid email but a valid password.`
    cy.Login(credential.invalidEmail, password);
    cy.LoginValidator("p.alert", message.error);
  });

  it("Should redirect to  Todo inbox page after entering valid credential", () => {
    cy.Login(email, password);
    cy.LoginValidator(".oe_topbar_name", credential.name);
  });
  
});
