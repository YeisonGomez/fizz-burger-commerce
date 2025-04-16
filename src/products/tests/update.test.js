"use strict";

require("dotenv").config();

const { expect } = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");

const db = require("../../@common/mongoDB/database");
const { BaseDto } = require("../../@utils/BaseDto");
const ApiResponse = require("../../@utils/ApiResponse");
const ProductModel = require("../models/product");
const { UpdateSchema } = require("../dto/update.schema");
const { handler } = require("../update");
const { PRODUCT_ID_UPDATED } = require("./constants/update.constant");

describe("Update Product Handler", () => {
  let findOneStub;
  let updateOneStub;

  beforeEach(() => {
    sinon.stub(db, "connectToDatabase").resolves();

    findOneStub = sinon.stub(ProductModel, "findOne").resolves({
      _id: new mongoose.Types.ObjectId(PRODUCT_ID_UPDATED),
    });

    updateOneStub = sinon.stub(ProductModel, "updateOne").resolves();
  });

  afterEach(() => {
    sinon.restore();
  });

  it("should update a product successfully", async () => {
    const mockEvent = {
      httpMethod: "PUT",
      pathParameters: {
        id: PRODUCT_ID_UPDATED,
      },
      body: JSON.stringify({
        name: "New name product",
      }),
    };

    const result = await handler(mockEvent);
    expect(result.statusCode).to.equal(201);
    const body = JSON.parse(result.body);
    expect(body.message).to.equal("Product updated successfully");
    expect(body).to.have.property("productUpdated", PRODUCT_ID_UPDATED);
  });

  it("should return 404 if product does not exist", async () => {
    findOneStub.restore(); 
    sinon.stub(ProductModel, "findOne").resolves(null);

    const mockEvent = {
      httpMethod: "PUT",
      pathParameters: {
        id: "561cf13f1c0f2b5f0b4c0639",
      },
      body: JSON.stringify({
        name: "New name product",
      }),
    };

    const result = await handler(mockEvent);
    expect(result.statusCode).to.equal(404);
    const body = JSON.parse(result.body);

    expect(body).to.have.property("key", "product_not_exists");
    expect(body).to.have.property("message", "Product not found");
  });

  it("should throw a validation error when type is missing enum", () => {
    const invalidData = {
      type: "fooderror",
    };

    try {
      new BaseDto(UpdateSchema, invalidData).validate();
      throw new Error("Validation should have failed but passed");
    } catch (err) {
      expect(err).to.be.instanceOf(ApiResponse);
      const response = err.toResponse();
      const parsedBody = JSON.parse(response.body);

      expect(response.statusCode).to.equal(400);
      expect(parsedBody).to.have.property("key", "validation_error");
      expect(parsedBody.errors).to.be.an("array");
      expect(parsedBody.errors[0]).to.have.property("field", "type");
      expect(parsedBody.errors[0].message).to.include("Invalid enum value. Expected");
    }
  });
});
