import { IsString, IsInt, IsOptional, MinLength, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateBookDto {
  @ApiProperty({
    description: 'Title of the book',
    example: 'Harry Potter and the Philosopher\'s Stone',
    minLength: 1,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  title?: string;

  @ApiProperty({
    description: 'Name of the author (will be created if not exists)',
    example: 'J.K. Rowling',
    minLength: 1,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  authorName?: string;

  @ApiProperty({
    description: 'Name of the category (will be created if not exists)',
    example: 'Fantasy',
    minLength: 1,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(1)
  categoryName?: string;

  @ApiProperty({
    description: 'Year the book was published',
    example: 1997,
    minimum: 1000,
    maximum: 2100,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1000)
  @Max(2100)
  yearPublished?: number;
}
