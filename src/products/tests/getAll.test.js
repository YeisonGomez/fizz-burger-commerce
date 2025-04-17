'use strict';

require('dotenv').config();

const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const ProductModel = require('../models/product');
const { handler } = require('../getAll');

describe('Get All Products Handler', async () => {
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

	afterEach(async () => {
		sinon.restore();
	});

	it("should have at least two products with name containing 'Hamburguesa' and different price ranges", async () => {
		const products = await ProductModel.find({
			name: { $regex: 'Hamburguesa', $options: 'i' }
		}).lean();

		const count = products.length;
		expect(count).to.be.at.least(1, `Expected at least 1 product with 'Hamburguesa' in the name, but found ${count}`);

		const hasInRange = products.some(p => p.price >= 10 && p.price <= 15);
		const hasGreater = products.some(p => p.price > 15);

		expect(hasInRange, 'Expected at least one product with price between 10 and 15').to.be.true;
		expect(hasGreater, 'Expected at least one product with price greater than 15').to.be.true;
	});

	it('should return products that partially match the name', async () => {
		const mockEvent = {
			queryStringParameters: {
				name: 'ham',
				orderBy: 'name',
				orderDirection: 'asc'
			}
		};

		const result = await handler(mockEvent);
		expect(result.statusCode).to.equal(200);
		const body = JSON.parse(result.body);
		expect(body).to.be.an('array');
		expect(body[0].name.toLowerCase()).to.include('ham');
	});

	it('should return products within priceFrom and priceTo', async () => {
		const mockEvent = {
			queryStringParameters: {
				priceFrom: '10',
				priceTo: '15',
				orderBy: 'price',
				orderDirection: 'asc'
			}
		};

		const result = await handler(mockEvent);
		expect(result.statusCode).to.equal(200);
		const body = JSON.parse(result.body);
		expect(body).to.be.an('array');
		body.forEach(product => {
			expect(product.price).to.be.at.least(10);
			expect(product.price).to.be.at.most(15);
		});
	});

	it('should return an empty array when no products match', async () => {
		sinon.stub(ProductModel, 'find').returns({
			sort: sinon.stub().returns({
				lean: sinon.stub().resolves([])
			})
		});

		const mockEvent = {
			queryStringParameters: {
				name: 'nonexistent',
				orderBy: 'name',
				orderDirection: 'asc'
			}
		};

		const result = await handler(mockEvent);
		expect(result.statusCode).to.equal(200);
		const body = JSON.parse(result.body);
		expect(body).to.be.an('array').that.is.empty;
	});
});
