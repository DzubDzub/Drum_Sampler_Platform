import {post, requestBody, response, HttpErrors, get} from '@loopback/rest';
import {inject} from '@loopback/core';
import {TokenServiceBindings} from '@loopback/authentication-jwt';
import {authenticate, TokenService} from '@loopback/authentication';
import {Credentials} from '../services/user-service';
import {MyTeacherServiceBindings, MyStudentServiceBindings} from '../keys';
import {MyTeacherService} from '../services/MyTeacherService';
import {MyStudentService} from '../services/MyStudentService';
import {repository} from '@loopback/repository';
import {TeacherRepository, StudentRepository} from '../repositories';
import {SecurityBindings, securityId, UserProfile} from '@loopback/security';

export class LoginController {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @inject(MyTeacherServiceBindings.USER_SERVICE)
    public teacherService: MyTeacherService,
    @inject(MyStudentServiceBindings.USER_SERVICE)
    public studentService: MyStudentService,
    @repository(TeacherRepository)
    public teacherRepo: TeacherRepository,
    @repository(StudentRepository)
    public studentRepo: StudentRepository,
  ) {}

  @post('/login')
  @response(200, {
    description: 'Unified login endpoint',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            token: {type: 'string'},
            role: {type: 'string'},
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
  ): Promise<{token: string; role: 'teacher' | 'student'}> {
    const {username} = credentials;

    const teacherExists = await this.teacherRepo.findOne({where: {username}});
    if (teacherExists) {
      const user = await this.teacherService.verifyCredentials(credentials);
      const userProfile = this.teacherService.convertToUserProfile(user);
      const token = await this.jwtService.generateToken(userProfile);
      return {token, role: 'teacher'};
    }

    const studentExists = await this.studentRepo.findOne({where: {username}});
    if (studentExists) {
      const user = await this.studentService.verifyCredentials(credentials);
      const userProfile = this.studentService.convertToUserProfile(user);
      const token = await this.jwtService.generateToken(userProfile);
      return {token, role: 'student'};
    }

    throw new HttpErrors.Unauthorized('Invalid username or password');
  }

  @authenticate('jwt')
  @get('/whoami')
  @response(200, {
    description: 'Current user info',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            username: {type: 'string'},
            role: {type: 'string'},
          },
        },
      },
    },
  })
  async whoAmI(
    @inject(SecurityBindings.USER)
    currentUserProfile: UserProfile,
  ): Promise<{username: string; role: string}> {
    const username = currentUserProfile[securityId];
    const role = (currentUserProfile as any).role;
    return {username, role};
  }
}
