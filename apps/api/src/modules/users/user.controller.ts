import { Response } from 'express';
import { AuthenticatedRequest } from '../../middleware/auth.middleware.js';
import { UserService } from './user.service.js';
import { createUserSchema } from '../../validators/user.validator.js';

export class UserController {
  static async list(req: AuthenticatedRequest, res: Response) {
    try {
      // tenantId is guaranteed by tenantMiddleware
      const users = await UserService.listUsers(req.tenantId as string);
      
      return res.status(200).json({ success: true, data: users });
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Failed to retrieve users' });
    }
  }

  static async create(req: AuthenticatedRequest, res: Response) {
    try {
      const validatedData = createUserSchema.parse(req.body);
      const newUser = await UserService.createUser(req.tenantId as string, validatedData);

      return res.status(201).json({ success: true, data: newUser });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ success: false, message: 'Validation failed', errors: error.errors });
      }
      if (error.message === 'EMAIL_IN_USE') {
        return res.status(409).json({ success: false, message: 'Email already exists' });
      }
      return res.status(500).json({ success: false, message: 'Failed to create user' });
    }
  }
}