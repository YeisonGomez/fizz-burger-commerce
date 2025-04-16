'use strict';

require('dotenv').config();

const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const ProductModel = require('../models/product');
const { handler } = require('../delete');

describe('Delete Product By ID Handler', () => {
	let tempProductId;

	before(async function() {
		this.timeout(5000);
		if(mongoose.connection.readyState === 0) {
			await mongoose.connect(process.env.MONGODB_URI, {
				dbName: process.env.MONGODB_COLLECTION_NAME
			});
		}
	});

	after(async () => {
		await mongoose.connection.close();
	});

	afterEach(() => {
		sinon.restore();
	});

	it('should delete a product successfully', async () => {
		const newProduct = await ProductModel.create({
			name: 'Hamburguesa',
			type: 'food',
			price: 9.99,
			ingredients: ['cheese', 'sauce', 'pepperoni']
		});

		tempProductId = newProduct._id.toString();

		const mockEvent = {
			pathParameters: {
				id: tempProductId
			}
		};

		const result = await handler(mockEvent);
		expect(result.statusCode).to.equal(200);

		const body = JSON.parse(result.body);
		expect(body).to.have.property('message', 'Product deleted successfully');
		expect(body.productDeleted._id).to.equal(tempProductId);

		const exists = await ProductModel.findById(tempProductId);
		expect(exists).to.be.null;
	});

	it('should return 404 if product does not exist', async () => {
		const nonExistentId = new ObjectId().toString();

		const mockEvent = {
			pathParameters: {
				id: nonExistentId
			}
		};

		const result = await handler(mockEvent);
		expect(result.statusCode).to.equal(404);

		const body = JSON.parse(result.body);
		expect(body).to.have.property('key', 'product_not_exists');
	});

	it('should return 500 if product ID is invalid (malformed)', async () => {
		const invalidId = 'invalid-object-id';

		const mockEvent = {
			pathParameters: {
				id: invalidId
			}
		};

		const result = await handler(mockEvent);
		expect(result.statusCode).to.equal(500);

		const body = JSON.parse(result.body);
		expect(body).to.have.property('key', 'internal_server_error');
		expect(body).to.have.property('details', 'hex string must be 24 characters');
	});
});
