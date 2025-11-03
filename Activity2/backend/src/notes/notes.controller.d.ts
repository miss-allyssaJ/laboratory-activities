import { NotesService } from './notes.service';
export declare class NotesController {
    private readonly notesService;
    constructor(notesService: NotesService);
    getNotes(req: any): Promise<import("./notes.entity").Note[]>;
    addNote(text: string, req: any): Promise<import("./notes.entity").Note>;
}
