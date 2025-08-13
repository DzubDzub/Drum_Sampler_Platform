import {repository} from '@loopback/repository';
import {param, get, getModelSchemaRef} from '@loopback/rest';
import {Student, Teacher} from '../models';
import {StudentRepository} from '../repositories';

export class StudentTeacherController {
  constructor(
    @repository(StudentRepository)
    public studentRepository: StudentRepository,
  ) {}

  @get('/students/{id}/teacher', {
    responses: {
      '200': {
        description: 'Teacher belonging to Student',
        content: {
          'application/json': {
            schema: {type: 'array', items: getModelSchemaRef(Teacher)},
          },
        },
      },
    },
  })
  async getTeacher(
    @param.path.string('id') id: typeof Student.prototype.username,
  ): Promise<Teacher> {
    return this.studentRepository.teacher(id);
  }
}
