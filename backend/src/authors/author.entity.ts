import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Book } from './../books/book.entity';

@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => Book, (book: Book) => book.author)
  books: Book[];
}
