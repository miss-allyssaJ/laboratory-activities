import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    create(email: string, username: string, password: string): Promise<User>;
    findOne(id: number): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    validatePassword(password: string, hashedPassword: string): Promise<boolean>;
}
