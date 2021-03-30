import { BadRequestException, PipeTransform } from "@nestjs/common";
import { TaskStatus } from "../task-status.enum";
export class TaskStatusValidationPipe implements PipeTransform {
  readonly allowedStatuses = Object.keys(TaskStatus);
  transform(value: any) {
    if (!this.isStatusValid(value)) {
      throw new BadRequestException()
    }
    return value;
  }
  private isStatusValid(status: any) {
    return this.allowedStatuses.includes(status)
  }
}