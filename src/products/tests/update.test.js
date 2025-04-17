'use strict';

require('dotenv').config();

const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const ProductModel = require('../models/product');
const { handler } = require('../update');

describe('Update Product By ID Handler', () => {
	let existingProduct;

	before(async function() {
		this.timeout(5000);
		if(mongoose.connection.readyState === 0) {
			await mongoose.connect(process.env.MONGODB_URI, {
				dbName: process.env.MONGODB_COLLECTION_NAME
			});
		}

		existingProduct = await ProductModel.create({
			name: 'Producto test update',
			type: 'food',
			price: 9.99,
			ingredients: ['cheese', 'sauce', 'pepperoni']
		});
	});

	after(async () => {
		await mongoose.connection.close();
	});

	afterEach(() => {
		sinon.restore();
	});

	it('should ensure there are products available for testing', async () => {
		const count = await ProductModel.countDocuments();
		expect(count).to.be.at.least(1, 'Expected at least one product in the database');
	});

	it('should update the name of a product', async () => {
		const mockEvent = {
			httpMethod: 'PUT',
			pathParameters: {
				id: existingProduct._id.toString()
			},
			body: JSON.stringify({
				name: 'Nombre actualizado'
			})
		};

		const result = await handler(mockEvent);
		expect(result.statusCode).to.equal(201);

		const body = JSON.parse(result.body);
		expect(body.message).to.equal('Product updated successfully');

		const updated = await ProductModel.findById(existingProduct._id);
		expect(updated.name).to.equal('Nombre actualizado');
	});

	it('should throw a validation error when type is missing enum', async () => {
		const mockEvent = {
			httpMethod: 'PUT',
			pathParameters: {
				id: existingProduct._id.toString()
			},
			body: JSON.stringify({
				type: 'INVALID_TYPE'
			})
		};

		try {
			await handler(mockEvent);
		} catch(err) {
			const response = err.toResponse();
			const parsedBody = JSON.parse(response.body);

			expect(response.statusCode).to.equal(400);
			expect(parsedBody).to.have.property('key', 'validation_error');
			expect(parsedBody.errors).to.be.an('array');
			expect(parsedBody.errors[0]).to.have.property('field', 'type');
			expect(parsedBody.errors[0].message).to.include('Invalid enum value. Expected');
		}
	});

	it('should return 404 if product does not exist', async () => {
		const fakeId = new ObjectId().toString();

		const mockEvent = {
			httpMethod: 'PUT',
			pathParameters: {
				id: fakeId
			},
			body: JSON.stringify({
				name: 'No importa'
			})
		};

		const result = await handler(mockEvent);
		expect(result.statusCode).to.equal(404);

		const body = JSON.parse(result.body);
		expect(body).to.have.property('key', 'product_not_exists');
	});
});
