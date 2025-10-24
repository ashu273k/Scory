import { ZodError } from 'zod';

// Generic validation middleware for any Zod schema
export const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.body);
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
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

      console.error('Validation middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Internal server error during validation',
      });
    }
  };
};

// Query parameter validation - FIXED: Don't try to assign to req.query
export const validateQuery = (schema) => {
  return (req, res, next) => {
    // If no schema provided, just continue
    if (!schema) {
      return next();
    }

    try {
      // Validate the query parameters
      const validated = schema.parse(req.query);
      // Store in a new non-readonly property
      req.validatedQuery = validated;
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

// Params validation
export const validateParams = (schema) => {
  return (req, res, next) => {
    if (!schema) {
      return next();
    }

    try {
      const validated = schema.parse(req.params);
      req.validatedParams = validated;
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