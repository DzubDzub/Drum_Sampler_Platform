import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Teacher} from './teacher.model';

@model()
export class Student extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: false,
    required: true,
  })
  username: string;

  @property({
    type: 'string',
    required: true,
  })
  password: string;

  @property({
    type: 'string',
    required: true,
  })
  firstName: string;

  @property({
    type: 'string',
    required: true,
  })
  lastName: string;

  @property({
    type: 'date',
    required: true,
  })
  birthDate: string;

  @property({
    type: 'string',
    required: true,
  })
  courseType: string;

  @property({
    type: 'boolean',
    required: true,
  })
  isCurrentlyEnrolled: boolean;

  @belongsTo(() => Teacher)
  teacherId: string;

  constructor(data?: Partial<Student>) {
    super(data);
  }
}

export interface StudentRelations {
  // describe navigational properties here
}

export type StudentWithRelations = Student & StudentRelations;
