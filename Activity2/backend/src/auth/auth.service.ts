import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async register(username: string, password: string) {
    const existing = await this.usersRepo.findOne({ where: { username } });
    if (existing) throw new BadRequestException('Username already taken');

    const user = this.usersRepo.create({ username, password });
    await this.usersRepo.save(user);

    const { password: _, ...safe } = user as any;
    return { message: 'Registration successful', user: safe };
  }

  async login(username: string, password: string) {
    const user = await this.usersRepo.findOne({ where: { username } });
    if (!user || user.password !== password) {
      throw new BadRequestException('Invalid credentials');
    }
    const { password: _, ...safe } = user as any;
    return { message: 'Login successful', user: safe };
  }
}
