'use strict';

const { ObjectId } = require('mongodb');

const { connectToDatabase } = require('../@common/mongoDB/database');
const ApiResponse = require('../@utils/ApiResponse');
const { BaseDto } = require('../@utils/BaseDto');
const ProductModel = require('./models/product');
const { UpdateSchema } = require('./dto/update.schema');

const apiResponse = new ApiResponse();

module.exports.handler = async event => {
	try {
		if(['PUT'].includes(event.httpMethod)) {
			const productId = ObjectId.createFromHexString(event.pathParameters.id);
			await connectToDatabase();

			const product = await ProductModel.findOne({ _id: productId });

			if(!product) {
				return apiResponse.error(404, {
					key: 'product_not_exists',
					message: 'Product not found'
				});
			}

			const body = JSON.parse(event.body || '{}');
			const productData = new BaseDto(UpdateSchema, body).validate();

			await ProductModel.updateOne(
				{ _id: productId },
				{
					$set: productData,
					$currentDate: { updatedAt: true }
				}
			);

			return apiResponse.success(201, {
				message: 'Product updated successfully',
				productUpdated: product._id
			});
		}
	} catch(error) {
		if(error instanceof ApiResponse)
			return error.toResponse();

		return apiResponse.error(500, {
			key: 'internal_server_error',
			message: 'Internal server error',
			details: error
		});
	}
};
