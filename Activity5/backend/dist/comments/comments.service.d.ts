import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class CommentsService {
    private commentsRepository;
    constructor(commentsRepository: Repository<Comment>);
    create(postId: number, createCommentDto: CreateCommentDto, userId: number): Promise<Comment>;
    findByPost(postId: number): Promise<Comment[]>;
    findOne(id: number): Promise<Comment>;
    remove(id: number, userId: number): Promise<{
        message: string;
    }>;
}
