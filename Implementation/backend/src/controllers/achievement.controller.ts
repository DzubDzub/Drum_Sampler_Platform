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
import {Achievement} from '../models';
import {AchievementRepository} from '../repositories';

export class AchievementController {
  constructor(
    @repository(AchievementRepository)
    public achievementRepository : AchievementRepository,
  ) {}

  @post('/achievements')
  @response(200, {
    description: 'Achievement model instance',
    content: {'application/json': {schema: getModelSchemaRef(Achievement)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Achievement, {
            title: 'NewAchievement',
            
          }),
        },
      },
    })
    achievement: Achievement,
  ): Promise<Achievement> {
    return this.achievementRepository.create(achievement);
  }

  @get('/achievements/count')
  @response(200, {
    description: 'Achievement model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Achievement) where?: Where<Achievement>,
  ): Promise<Count> {
    return this.achievementRepository.count(where);
  }

  @get('/achievements')
  @response(200, {
    description: 'Array of Achievement model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Achievement, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Achievement) filter?: Filter<Achievement>,
  ): Promise<Achievement[]> {
    return this.achievementRepository.find(filter);
  }

  @patch('/achievements')
  @response(200, {
    description: 'Achievement PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Achievement, {partial: true}),
        },
      },
    })
    achievement: Achievement,
    @param.where(Achievement) where?: Where<Achievement>,
  ): Promise<Count> {
    return this.achievementRepository.updateAll(achievement, where);
  }

  @get('/achievements/{id}')
  @response(200, {
    description: 'Achievement model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Achievement, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Achievement, {exclude: 'where'}) filter?: FilterExcludingWhere<Achievement>
  ): Promise<Achievement> {
    return this.achievementRepository.findById(id, filter);
  }

  @patch('/achievements/{id}')
  @response(204, {
    description: 'Achievement PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Achievement, {partial: true}),
        },
      },
    })
    achievement: Achievement,
  ): Promise<void> {
    await this.achievementRepository.updateById(id, achievement);
  }

  @put('/achievements/{id}')
  @response(204, {
    description: 'Achievement PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() achievement: Achievement,
  ): Promise<void> {
    await this.achievementRepository.replaceById(id, achievement);
  }

  @del('/achievements/{id}')
  @response(204, {
    description: 'Achievement DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.achievementRepository.deleteById(id);
  }
}
