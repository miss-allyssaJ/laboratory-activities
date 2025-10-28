import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async create(postId: number, createCommentDto: CreateCommentDto, userId: number): Promise<Comment> {
    const comment = this.commentsRepository.create({
      ...createCommentDto,
      postId,
      authorId: userId,
    });
    return this.commentsRepository.save(comment);
  }

  async findByPost(postId: number): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { postId },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({
      where: { id },
      relations: ['author', 'post'],
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async remove(id: number, userId: number): Promise<{ message: string }> {
    const comment = await this.findOne(id);

    if (comment.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await this.commentsRepository.remove(comment);
    return { message: 'Comment successfully deleted' };
  }
}
