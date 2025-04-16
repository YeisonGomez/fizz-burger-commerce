'use strict';

require('dotenv').config();

const { expect } = require('chai');
const sinon = require('sinon');

const db = require('../../@common/mongoDB/database');
const { BaseDto } = require('../../@utils/BaseDto');
const ApiResponse = require('../../@utils/ApiResponse');
const { CreateSchema } = require('../dto/create.schema');
const { handler } = require('../create');

describe('Product Create Handler', () => {
	beforeEach(() => {
		sinon.stub(db, 'connectToDatabase').resolves();
	});

	afterEach(() => {
		sinon.restore();
	});

	it('should return 201 when product is created successfully', async () => {
		const mockEvent = {
			httpMethod: 'POST',
			body: JSON.stringify({
				name: 'Hamburguesa',
				type: 'food',
				price: 9.99,
				ingredients: ['cheese', 'sauce', 'pepperoni']
			})
		};

		const result = await handler(mockEvent);
		expect(result.statusCode).to.equal(201);
		const body = JSON.parse(result.body);
		expect(body.message).to.equal('Product created successfully');
		expect(body.newProductId).to.exist;
	});

	it('should throw a validation error when name is missing', () => {
		const invalidData = {
			type: 'food',
			price: 9.99,
			ingredients: ['cheese', 'sauce']
		};

		try {
			new BaseDto(CreateSchema, invalidData).validate();
			throw new Error('Validation should have failed but passed');
		} catch(err) {
			expect(err).to.be.instanceOf(ApiResponse);
			const response = err.toResponse();
			const parsedBody = JSON.parse(response.body);

			expect(response.statusCode).to.equal(400);
			expect(parsedBody).to.have.property('key', 'validation_error');
			expect(parsedBody.errors).to.be.an('array');
			expect(parsedBody.errors[0]).to.have.property('field', 'name');
			expect(parsedBody.errors[0]).to.have.property('message', 'Name is required');
		}
	});

	it('should throw a validation error when type is missing enum', () => {
		const invalidData = {
			name: 'Hamburguesa',
			type: 'fooderror',
			price: 9.99,
			ingredients: ['cheese', 'sauce']
		};

		try {
			new BaseDto(CreateSchema, invalidData).validate();
			throw new Error('Validation should have failed but passed');
		} catch(err) {
			expect(err).to.be.instanceOf(ApiResponse);
			const response = err.toResponse();
			const parsedBody = JSON.parse(response.body);

			expect(response.statusCode).to.equal(400);
			expect(parsedBody).to.have.property('key', 'validation_error');
			expect(parsedBody.errors).to.be.an('array');
			expect(parsedBody.errors[0]).to.have.property('field', 'type');
			expect(parsedBody.errors[0].message).to.include('Invalid enum value. Expected');
		}
	});
});
