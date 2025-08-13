import {
  belongsTo,
  Entity,
  hasMany,
  model,
  property,
} from '@loopback/repository';
import {Student} from './student.model';
import {Teacher} from './teacher.model';
import {Homework} from './homework.model';

@model()
export class Lesson extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
    jsonSchema: {
      readOnly: true,
    },
  })
  ID?: number;

  @property({
    type: 'date',
    required: true,
  })
  Date: string;

  @property({
    type: 'string',
    required: true,
  })
  Notes: string;

  @belongsTo(() => Student)
  studentId: string;

  @belongsTo(() => Teacher)
  teacherId: string;

  @hasMany(() => Homework)
  homeworks: Homework[];

  constructor(data?: Partial<Lesson>) {
    super(data);
  }
}

export interface LessonRelations {
  // describe navigational properties here
}

export type LessonWithRelations = Lesson & LessonRelations;
