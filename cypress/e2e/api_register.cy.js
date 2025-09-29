describe("Register API Test 10 times", () => {
  it("should send Register API request 10 times from intercepted JSON", () => {
    // โหลดไฟล์ intercepted_post_data.json ที่เราดักไว้จากหน้าเว็บ
    cy.fixture("intercepted_post_data.json").then((data) => {
      const request = data[0]; // เอาข้อมูล object แรกมาใช้ (Register API)

      // ยิง API 10 รอบ
      for (let i = 0; i < 10; i++) {
        cy.request({
          method: request.method,
          url: request.url,
          body: request.requestBody,
          failOnStatusCode: false, // ป้องกันไม่ให้เทส fail ถ้าได้ status 400
        }).then((response) => {
          // แสดงผลใน Cypress Runner
          cy.log(`Run ${i + 1} → Status: ${response.status}`);
          cy.log(`Response: ${JSON.stringify(response.body)}`);

          // เขียน response แต่ละรอบเก็บลงไฟล์ JSON
          cy.writeFile(
            `cypress/fixtures/api_response_${i + 1}.json`,
            {
              run: i + 1,
              status: response.status,
              body: response.body,
            },
            { log: true }
          );
        });
      }
    });
  });
});
describe("Register multiple users with data from fixtures", () => {
  before(() => {
    // ✅ clear file ก่อนรัน test
    cy.writeFile("cypress/fixtures/all_responses.json", []);
  });

  it("should register 10 users and save all responses in one file", () => {
    cy.fixture("emails").then((users) => {
      const allResponses = [];

      users.forEach((user, index) => {
        cy.request({
          method: "POST",
          url: "https://robot-lab.onrender.com/api/auth/register",
          body: user,
          failOnStatusCode: false, // กัน error 400/409 ไม่ให้เทสล้ม
        }).then((res) => {
          allResponses.push({
            run: index + 1,
            request: user,
            status: res.status,
            response: res.body,
          });

          // ✅ เขียนทับใหม่ทุกครั้งที่ยิงเสร็จ
          cy.writeFile(
            "cypress/fixtures/all_responses.json",
            allResponses,
            { log: true }
          );
        });
      });
    });
  });
});
