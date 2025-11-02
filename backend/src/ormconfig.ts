import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Book } from './books/book.entity';
import { Author } from './authors/author.entity';
import { Category } from './categories/category.entity';
import { User } from './users/users.entity';

const config: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'bookshelf_db',
  entities: [Book, Author, Category, User],
  synchronize: true,
};

export default config;
