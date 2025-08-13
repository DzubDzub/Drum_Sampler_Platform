import {Entity, model, property} from '@loopback/repository';

@model()
export class Achievement extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  ID?: number;

  @property({
    type: 'string',
    required: true,
  })
  Description: string;

  @property({
    type: 'string',
    required: true,
  })
  Name: string;


  constructor(data?: Partial<Achievement>) {
    super(data);
  }
}

export interface AchievementRelations {
  // describe navigational properties here
}

export type AchievementWithRelations = Achievement & AchievementRelations;
