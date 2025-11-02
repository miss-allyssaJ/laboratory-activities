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
import { CategoriesService } from './categories.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('categories')
@Controller('categories')
export class CategoriesController {
  constructor(private svc: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category', description: 'Create a new category. The name must be unique.' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed or name already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  create(@Body() data: { name: string }) {
    return this.svc.create(data);
  }

  @Get()
  @ApiOperation({ summary: 'Get all categories', description: 'Retrieve a list of all categories' })
  @ApiResponse({ status: 200, description: 'List of categories retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  findAll() {
    return this.svc.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by ID', description: 'Retrieve a specific category by its ID, including books in this category' })
  @ApiParam({ name: 'id', type: 'integer', description: 'Category ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Category retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 400, description: 'Invalid ID format' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.svc.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a category', description: 'Update category information. The name must be unique if changed.' })
  @ApiParam({ name: 'id', type: 'integer', description: 'Category ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Category updated successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 400, description: 'Bad request - validation failed or name already exists' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  update(@Param('id', ParseIntPipe) id: number, @Body() data: { name?: string }) {
    return this.svc.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category', description: 'Delete a category by its ID. This will remove the category from the database.' })
  @ApiParam({ name: 'id', type: 'integer', description: 'Category ID', example: 1 })
  @ApiResponse({ status: 200, description: 'Category deleted successfully' })
  @ApiResponse({ status: 404, description: 'Category not found' })
  @ApiResponse({ status: 400, description: 'Invalid ID format' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.svc.remove(id);
  }
}
