'use strict';

require('dotenv').config();

const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const ProductModel = require('../models/product');
const { handler } = require('../getById');

describe('Get Product By ID Handler', () => {
	let existingProductId;

	before(async function() {
		this.timeout(5000);
		if(mongoose.connection.readyState === 0) {
			await mongoose.connect(process.env.MONGODB_URI, {
				dbName: process.env.MONGODB_COLLECTION_NAME
			});
		}

		const product = await ProductModel.findOne();

		if(product)
			existingProductId = product._id.toString();
		else {
			const newProduct = await ProductModel.create({
				name: 'Producto Test',
				description: 'Descripción de prueba',
				price: 12.99
			});
			existingProductId = newProduct._id.toString();
		}
	});

	after(async () => {
		await mongoose.connection.close();
	});

	afterEach(() => {
		sinon.restore();
	});

	it('should return an existing product by ID', async () => {
		const mockEvent = {
			pathParameters: {
				id: existingProductId
			}
		};

		const result = await handler(mockEvent);
		expect(result.statusCode).to.equal(200);

		const body = JSON.parse(result.body);
		expect(body).to.have.property('_id');
		expect(body._id).to.equal(existingProductId);
	});

	it('should return 404 for non-existing product', async () => {
		const fakeId = new ObjectId().toString();

		const mockEvent = {
			pathParameters: {
				id: fakeId
			}
		};

		const result = await handler(mockEvent);
		expect(result.statusCode).to.equal(404);

		const body = JSON.parse(result.body);
		expect(body).to.have.property('key', 'product_not_exists');
	});

	it('should ensure at least one product exists in the database', async () => {
		const count = await ProductModel.countDocuments();
		expect(count).to.be.at.least(1, 'Expected at least 1 product in the database');
	});
});
