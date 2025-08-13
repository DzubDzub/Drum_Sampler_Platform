import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  HasManyRepositoryFactory,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Homework, Lesson, LessonRelations, Student, Teacher} from '../models';
import {StudentRepository} from './student.repository';
import {TeacherRepository} from './teacher.repository';
import {HomeworkRepository} from './homework.repository';

export class LessonRepository extends DefaultCrudRepository<
  Lesson,
  typeof Lesson.prototype.ID,
  LessonRelations
> {
  public readonly student: BelongsToAccessor<
    Student,
    typeof Lesson.prototype.ID
  >;
  public readonly teacher: BelongsToAccessor<
    Teacher,
    typeof Lesson.prototype.ID
  >;
  public readonly homework: HasManyRepositoryFactory<
    Homework,
    typeof Lesson.prototype.ID
  >;

  constructor(
    @inject('datasources.DB') dataSource: DbDataSource,
    @repository.getter('StudentRepository')
    protected studentRepositoryGetter: Getter<StudentRepository>,
    @repository.getter('TeacherRepository')
    protected teacherRepositoryGetter: Getter<TeacherRepository>,
    @repository.getter('HomeworkRepository')
    protected homeworkRepositoryGetter: Getter<HomeworkRepository>,
  ) {
    super(Lesson, dataSource);

    this.student = this.createBelongsToAccessorFor(
      'student',
      studentRepositoryGetter,
    );
    this.registerInclusionResolver('student', this.student.inclusionResolver);

    this.teacher = this.createBelongsToAccessorFor(
      'teacher',
      teacherRepositoryGetter,
    );
    this.registerInclusionResolver('teacher', this.teacher.inclusionResolver);

    this.homework = this.createHasManyRepositoryFactoryFor(
      'homeworks',
      homeworkRepositoryGetter,
    );
    this.registerInclusionResolver(
      'homeworks',
      this.homework.inclusionResolver,
    );
  }
}
