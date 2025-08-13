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
import {Student, Teacher} from '../models';
import {StudentRepository, TeacherRepository} from '../repositories';
import {inject} from '@loopback/core';
import {PasswordHasher} from '../services/hash.password.bcrypt';
import {TokenServiceBindings} from '@loopback/authentication-jwt';
import {TokenService} from '@loopback/authentication';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {authenticate} from '@loopback/authentication';
import {Credentials} from '../services/user-service'; // You might need to define this or update the import
import {MyTeacherService} from '../services/MyTeacherService';
import {MyTeacherServiceBindings, PasswordHasherBindings} from '../keys';

export class TeacherController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(MyTeacherServiceBindings.USER_SERVICE)
    public userService: MyTeacherService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @repository(StudentRepository)
    protected studentRepository: StudentRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @repository(TeacherRepository)
    protected teacherRepository: TeacherRepository,
  ) {}

  @post('/teachers')
  @response(200, {
    description: 'Teacher model instance',
    content: {'application/json': {schema: getModelSchemaRef(Teacher)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Teacher, {
            title: 'NewTeacher',
          }),
        },
      },
    })
    teacher: Teacher,
  ): Promise<Teacher> {
    return this.teacherRepository.create(teacher);
  }

  @get('/teachers/count')
  @response(200, {
    description: 'Teacher model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Teacher) where?: Where<Teacher>): Promise<Count> {
    return this.teacherRepository.count(where);
  }

  @get('/teachers')
  @response(200, {
    description: 'Array of Teacher model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Teacher, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Teacher) filter?: Filter<Teacher>,
  ): Promise<Teacher[]> {
    return this.teacherRepository.find(filter);
  }

  @patch('/teachers')
  @response(200, {
    description: 'Teacher PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Teacher, {partial: true}),
        },
      },
    })
    teacher: Teacher,
    @param.where(Teacher) where?: Where<Teacher>,
  ): Promise<Count> {
    return this.teacherRepository.updateAll(teacher, where);
  }

  @get('/teachers/{id}')
  @response(200, {
    description: 'Teacher model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Teacher, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Teacher, {exclude: 'where'})
    filter?: FilterExcludingWhere<Teacher>,
  ): Promise<Teacher> {
    return this.teacherRepository.findById(id, filter);
  }

  @patch('/teachers/{id}')
  @response(204, {
    description: 'Teacher PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Teacher, {partial: true}),
        },
      },
    })
    teacher: Teacher,
  ): Promise<void> {
    await this.teacherRepository.updateById(id, teacher);
  }

  @put('/teachers/{id}')
  @response(204, {
    description: 'Teacher PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() teacher: Teacher,
  ): Promise<void> {
    await this.teacherRepository.replaceById(id, teacher);
  }

  @del('/teachers/{id}')
  @response(204, {
    description: 'Teacher DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.teacherRepository.deleteById(id);
  }

  //-----------------authentication
  @post('/teachers/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['username', 'password'],
            properties: {
              username: {type: 'string'},
              password: {type: 'string'},
            },
          },
        },
      },
    })
    credentials: Credentials,
  ): Promise<{token: string}> {
    // ensure the user exists, and the password is correct
    const user = await this.userService.verifyCredentials(credentials);
    // convert a User object into a UserProfile object (reduced set of properties)
    const userProfile = this.userService.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);
    return {token};
  }

  // ==========  signup  ===========
  @post('/teachers/signup', {
    responses: {
      '200': {
        description: 'Teacher',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Teacher, {exclude: ['password']}),
          },
        },
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Teacher, {
            title: 'NewTeacher',
            exclude: ['username'],
          }),
        },
      },
    })
    newTeacherRequest: Omit<Teacher, 'id'>,
  ): Promise<Teacher> {
    // Hash the user's password
    newTeacherRequest.password = await this.passwordHasher.hashPassword(
      newTeacherRequest.password,
    );

    // Create the new user
    const savedUser = await this.teacherRepository.create(newTeacherRequest);

    // Exclude the password before returning the user
    return this.teacherRepository.findById(savedUser.username, {
      fields: {password: false},
    });
  }

  @authenticate('jwt')
  @get('/whoami', {
    responses: {
      '200': {
        description: 'Current User Profile',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                [securityId]: {type: 'string'},
                name: {type: 'string'},
                email: {type: 'string'},
                // Include other properties as needed
              },
            },
          },
        },
      },
    },
  })
  async whoAmI(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<UserProfile> {
    return currentUserProfile;
  }

  @authenticate('jwt')
  @get('/teachers/{teacherId}/students')
  @response(200, {
    description: 'Array of Students belonging to a specific teacher',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Student, {includeRelations: true}),
        },
      },
    },
  })
  async findStudentsByTeacher(
    @param.path.string('teacherId') teacherId: string,
  ): Promise<Student[]> {
    return this.studentRepository.find({where: {teacherId}});
  }
}
