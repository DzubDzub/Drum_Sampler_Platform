import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Homework, HomeworkRelations, Lesson} from '../models';
import {LessonRepository} from './lesson.repository';

export class HomeworkRepository extends DefaultCrudRepository<
  Homework,
  typeof Homework.prototype.ID,
  HomeworkRelations
> {
  public readonly lesson: BelongsToAccessor<
    Lesson,
    typeof Homework.prototype.ID
  >;
  constructor(
    @repository.getter('LessonRepository')
    protected lessonRepositoryGetter: Getter<LessonRepository>,
    @inject('datasources.DB') dataSource: DbDataSource,
  ) {
    super(Homework, dataSource);

    this.lesson = this.createBelongsToAccessorFor(
      'lesson',
      lessonRepositoryGetter,
    );
    this.registerInclusionResolver('lesson', this.lesson.inclusionResolver);
  }
}
