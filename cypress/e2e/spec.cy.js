describe("Register API Capture", () => {
  it("should capture Register API requests", () => {
    const interceptedData = [];

    // ดัก API Register
    cy.intercept("POST", "https://robot-lab.onrender.com/api/auth/register", (req) => {
      req.continue((res) => {
        interceptedData.push({
          url: req.url,
          method: req.method,
          requestBody: req.body,
          responseBody: res.body,
          statusCode: res.statusCode,
        });
      });
    }).as("registerApi");

    cy.visit("https://robot-lab-five.vercel.app/");
    cy.get(".nav-btn-register").click();

    // ✅ ใช้ selector ที่ถูกต้อง
    cy.get("#firstName").type("cypress");
    cy.get("#lastName").type("lab");
    cy.get("#email").type("cypress@gmail.com");        // แก้ตรงนี้
    cy.get('#password').type("password147852");
    cy.get("form > button").click({ force: true });

    cy.wait("@registerApi");

    // ✅ บันทึกลงไฟล์ JSON
    cy.then(() => {
      cy.writeFile(
        "cypress/fixtures/intercepted_post_data.json",
        interceptedData,
        { log: true }
      );
    });
  });
});
