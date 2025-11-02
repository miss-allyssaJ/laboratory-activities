import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Author } from './author.entity';

@Injectable()
export class AuthorsService {
  constructor(@InjectRepository(Author) private repo: Repository<Author>) {}

  create(data: Partial<Author>) {
    const author = this.repo.create(data);
    return this.repo.save(author);
  }

  findAll() {
    return this.repo.find();
  }

  async findOne(id: number) {
    const author = await this.repo.findOne({ where: { id }, relations: ['books'] });
    if (!author) throw new NotFoundException('Author not found');
    return author;
  }

  async update(id: number, data: Partial<Author>) {
    const author = await this.findOne(id);
    Object.assign(author, data);
    return this.repo.save(author);
  }

  async remove(id: number) {
    const author = await this.findOne(id);
    return this.repo.remove(author);
  }
}
