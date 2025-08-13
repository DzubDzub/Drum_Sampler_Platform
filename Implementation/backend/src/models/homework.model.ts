import {belongsTo, Entity, model, property} from '@loopback/repository';
import {Lesson} from './lesson.model';

@model()
export class Homework extends Entity {
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
    type: 'string',
    required: true,
  })
  Description: string;

  @property({
    type: 'boolean',
    required: true,
  })
  isSubmittable: boolean;

  @belongsTo(() => Lesson)
  lessonId: number;

  constructor(data?: Partial<Homework>) {
    super(data);
  }
}

export interface HomeworkRelations {
  // describe navigational properties here
}

export type HomeworkWithRelations = Homework & HomeworkRelations;
