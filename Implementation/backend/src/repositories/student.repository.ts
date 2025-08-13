import {inject, Getter} from '@loopback/core';
import {DefaultCrudRepository, repository, BelongsToAccessor} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Student, StudentRelations, Teacher} from '../models';
import {TeacherRepository} from './teacher.repository';

export class StudentRepository extends DefaultCrudRepository<
  Student,
  typeof Student.prototype.username,
  StudentRelations
> {

  public readonly teacher: BelongsToAccessor<Teacher, typeof Student.prototype.username>;

  constructor(
    @inject('datasources.DB') dataSource: DbDataSource, @repository.getter('TeacherRepository') protected teacherRepositoryGetter: Getter<TeacherRepository>,
  ) {
    super(Student, dataSource);
    this.teacher = this.createBelongsToAccessorFor('teacher', teacherRepositoryGetter,);
    this.registerInclusionResolver('teacher', this.teacher.inclusionResolver);
  }
}
