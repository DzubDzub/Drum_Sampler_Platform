import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {StudentsAchievements, StudentsAchievementsRelations} from '../models';

export class StudentsAchievementsRepository extends DefaultCrudRepository<
  StudentsAchievements,
  typeof StudentsAchievements.prototype.ID,
  StudentsAchievementsRelations
> {
  constructor(
    @inject('datasources.DB') dataSource: DbDataSource,
  ) {
    super(StudentsAchievements, dataSource);
  }
}
