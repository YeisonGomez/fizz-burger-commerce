"use strict";

require("dotenv").config();

const { expect } = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");

const db = require("../../@common/mongoDB/database");
const ProductModel = require("../models/product");
const { handler } = require("../delete");
const { PRODUCT_ID_DELETED } = require("./constants/delete.constant");

describe("Delete Product Handler", () => {
  let deleteOneStub;

  beforeEach(() => {
    sinon.stub(db, "connectToDatabase").resolves();

    deleteOneStub = sinon.stub(ProductModel, "findByIdAndDelete").resolves({ 
      _id: new mongoose.Types.ObjectId(PRODUCT_ID_DELETED),
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should delete a product successfully", async () => {
    const mockEvent = {
      httpMethod: "DELETE",
      pathParameters: {
        id: PRODUCT_ID_DELETED,
      },
    };

    const result = await handler(mockEvent);
    expect(result.statusCode).to.equal(200);
    const body = JSON.parse(result.body);
    expect(body.message).to.equal("Product deleted successfully");
    expect(body.productDeleted._id).to.exist;
  });

  it("should return 404 if product does not exist", async () => {
    deleteOneStub.restore(); 
    sinon.stub(ProductModel, "findByIdAndDelete").resolves(null);

    const mockEvent = {
      httpMethod: "DELETE",
      pathParameters: {
        id: "661cf13f1c0f2b5f0b4c0000", 
      },
    };

    const result = await handler(mockEvent);
    expect(result.statusCode).to.equal(404);
    const body = JSON.parse(result.body);
    expect(body).to.have.property("key", "product_not_exists");
    expect(body).to.have.property("message", "Product not found");
  });

  it("should return 500 if product ID is invalid (malformed)", async () => {
    const mockEvent = {
      httpMethod: "DELETE",
      pathParameters: {
        id: "invalid-id-format", 
      },
    };

    const result = await handler(mockEvent);
    expect(result.statusCode).to.equal(500);
    const body = JSON.parse(result.body);
    expect(body).to.have.property("key", "internal_server_error");
    expect(body).to.have.property("details", "hex string must be 24 characters");
  });
});