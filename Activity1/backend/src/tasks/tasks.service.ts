import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task, TaskPriority } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private tasksRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    try {
      const task = this.tasksRepository.create(createTaskDto);
      return await this.tasksRepository.save(task);
    } catch (error) {
      throw new BadRequestException('Failed to create task: ' + error.message);
    }
  }

  async findAll(): Promise<Task[]> {
    return await this.tasksRepository.find({
      order: { createdAt: 'DESC' }
    });
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.tasksRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    try {
      const task = await this.findOne(id);
      Object.assign(task, updateTaskDto);
      return await this.tasksRepository.save(task);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to update task: ' + error.message);
    }
  }

  async remove(id: number): Promise<void> {
    try {
      const task = await this.findOne(id);
      await this.tasksRepository.remove(task);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Failed to delete task: ' + error.message);
    }
  }

  async findByDate(date: string): Promise<Task[]> {
    // Validate date format
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new BadRequestException('Invalid date format. Use YYYY-MM-DD');
    }
    
    return await this.tasksRepository.find({
      where: { date },
      order: { time: 'ASC' }
    });
  }

  async findCompleted(): Promise<Task[]> {
    return await this.tasksRepository.find({
      where: { completed: true },
      order: { updatedAt: 'DESC' }
    });
  }

  async findActive(): Promise<Task[]> {
    return await this.tasksRepository.find({
      where: { completed: false },
      order: { priority: 'DESC', createdAt: 'ASC' }
    });
  }

  async findByPriority(priority: string): Promise<Task[]> {
    // Validate priority value
    if (!Object.values(TaskPriority).includes(priority as TaskPriority)) {
      throw new NotFoundException(`Invalid priority: ${priority}`);
    }
    
    return await this.tasksRepository.find({
      where: { priority: priority as TaskPriority },
      order: { createdAt: 'DESC' }
    });
  }

  async getStats(): Promise<{ total: number; completed: number; active: number; completionRate: number }> {
    const total = await this.tasksRepository.count();
    const completed = await this.tasksRepository.count({ where: { completed: true } });
    const active = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, completed, active, completionRate };
  }
}