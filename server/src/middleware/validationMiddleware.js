import { ZodError } from 'zod';

// Generic validation middleware for any Zod schema
export const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      // Parse and validate request body
      const validated = await schema.parseAsync(req.body);
      
      // Replace req.body with validated data
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: formattedErrors,
        });
      }

      // Handle other errors
      next(error);
    }
  };
};

// Query parameter validation
export const validateQuery = (schema) => {
  return async (req, res, next) => {
    try {
      const validated = await schema.parseAsync(req.query);
      req.query = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Invalid query parameters',
          errors: error.errors,
        });
      }
      next(error);
    }
  };
};
