import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginCredentials, RegisterCredentials } from './auth.types';

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
