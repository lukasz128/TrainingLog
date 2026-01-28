import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

const db: LoginCredentials[] = [{ email: 'admin@admin', password: 'admin' }];

@Controller('auth')
export class AuthController {
  constructor(private readonly root: AuthService) {}

  @Post('/login')
  async login(@Body() loginCredentials: LoginCredentials) {
    return await this.root.login(loginCredentials);
  }

  @Post('/register')
  register(@Body() registerCredentials: RegisterCredentials) {
    return this.root.register(registerCredentials);
  }
}
