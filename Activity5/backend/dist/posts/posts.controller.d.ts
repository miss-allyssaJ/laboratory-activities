import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    create(createPostDto: CreatePostDto, req: any): Promise<import("./entities/post.entity").Post>;
    findAll(page?: string, limit?: string): Promise<{
        data: import("./entities/post.entity").Post[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: number): Promise<import("./entities/post.entity").Post>;
    update(id: number, updatePostDto: UpdatePostDto, req: any): Promise<import("./entities/post.entity").Post>;
    remove(id: number, req: any): Promise<{
        message: string;
    }>;
}
