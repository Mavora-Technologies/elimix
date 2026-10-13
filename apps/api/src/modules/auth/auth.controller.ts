// apps/api/src/modules/auth/auth.controller.ts
import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { loginSchema, registerSchema } from '../../validators/auth.validator.js';

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await AuthService.login(validatedData);

      return res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          errors: error.errors,
        });
      }

      if (error.message === 'INVALID_CREDENTIALS') {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password',
          code: 'INVALID_CREDENTIALS',
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Internal server error',
        code: 'INTERNAL_ERROR',
      });
    }
  }

  static async register(req: Request, res: Response) {
    try {
      const validatedData = registerSchema.parse(req.body);
      const result = await AuthService.register(validatedData);

      return res.status(201).json({
        success: true,
        message: 'Institution provisioned successfully',
        data: result,
      });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          errors: error.errors,
        });
      }

      if (error.message === 'EMAIL_ALREADY_EXISTS') {
        return res.status(409).json({
          success: false,
          message: 'An account with this email already exists.',
          code: 'EMAIL_ALREADY_EXISTS',
        });
      }

      return res.status(500).json({
        success: false,
        message: 'Internal server error during registration',
        code: 'INTERNAL_ERROR',
      });
    }
  }
}