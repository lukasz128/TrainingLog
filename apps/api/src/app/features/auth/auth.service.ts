import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginCredentials, RegisterCredentials } from './auth.controller';
import { User } from './auth.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login({ email, password }: LoginCredentials) {
    const findUser = await this.usersRepository.findOne({
      where: { email, password },
    });
    if (findUser === null)
      throw new HttpException('NotFound', HttpStatus.NOT_FOUND);

    const payload = { sub: findUser.id, username: findUser.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register({ email, password }: RegisterCredentials) {
    const user = this.usersRepository.create({ email, password });

    await this.usersRepository.save(user);
  }
}
