import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './book.entity';
import { Author } from '../authors/author.entity';
import { Category } from '../categories/category.entity';

@Injectable()
export class BooksService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepo: Repository<Book>,
    @InjectRepository(Author)
    private readonly authorRepo: Repository<Author>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  findAll() {
    return this.bookRepo.find({ relations: ['author', 'category'] });
  }

  async create(data: any, cover?: Express.Multer.File) {
    const { title, authorName, categoryName, yearPublished } = data;

    let author = await this.authorRepo.findOne({ where: { name: authorName } });
    if (!author) {
      author = this.authorRepo.create({ name: authorName });
      await this.authorRepo.save(author);
    }

    let category = await this.categoryRepo.findOne({ where: { name: categoryName } });
    if (!category) {
      category = this.categoryRepo.create({ name: categoryName });
      await this.categoryRepo.save(category);
    }

    const coverPath = cover ? `uploads/${cover.filename}` : null;

    const book = this.bookRepo.create({
      title,
      yearPublished,
      author,
      category,
      cover: coverPath,
    });

    return this.bookRepo.save(book);
  }

  findOne(id: number) {
    return this.bookRepo.findOne({ where: { id }, relations: ['author', 'category'] });
  }

  async update(id: number, data: any, cover?: Express.Multer.File) {
    const book = await this.findOne(id);
    if (!book) return null;

    if (cover) {
      book.cover = `uploads/${cover.filename}`;
    }
    if (data.authorName) {
      let author = await this.authorRepo.findOne({ where: { name: data.authorName } });
      if (!author) {
        author = this.authorRepo.create({ name: data.authorName });
        await this.authorRepo.save(author);
      }
      book.author = author;
    }

    // Handle category update if categoryName is provided
    if (data.categoryName) {
      let category = await this.categoryRepo.findOne({ where: { name: data.categoryName } });
      if (!category) {
        category = this.categoryRepo.create({ name: data.categoryName });
        await this.categoryRepo.save(category);
      }
      book.category = category;
    }

    if (data.title) book.title = data.title;
    if (data.yearPublished) book.yearPublished = data.yearPublished;

    return this.bookRepo.save(book);
  }

  remove(id: number) {
    return this.bookRepo.delete(id);
  }
}
