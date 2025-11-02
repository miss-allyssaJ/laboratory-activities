import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@ApiTags('books')
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  @ApiOperation({ summary: 'Get all books', description: 'Retrieve a list of all books with their author and category information' })
  @ApiResponse({ status: 200, description: 'List of books retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  findAll() {
    return this.booksService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new book', description: 'Create a new book with optional cover image upload. Author and category will be created if they do not exist.' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'Harry Potter and the Philosopher\'s Stone',
          description: 'Title of the book',
        },
        authorName: {
          type: 'string',
          example: 'J.K. Rowling',
          description: 'Name of the author',
        },
        categoryName: {
          type: 'string',
          example: 'Fantasy',
          description: 'Name of the category',
        },
        yearPublished: {
          type: 'integer',
          example: 1997,
          description: 'Year the book was published',
        },
        cover: {
          type: 'string',
          format: 'binary',
          description: 'Book cover image file (optional)',
        },
      },
      required: ['title', 'authorName', 'categoryName', 'yearPublished'],
    },
  })
  @ApiResponse({ status: 201, description: 'Book created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  create(@Body() body: CreateBookDto, @UploadedFile() cover?: Express.Multer.File) {
    return this.booksService.create(body, cover);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a book by ID', description: 'Retrieve a specific book by its ID' })
  @ApiParam({ name: 'id', type: 'integer', description: 'Book ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Book retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  @ApiResponse({ status: 400, description: 'Invalid ID format' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a book', description: 'Update book information and optionally replace the cover image. All fields are optional.' })
  @ApiParam({ name: 'id', type: 'integer', description: 'Book ID', example: 1 })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          example: 'Harry Potter and the Philosopher\'s Stone',
          description: 'Title of the book',
        },
        authorName: {
          type: 'string',
          example: 'J.K. Rowling',
          description: 'Name of the author',
        },
        categoryName: {
          type: 'string',
          example: 'Fantasy',
          description: 'Name of the category',
        },
        yearPublished: {
          type: 'integer',
          example: 1997,
          description: 'Year the book was published',
        },
        cover: {
          type: 'string',
          format: 'binary',
          description: 'Book cover image file (optional)',
        },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Book updated successfully' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @UseInterceptors(
    FileInterceptor('cover', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateBookDto,
    @UploadedFile() cover?: Express.Multer.File,
  ) {
    return this.booksService.update(id, body, cover);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a book', description: 'Delete a book by its ID. This will remove the book from the database.' })
  @ApiParam({ name: 'id', type: 'integer', description: 'Book ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Book deleted successfully' })
  @ApiResponse({ status: 404, description: 'Book not found' })
  @ApiResponse({ status: 400, description: 'Invalid ID format' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.booksService.remove(id);
  }
}
