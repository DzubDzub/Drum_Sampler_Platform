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
import {Lesson, Student} from '../models';
import {LessonRepository, StudentRepository} from '../repositories';
import {inject} from '@loopback/core';
import {TokenServiceBindings} from '@loopback/authentication-jwt';
import {MyStudentService} from '../services/MyStudentService';
import {MyStudentServiceBindings} from '../keys';
import {authenticate, TokenService} from '@loopback/authentication';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';
import {Credentials} from '../services/user-service';
import {PasswordHasherBindings} from '../keys';
import {PasswordHasher} from '../services/hash.password.bcrypt';

export class StudentController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(MyStudentServiceBindings.USER_SERVICE)
    public userService: MyStudentService,
    @inject(SecurityBindings.USER, {optional: true})
    public user: UserProfile,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public passwordHasher: PasswordHasher,
    @repository(StudentRepository)
    protected studentRepository: StudentRepository,
    @repository(LessonRepository)
    protected lessonRepository: LessonRepository,
  ) {}

  @post('/students')
  @response(200, {
    description: 'Student model instance',
    content: {'application/json': {schema: getModelSchemaRef(Student)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Student, {
            title: 'NewStudent',
          }),
        },
      },
    })
    student: Student,
  ): Promise<Student> {
    return this.studentRepository.create(student);
  }

  @get('/students/count')
  @response(200, {
    description: 'Student model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(@param.where(Student) where?: Where<Student>): Promise<Count> {
    return this.studentRepository.count(where);
  }

  @get('/students')
  @response(200, {
    description: 'Array of Student model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Student, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Student) filter?: Filter<Student>,
  ): Promise<Student[]> {
    return this.studentRepository.find(filter);
  }

  @patch('/students')
  @response(200, {
    description: 'Student PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Student, {partial: true}),
        },
      },
    })
    student: Partial<Student>,
    @param.where(Student) where?: Where<Student>,
  ): Promise<Count> {
    return this.studentRepository.updateAll(student, where);
  }

  @get('/students/{id}')
  @response(200, {
    description: 'Student model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Student, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Student, {exclude: 'where'})
    filter?: FilterExcludingWhere<Student>,
  ): Promise<Student> {
    return this.studentRepository.findById(id, filter);
  }

  @patch('/students/{id}')
  @response(204, {
    description: 'Student PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Student, {partial: true}),
        },
      },
    })
    student: Partial<Student>,
  ): Promise<void> {
    await this.studentRepository.updateById(id, student);
  }

  @put('/students/{id}')
  @response(204, {
    description: 'Student PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() student: Student,
  ): Promise<void> {
    await this.studentRepository.replaceById(id, student);
  }

  @del('/students/{id}')
  @response(204, {
    description: 'Student DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.studentRepository.deleteById(id);
  }

  //-----------------authentication
  @post('/students/login', {
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
  @post('/signup', {
    responses: {
      '200': {
        description: 'Student',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Student, {exclude: ['password']}),
          },
        },
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Student, {
            title: 'NewStudent',
            exclude: ['username'],
          }),
        },
      },
    })
    newStudentRequest: Omit<Student, 'id'>,
  ): Promise<Student> {
    // Hash the user's password
    newStudentRequest.password = await this.passwordHasher.hashPassword(
      newStudentRequest.password,
    );

    // Create the new user
    const savedUser = await this.studentRepository.create(newStudentRequest);

    // Exclude the password before returning the user
    return this.studentRepository.findById(savedUser.username, {
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
  @get('/students/{studentId}/lessons')
  @response(200, {
    description: 'Array of Lessons for a specific student',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Lesson, {includeRelations: true}),
        },
      },
    },
  })
  async findLessonsByStudent(
    @param.path.string('studentId') studentId: string,
  ): Promise<Lesson[]> {
    return this.lessonRepository.find({
      where: {studentId},
    });
  }
}
