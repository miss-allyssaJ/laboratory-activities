import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthorsService } from './authors.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('authors')
@Controller('authors')
export class AuthorsController {
  constructor(private svc: AuthorsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new author', description: 'Create a new author. The name must be unique.' })
  @ApiResponse({ status: 201, description: 'Author created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed or name already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  create(@Body() data: { name: string }) {
    return this.svc.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all authors', description: 'Retrieve a list of all authors' })
  @ApiResponse({ status: 200, description: 'List of authors retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an author by ID', description: 'Retrieve a specific author by its ID, including their books' })
  @ApiParam({ name: 'id', type: 'integer', description: 'Author ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Author retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Author not found' })
  @ApiResponse({ status: 400, description: 'Invalid ID format' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an author', description: 'Update author information. The name must be unique if changed.' })
  @ApiParam({ name: 'id', type: 'integer', description: 'Author ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Author updated successfully' })
  @ApiResponse({ status: 404, description: 'Author not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed or name already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  update(@Param('id', ParseIntPipe) id: number, @Body() data: { name?: string }) {
    return this.svc.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an author', description: 'Delete an author by its ID. This will remove the author from the database.' })
  @ApiParam({ name: 'id', type: 'integer', description: 'Author ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Author deleted successfully' })
  @ApiResponse({ status: 404, description: 'Author not found' })
  @ApiResponse({ status: 400, description: 'Invalid ID format' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }
}
