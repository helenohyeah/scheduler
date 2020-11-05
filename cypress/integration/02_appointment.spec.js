describe("Appointment", () => {

  beforeEach(() => {
    // visit root of web server
    cy.visit("/");
    // wait for page to load
    cy.contains("li", "Monday")
  });
  
  it("should book an interview", () => {
    // click "Add" button in second appointment
    cy.get("[alt='Add']")
      .first()
      .click()
      
    // enter name
    cy.get(".appointment")
      .find("input")
      .type("Lydia Miller-Jones")
    
    // choose an interviewer
    cy.get(".interviewers__list > li")
      .first()
      .click()

    // click "Save" button
    cy.contains("button", "Save")
      .click()

    // see booked appointment
    cy.get(".appointment")
      .eq(1)
      .should("contain", "Lydia Miller-Jones")
      .should("contain", "Sylvia Palmer")
  });

  it("should edit an interview", () => {
    // click "Edit" button for an existing appointment
    cy.get("[alt='Edit']")
      .first()
      .click({ force:true })

    // change the name and interviewer
    cy.get(".appointment")
      .find("input")
      .clear()
      .type("Angela Chan")
      .get(".interviewers__list > li")
      .last()
      .click()

    // click "Save" button
    cy.contains("button", "Save")
      .click()

    // see edited appointment
    cy.get(".appointment")
      .eq(0)
      .should("contain", "Angela Chan")
      .should("contain", "Tori Malcolm")
  });

  it("should cancel an interview", () => {
    //click "Delete" button for an existing appointment
    cy.get(".appointment__card")
      .first()
      .find("[alt='Delete']")
      .click({ force:true })

    //click "Confirm" button
    cy.contains("button", "Confirm")
      .click()

    //see empty appointment slot
    cy.get(".appointment")
      .first()
      .should("have.descendants", ".appointment__add")
  });
});