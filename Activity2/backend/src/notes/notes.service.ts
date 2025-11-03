import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Note } from './notes.entity';
import { User } from '../user/user.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private notesRepo: Repository<Note>,
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async findAllForUser(userId: number) {
    return this.notesRepo.find({ where: { user: { id: userId } } });
  }

  async createNote(userId: number, title: string, content: string) {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    const note = this.notesRepo.create({ title, content, user });
    return this.notesRepo.save(note);
  }

  async deleteNote(id: number) {
    const note = await this.notesRepo.findOne({ where: { id } });
    if (!note) throw new NotFoundException('Note not found');
    await this.notesRepo.remove(note);
    return { message: 'Note deleted successfully' };
  }
}
