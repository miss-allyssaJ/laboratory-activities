import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async createUser(username: string, password: string, role = 'user'): Promise<User> {
    const hashed = await bcrypt.hash(password, 10);
    const newUser = this.usersRepository.create({ username, password: hashed, role });
    return this.usersRepository.save(newUser);
  }
}
