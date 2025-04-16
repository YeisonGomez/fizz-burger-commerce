const ApiResponse = require("./ApiResponse");

class BaseDto {
  constructor(schema, data) {
    this.schema = schema;
    this.data = data;
  }

  validate() {
    const result = this.schema.safeParse(this.data);
    
    if (!result.success) {
      const errors = result.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      
      throw new ApiResponse(400, {
        key: "validation_error",
        message: "Validation error in product data",
        errors
      });
    }
    
    return result.data;
  }
}

module.exports.BaseDto = BaseDto;