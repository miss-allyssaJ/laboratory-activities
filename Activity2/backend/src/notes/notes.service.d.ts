import { Repository } from 'typeorm';
import { Note } from './notes.entity';
import { User } from '../user/user.entity';
export declare class NotesService {
    private notesRepository;
    constructor(notesRepository: Repository<Note>);
    findAll(user: User): Promise<Note[]>;
    create(text: string, user: User): Promise<Note>;
}
