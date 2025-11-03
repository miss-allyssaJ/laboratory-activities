import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { NotesService } from './notes.service';

@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get(':userId')
  getNotes(@Param('userId') userId: number) {
    return this.notesService.findAllForUser(userId);
  }

  @Post()
  createNote(@Body() body: any) {
    const { userId, title, content } = body;
    return this.notesService.createNote(userId, title, content);
  }

  @Delete(':id')
  deleteNote(@Param('id') id: number) {
    return this.notesService.deleteNote(id);
  }
}
