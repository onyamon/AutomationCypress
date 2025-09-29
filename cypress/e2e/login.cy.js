describe("Login Testing", () => {
  it("should login Success", () => {
    cy.visit("https://robot-lab-five.vercel.app/");
    cy.get(".nav-btn-login").click();
    cy.get("#loginEmail").type("boss2@gmail.com");
    cy.wait(3000);
    cy.get("#loginPassword").type("password1234");
    cy.get("form > button").click({ force: true });

    cy.get(".message")
      .invoke("text")
      .then((text) => {
        cy.log("Login Success Message:", text);
        cy.wait(3000);
        expect(text).to.contain("Login successful! Welcome, Boss!");
      });
  });

  it("should login Fail", () => {
    cy.visit("https://robot-lab-five.vercel.app/");
    cy.get(".nav-btn-login").click();
    cy.get("#loginEmail").type("wrong@gmail.com");
    cy.wait(3000);
    cy.get("#loginPassword").type("wrongpassword");
    cy.get("form > button").click({ force: true });

    cy.get(".message")
      .invoke("text")
      .then((text) => {
        cy.log("Login Fail Message:", text);
        cy.wait(3000);
        expect(text).to.contain("Invalid email or password");
      });
  });
});
