import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
export declare class PostsService {
    private postsRepository;
    constructor(postsRepository: Repository<Post>);
    create(createPostDto: CreatePostDto, userId: number): Promise<Post>;
    findAll(page?: number, limit?: number): Promise<{
        data: Post[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: number): Promise<Post>;
    update(id: number, updatePostDto: UpdatePostDto, userId: number): Promise<Post>;
    remove(id: number, userId: number): Promise<{
        message: string;
    }>;
}
