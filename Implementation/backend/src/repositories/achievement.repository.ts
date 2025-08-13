import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Achievement, AchievementRelations} from '../models';

export class AchievementRepository extends DefaultCrudRepository<
  Achievement,
  typeof Achievement.prototype.ID,
  AchievementRelations
> {
  constructor(
    @inject('datasources.DB') dataSource: DbDataSource,
  ) {
    super(Achievement, dataSource);
  }
}
