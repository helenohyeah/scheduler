describe("Appointments", () => {

  beforeEach(() => {
    // reset db
    cy.request("GET", "http://localhost:8001/api/debug/reset");
    // visit root of web server
    cy.visit("/");
    // wait for page to load
    cy.contains("Monday");
  });
  
  it("should book an interview", () => {
    // click "Add" button in second appointment
    cy.get("[alt='Add']")
      .first()
      .click();

    // enter name
    cy.get("[data-testid=student-name-input]")
      .type("Lydia Miller-Jones");
    
    // choose an interviewer
    cy.get("[alt='Sylvia Palmer']")
      .click();

    // click "Save" button
    cy.contains("button", "Save")
      .click();

    // see booked appointment
    cy.get(".appointment__card--show")
      .should("contain", "Lydia Miller-Jones")
      .should("contain", "Sylvia Palmer");
  });

  it("should edit an interview", () => {
    // click "Edit" button for an existing appointment
    cy.get("[alt='Edit']")
      .first()
      .click({ force:true });

    // change the name and interviewer
    cy.get("[data-testid=student-name-input]")
      .clear()
      .type("Angela Chan")
      .get("[alt='Tori Malcolm']")
      .click();

    // click "Save" button
    cy.contains("button", "Save")
      .click();

    // see edited appointment
    cy.get(".appointment")
      .eq(0)
      .should("contain", "Angela Chan")
      .should("contain", "Tori Malcolm");
  });

  it("should cancel an interview", () => {
    //click "Delete" button for an existing appointment
    cy.get("[alt='Delete']")
      .click({ force:true });

    //click "Confirm" button
    cy.contains("button", "Confirm")
      .click();

    //see "Deleting" show and then disappear
    cy.contains("Deleting").should("exist");
    cy.contains("Deleting").should("not.exist");

    //see "Archie Cohen" appointment has been deleted
    cy.contains(".appointment__card--show", "Archie Cohen")
      .should("not.exist")

    //see empty appointment slot
    cy.get(".appointment")
      .first()
      .should("have.descendants", ".appointment__add");
  });
});