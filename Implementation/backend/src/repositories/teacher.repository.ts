import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Teacher, TeacherRelations} from '../models';

export class TeacherRepository extends DefaultCrudRepository<
  Teacher,
  typeof Teacher.prototype.username,
  TeacherRelations
> {
  constructor(@inject('datasources.DB') dataSource: DbDataSource) {
    super(Teacher, dataSource);
  }
}
