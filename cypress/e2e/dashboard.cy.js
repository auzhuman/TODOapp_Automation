///<reference types = "Cypress"/>
describe("dashboard test suite", () => {
  let task, URL, message, priority, taskSelector;

  before(() => {
    cy.fixture("dashboard").then((data) => {
      task = data.task;
      message = data.message;
      URL = data.URL;
      priority = data.priority;
      taskSelector = data.taskSelector;
    });
  });

  beforeEach(() => {
    cy.visit("/web/login");
    cy.Login(Cypress.env("email"), Cypress.env("password"));
    cy.visit(URL.todoURL);
  });

  it("should display username acronym", () => {
    cy.get(".avatar-name").invoke("text").should("eq", "MA");
  });

  it("should display and hide task card", () => {
    // should display create task board
    cy.get(".date-section > .btn").click();
    cy.get("#taskModal > .modal-dialog > .modal-content").should("be.visible");

    // should close  create task board
    cy.get(
      "#taskModal > .modal-dialog > .modal-content > .modal-header > .close"
    ).click();
    cy.get("#taskModal > .modal-dialog > .modal-content").should(
      "not.be.visible"
    );
  });

  it("should display error while  task name is longer than 20 chars", () => {
    cy.get(".date-section > .btn").click();
    cy.clearAndType("#task-name", task.longTaskName);
    cy.formValidator("#task-name", message.textLength);
  });

  it("should only choose a single item from priority dropdown", () => {
    cy.get(".date-section > .btn").click();
    cy.dropdownValidator("#select-priority", priority[2], "3");
  });

  it("should select data and time", () => {
    cy.get(".date-section > .btn").click();
    cy.clearAndType("#date_time", task.dateTime);
    cy.get("#date_time").click().should("have.value", task.checkDateTime);
  });

  it.only("should create a task successfully", () => {
    cy.createTask(task.taskName, task.listName, priority[2], task.dateTime);
  });

  it("should edit the created task", () => {
    cy.editTask(task.taskName, task.listName);
  });

  it("should edit the created list", () => {
    cy.editList(task.listName);
  });
  it("should delete the created task", () => {
    cy.deleteTask(task.taskName, task.listName);
  });

  it("should delete the created list", () => {
    cy.deleteList(task.listName);
  });

  it("should match the count of task", () => {
    cy.compareTaskCount(taskSelector.overDue);
    cy.compareTaskCount(taskSelector.upcoming);
    cy.compareTaskCount(taskSelector.today);
  });

  it("should check  the task as completed", () => {
    cy.markTaskCompleted(taskSelector.overDue, task.taskName, task.listName);
  });
});
