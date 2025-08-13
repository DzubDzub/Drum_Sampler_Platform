import {Entity, model, property} from '@loopback/repository';

@model()
export class StudentsAchievements extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: true,
  })
  ID?: number;

  @property({
    type: 'date',
    required: true,
  })
  awardedAt: string;


  constructor(data?: Partial<StudentsAchievements>) {
    super(data);
  }
}

export interface StudentsAchievementsRelations {
  // describe navigational properties here
}

export type StudentsAchievementsWithRelations = StudentsAchievements & StudentsAchievementsRelations;
