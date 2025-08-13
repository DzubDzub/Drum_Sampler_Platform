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
import {StudentsAchievements} from '../models';
import {StudentsAchievementsRepository} from '../repositories';

export class StudentsAchievementsController {
  constructor(
    @repository(StudentsAchievementsRepository)
    public studentsAchievementsRepository : StudentsAchievementsRepository,
  ) {}

  @post('/students-achievements')
  @response(200, {
    description: 'StudentsAchievements model instance',
    content: {'application/json': {schema: getModelSchemaRef(StudentsAchievements)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(StudentsAchievements, {
            title: 'NewStudentsAchievements',
            
          }),
        },
      },
    })
    studentsAchievements: StudentsAchievements,
  ): Promise<StudentsAchievements> {
    return this.studentsAchievementsRepository.create(studentsAchievements);
  }

  @get('/students-achievements/count')
  @response(200, {
    description: 'StudentsAchievements model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(StudentsAchievements) where?: Where<StudentsAchievements>,
  ): Promise<Count> {
    return this.studentsAchievementsRepository.count(where);
  }

  @get('/students-achievements')
  @response(200, {
    description: 'Array of StudentsAchievements model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(StudentsAchievements, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(StudentsAchievements) filter?: Filter<StudentsAchievements>,
  ): Promise<StudentsAchievements[]> {
    return this.studentsAchievementsRepository.find(filter);
  }

  @patch('/students-achievements')
  @response(200, {
    description: 'StudentsAchievements PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(StudentsAchievements, {partial: true}),
        },
      },
    })
    studentsAchievements: StudentsAchievements,
    @param.where(StudentsAchievements) where?: Where<StudentsAchievements>,
  ): Promise<Count> {
    return this.studentsAchievementsRepository.updateAll(studentsAchievements, where);
  }

  @get('/students-achievements/{id}')
  @response(200, {
    description: 'StudentsAchievements model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(StudentsAchievements, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(StudentsAchievements, {exclude: 'where'}) filter?: FilterExcludingWhere<StudentsAchievements>
  ): Promise<StudentsAchievements> {
    return this.studentsAchievementsRepository.findById(id, filter);
  }

  @patch('/students-achievements/{id}')
  @response(204, {
    description: 'StudentsAchievements PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(StudentsAchievements, {partial: true}),
        },
      },
    })
    studentsAchievements: StudentsAchievements,
  ): Promise<void> {
    await this.studentsAchievementsRepository.updateById(id, studentsAchievements);
  }

  @put('/students-achievements/{id}')
  @response(204, {
    description: 'StudentsAchievements PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() studentsAchievements: StudentsAchievements,
  ): Promise<void> {
    await this.studentsAchievementsRepository.replaceById(id, studentsAchievements);
  }

  @del('/students-achievements/{id}')
  @response(204, {
    description: 'StudentsAchievements DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.studentsAchievementsRepository.deleteById(id);
  }
}
