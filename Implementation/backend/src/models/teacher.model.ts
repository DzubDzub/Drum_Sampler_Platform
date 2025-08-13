import {Entity, model, property} from '@loopback/repository';

@model()
export class Teacher extends Entity {
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


  constructor(data?: Partial<Teacher>) {
    super(data);
  }
}

export interface TeacherRelations {
  // describe navigational properties here
}

export type TeacherWithRelations = Teacher & TeacherRelations;
