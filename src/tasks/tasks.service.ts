import { Injectable, NotFoundException } from '@nestjs/common';
import {  TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { User } from 'src/auth/user.entity';


@Injectable()
export class TasksService {
  constructor(@InjectRepository(TaskRepository)
    private taskRepository: TaskRepository) {
  }
  async getTasks(filterDto: GetTasksFilterDto, user: User):Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }



  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({ where: { id, userId: user.id } });
    if (!found) {
      throw new NotFoundException(`Task with id ${id} not found`)
    }
    return found
  }

  async createTask(createTaskDto: CreateTaskDto, user:User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: number, user: User):Promise<void> {
    const result = await this.taskRepository.delete({userId: user.id, id});
    if (result.affected === 0) {
      throw new NotFoundException(`Task with id ${id} not found`)
    }

  }

  async updateTaskStatus(id: number, status: TaskStatus, user: User): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();
    return task;
  }
}
