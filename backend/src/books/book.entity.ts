import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Author } from './../authors/author.entity';
import { Category } from './../categories/category.entity';

@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => Author, (author) => author.books, { cascade: true, eager: true })
  @JoinColumn({ name: 'author_id' })
  author: Author;

  @ManyToOne(() => Category, (category) => category.books, { cascade: true, eager: true })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  yearPublished: number;

  @Column({ nullable: true })
  cover: string; 
}
