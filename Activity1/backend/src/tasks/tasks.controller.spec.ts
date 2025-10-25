import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { Task, TaskPriority } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

describe('TasksController', () => {
  let controller: TasksController;
  let service: TasksService;

  const mockTasksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    findByDate: jest.fn(),
    findCompleted: jest.fn(),
    findActive: jest.fn(),
    findByPriority: jest.fn(),
    getStats: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    controller = module.get<TasksController>(TasksController);
    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a task', async () => {
    const createTaskDto: CreateTaskDto = {
      title: 'Test Task',
      description: 'Test Description',
      priority: TaskPriority.HIGH,
    };

    const expectedTask: Task = {
      id: 1,
      title: 'Test Task',
      description: 'Test Description',
      priority: TaskPriority.HIGH,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockTasksService.create.mockResolvedValue(expectedTask);

    const result = await controller.create(createTaskDto);
    expect(result).toEqual(expectedTask);
    expect(service.create).toHaveBeenCalledWith(createTaskDto);
  });

  it('should return all tasks', async () => {
    const expectedTasks: Task[] = [
      {
        id: 1,
        title: 'Task 1',
        description: 'Description 1',
        priority: TaskPriority.HIGH,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockTasksService.findAll.mockResolvedValue(expectedTasks);

    const result = await controller.findAll();
    expect(result).toEqual(expectedTasks);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return health check', () => {
    const result = controller.healthCheck();
    expect(result).toHaveProperty('status', 'ok');
    expect(result).toHaveProperty('service', 'Todo List API');
    expect(result).toHaveProperty('version', '1.0.0');
  });
});