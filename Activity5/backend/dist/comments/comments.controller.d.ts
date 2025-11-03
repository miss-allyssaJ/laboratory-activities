import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class CommentsController {
    private readonly commentsService;
    constructor(commentsService: CommentsService);
    create(postId: number, createCommentDto: CreateCommentDto, req: any): Promise<import("./entities/comment.entity").Comment>;
    findByPost(postId: number): Promise<import("./entities/comment.entity").Comment[]>;
    remove(id: number, req: any): Promise<{
        message: string;
    }>;
}
