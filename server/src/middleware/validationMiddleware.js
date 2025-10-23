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
        // Safely access errors array with fallback
        const formattedErrors = (error.errors || []).map((err) => ({
          field: err.path?.join('.') || 'unknown',
          message: err.message || 'Validation error',
        }));

        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: formattedErrors,
        });
      }

      // Handle other errors
      console.error('Validation middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during validation',
      });
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
        const formattedErrors = (error.errors || []).map((err) => ({
          field: err.path?.join('.') || 'unknown',
          message: err.message || 'Validation error',
        }));

        return res.status(400).json({
          success: false,
          message: 'Invalid query parameters',
          errors: formattedErrors,
        });
      }

      console.error('Query validation error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during query validation',
      });
    }
  };
};

// Params validation (for route parameters like /users/:id)
export const validateParams = (schema) => {
  return async (req, res, next) => {
    try {
      const validated = await schema.parseAsync(req.params);
      req.params = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = (error.errors || []).map((err) => ({
          field: err.path?.join('.') || 'unknown',
          message: err.message || 'Validation error',
        }));

        return res.status(400).json({
          success: false,
          message: 'Invalid URL parameters',
          errors: formattedErrors,
        });
      }

      console.error('Params validation error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during params validation',
      });
    }
  };
};
