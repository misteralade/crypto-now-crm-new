import { type ZodSchema } from 'zod';

/**
 * Custom Zod to Formik validation adapter
 * Converts Zod validation errors to Formik error format
 */
export const zodToFormikValidation = <T>(schema: ZodSchema<T>) => {
  return (values: T) => {
    const result = schema.safeParse(values);
    
    if (result.success) {
      return {};
    }
    
    const errors: Record<string, string> = {};
    
    result.error.issues.forEach((issue) => {
      const path = issue.path.join('.');
      if (path) {
        errors[path] = issue.message;
      }
    });
    
    return errors;
  };
};

