'use strict';

class ApiResponse {
	constructor(statusCode, errorDetails) {
		this.defaultHeaders = {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': '*'
		};
		if(statusCode !== undefined) {
			this.statusCode = statusCode;
			this.errorDetails = errorDetails;
		}
	}

	/**
   * Crea una respuesta exitosa
   * @param {object} body - Cuerpo de la respuesta
   * @param {number} [statusCode=200] - Código de estado HTTP
   * @param {object} [headers] - Encabezados adicionales
   * @returns {object} Respuesta estructurada
   */
	success(statusCode = 200, body, headers = {}) {
		if(!body)
			throw new Error('The response body is required');

		return {
			statusCode,
			headers: { ...this.defaultHeaders, ...headers },
			body: JSON.stringify(body)
		};
	}

	/**
   * Crea una respuesta de error
   * @param {string|object} error - Mensaje u objeto de error
   * @param {number} [statusCode=500] - Código de estado HTTP
   * @param {object} [headers] - Encabezados adicionales
   * @returns {object} Respuesta de error estructurada
   */
	error(statusCode = 500, error, headers = {}) {
		if(!error)
			throw new Error('The error message is required');

		const errorBody = typeof error === 'string' ? { error } : { ...error, details: process.env.NODE_ENV === 'development' ? error.details : undefined };

		return {
			statusCode,
			headers: { ...this.defaultHeaders, ...headers },
			body: JSON.stringify(errorBody)
		};
	}

	toResponse() {
		return {
			statusCode: this.statusCode,
			body: JSON.stringify(this.errorDetails)
		};
	}
}

module.exports = ApiResponse;
