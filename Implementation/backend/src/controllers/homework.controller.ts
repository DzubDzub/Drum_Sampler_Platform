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
import {Homework} from '../models';
import {HomeworkRepository} from '../repositories';

export class HomeworkController {
  constructor(
    @repository(HomeworkRepository)
    public homeworkRepository : HomeworkRepository,
  ) {}

  @post('/homework')
  @response(200, {
    description: 'Homework model instance',
    content: {'application/json': {schema: getModelSchemaRef(Homework)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Homework, {
            title: 'NewHomework',
            
          }),
        },
      },
    })
    homework: Homework,
  ): Promise<Homework> {
    return this.homeworkRepository.create(homework);
  }

  @get('/homework/count')
  @response(200, {
    description: 'Homework model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Homework) where?: Where<Homework>,
  ): Promise<Count> {
    return this.homeworkRepository.count(where);
  }

  @get('/homework')
  @response(200, {
    description: 'Array of Homework model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Homework, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Homework) filter?: Filter<Homework>,
  ): Promise<Homework[]> {
    return this.homeworkRepository.find(filter);
  }

  @patch('/homework')
  @response(200, {
    description: 'Homework PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Homework, {partial: true}),
        },
      },
    })
    homework: Homework,
    @param.where(Homework) where?: Where<Homework>,
  ): Promise<Count> {
    return this.homeworkRepository.updateAll(homework, where);
  }

  @get('/homework/{id}')
  @response(200, {
    description: 'Homework model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Homework, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Homework, {exclude: 'where'}) filter?: FilterExcludingWhere<Homework>
  ): Promise<Homework> {
    return this.homeworkRepository.findById(id, filter);
  }

  @patch('/homework/{id}')
  @response(204, {
    description: 'Homework PATCH success',
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Homework, {partial: true}),
        },
      },
    })
    homework: Homework,
  ): Promise<void> {
    await this.homeworkRepository.updateById(id, homework);
  }

  @put('/homework/{id}')
  @response(204, {
    description: 'Homework PUT success',
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() homework: Homework,
  ): Promise<void> {
    await this.homeworkRepository.replaceById(id, homework);
  }

  @del('/homework/{id}')
  @response(204, {
    description: 'Homework DELETE success',
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.homeworkRepository.deleteById(id);
  }
}
