import { z } from 'zod';

// Message validation schema
export const messageSchema = z.string()
  .min(1, "Message is required")
  .max(2000, "Message must be less than 2000 characters")
  .refine(
    (val) => !/<script[^>]*>.*?<\/script>/gi.test(val),
    "Script tags are not allowed"
  )
  .refine(
    (val) => !/<iframe[^>]*>.*?<\/iframe>/gi.test(val),
    "Iframe tags are not allowed"
  )
  .refine(
    (val) => !/javascript:/gi.test(val),
    "JavaScript URLs are not allowed"
  )
  .refine(
    (val) => !/on\w+\s*=/gi.test(val),
    "Event handlers are not allowed"
  );

// Name validation schema
export const nameSchema = z.string()
  .min(1, "Name is required")
  .max(100, "Name must be less than 100 characters")
  .regex(/^[a-zA-Z0-9\s\-_.,!?]+$/, "Name contains invalid characters")
  .refine(
    (val) => !/<[^>]*>/g.test(val),
    "HTML tags are not allowed in names"
  );

// Email validation schema
export const emailSchema = z.string()
  .email("Invalid email format")
  .max(254, "Email too long");

// Password validation schema
export const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .regex(/^[a-zA-Z0-9]+$/, "Password can only contain letters and numbers")
  .regex(/[A-Za-z]/, "Password must contain at least one letter")
  .regex(/\d/, "Password must contain at least one number");

// Slug validation schema
export const slugSchema = z.string()
  .min(1, "Slug is required")
  .max(50, "Slug too long")
  .regex(/^[a-zA-Z0-9\-_]+$/, "Slug can only contain letters, numbers, hyphens, and underscores");

// Sanitization functions
export const sanitizeText = (input: string): string => {
  return input
    .trim()
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export const sanitizeMessage = (input: string): string => {
  // More lenient sanitization for messages but still secure
  return input
    .trim()
    .replace(/<script[^>]*>.*?<\/script>/gi, '[Script removed]')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '[Iframe removed]')
    .replace(/javascript:/gi, '[JavaScript removed]')
    .replace(/on\w+\s*=/gi, '[Event handler removed]');
};

// Validation helper functions
export const validateMessage = (input: string) => {
  try {
    return {
      isValid: true,
      data: messageSchema.parse(input.trim()),
      errors: []
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        data: null,
        errors: error.errors.map(e => e.message)
      };
    }
    return {
      isValid: false,
      data: null,
      errors: ['Validation failed']
    };
  }
};

export const validateName = (input: string) => {
  try {
    return {
      isValid: true,
      data: nameSchema.parse(input.trim()),
      errors: []
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        data: null,
        errors: error.errors.map(e => e.message)
      };
    }
    return {
      isValid: false,
      data: null,
      errors: ['Validation failed']
    };
  }
};

export const validateEmail = (input: string) => {
  try {
    return {
      isValid: true,
      data: emailSchema.parse(input.trim()),
      errors: []
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        data: null,
        errors: error.errors.map(e => e.message)
      };
    }
    return {
      isValid: false,
      data: null,
      errors: ['Validation failed']
    };
  }
};

export const validatePassword = (input: string) => {
  try {
    return {
      isValid: true,
      data: passwordSchema.parse(input),
      errors: []
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        data: null,
        errors: error.errors.map(e => e.message)
      };
    }
    return {
      isValid: false,
      data: null,
      errors: ['Validation failed']
    };
  }
}; 
