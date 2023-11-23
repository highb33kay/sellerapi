const { expect } = require("chai");
const supertest = require("supertest");
const app = require("../index");

describe("Seller API Tests", () => {
  it("should update seller account", async () => {
    const sellerData = {
      city: "New City",
      state: "New State",
    };

    // Assuming you have a valid seller username and password in your test environment
    const username = "e49c26c3edfa46d227d5121a6b6e4d37";
    const password = "55325";
    const credentials = Buffer.from(`${username}:${password}`).toString(
      "base64"
    );

    const res = await supertest(app)
      .put("/account")
      .send(sellerData)
      .set("Authorization", `Basic ${credentials}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("newCity").to.equal("New City");
    expect(res.body).to.have.property("newState").to.equal("New State");
  });
});

// Test for the getOrderItems controller
describe("Order Items API Tests", () => {
  it("should get order items", async () => {
    // Assuming you have a valid seller username and password in your test environment
    const username = "e49c26c3edfa46d227d5121a6b6e4d37";
    const password = "55325";
    const credentials = Buffer.from(`${username}:${password}`).toString(
      "base64"
    );

    const res = await supertest(app)
      .get("/order-items")
      .set("Authorization", `Basic ${credentials}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("data");
    expect(res.body).to.have.property("total");
    expect(res.body).to.have.property("limit");
    expect(res.body).to.have.property("offset");
  });
});

// Test for the deleteOrderItem controller
describe("Order Items API Tests", () => {
  it("should delete order item", async () => {
    // Assuming you have a valid seller username and password in your test environment
    const username = "e49c26c3edfa46d227d5121a6b6e4d37";
    const password = "55325";
    const credentials = Buffer.from(`${username}:${password}`).toString(
      "base64"
    );

    const res = await supertest(app)
      .delete("/order-items/5f0baba6e4b0b6a7d7a7d9a8")
      .set("Authorization", `Basic ${credentials}`);

    expect(res.status).to.equal(201);
    expect(res.body)
      .to.have.property("message")
      .to.equal("Order item deleted successfully");
  });
});
