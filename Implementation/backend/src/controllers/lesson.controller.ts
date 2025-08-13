import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Homework, Lesson, Student, Teacher} from '../models';
import {LessonRepository} from '../repositories';
import {authenticate} from '@loopback/authentication';

export class LessonController {
  constructor(
    @repository(LessonRepository)
    public lessonRepository: LessonRepository,
  ) {}

  @authenticate('jwt')
  @post('/lessons')
  @response(200, {
    description: 'Lesson model instance',
    content: {'application/json': {schema: getModelSchemaRef(Lesson)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Lesson, {
            title: 'NewLesson',
          }),
        },
      },
    })
    lesson: Lesson,
  ): Promise<Lesson> {
    return this.lessonRepository.create(lesson);
  }

  @authenticate('jwt')
  @get('/lessons/count')
  @response(200, {
    description: 'Lesson model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Lesson) where?: Where<Lesson>): Promise<Count> {
    return this.lessonRepository.count(where);
  }

  @authenticate('jwt')
  @get('/lessons')
  @response(200, {
    description: 'Array of Lesson model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Lesson, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Lesson) filter?: Filter<Lesson>): Promise<Lesson[]> {
    return this.lessonRepository.find(filter);
  }

  @authenticate('jwt')
  @patch('/lessons')
  @response(200, {
    description: 'Lesson PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Lesson, {partial: true}),
        },
      },
    })
    lesson: Lesson,
    @param.where(Lesson) where?: Where<Lesson>,
  ): Promise<Count> {
    return this.lessonRepository.updateAll(lesson, where);
  }

  @authenticate('jwt')
  @get('/lessons/{id}')
  @response(200, {
    description: 'Lesson model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Lesson, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Lesson, {exclude: 'where'})
    filter?: FilterExcludingWhere<Lesson>,
  ): Promise<Lesson> {
    return this.lessonRepository.findById(id, filter);
  }

  @authenticate('jwt')
  @patch('/lessons/{id}')
  @response(204, {
    description: 'Lesson PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Lesson, {partial: true}),
        },
      },
    })
    lesson: Lesson,
  ): Promise<void> {
    await this.lessonRepository.updateById(id, lesson);
  }

  @authenticate('jwt')
  @put('/lessons/{id}')
  @response(204, {
    description: 'Lesson PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() lesson: Lesson,
  ): Promise<void> {
    await this.lessonRepository.replaceById(id, lesson);
  }

  @authenticate('jwt')
  @del('/lessons/{id}')
  @response(204, {
    description: 'Lesson DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.lessonRepository.deleteById(id);
  }

  @authenticate('jwt')
  @get('/lessons/{id}/student')
  @response(200, {
    description: 'Student belonging to Lesson',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Student),
      },
    },
  })
  async getStudent(@param.path.number('id') id: number): Promise<Student> {
    return this.lessonRepository.student(id);
  }

  @authenticate('jwt')
  @get('/lessons/{id}/teacher')
  @response(200, {
    description: 'Teacher belonging to Lesson',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Teacher),
      },
    },
  })
  async getTeacher(@param.path.number('id') id: number): Promise<Teacher> {
    return this.lessonRepository.teacher(id);
  }

  @authenticate('jwt')
  @get('/lessons/{id}/homework')
  @response(200, {
    description: 'Homework belonging to Lesson',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Homework),
      },
    },
  })
  async getHomework(
    @param.path.number('id') id: typeof Homework.prototype.ID,
  ): Promise<Homework[]> {
    return this.lessonRepository.homework(id).find();
  }
}
