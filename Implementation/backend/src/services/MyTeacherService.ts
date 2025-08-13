import {UserProfile} from '@loopback/security';
import {TeacherRepository} from '../repositories';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {compare} from 'bcryptjs';
import {Credentials} from './user-service';
import {Teacher} from '../models';
import {securityId} from '@loopback/security';

export class MyTeacherService {
  constructor(
    @repository(TeacherRepository)
    public teacherRepository: TeacherRepository,
  ) {}

  async verifyCredentials(credentials: Credentials): Promise<Teacher> {
    const foundUser = await this.teacherRepository.findOne({
      where: {username: credentials.username},
    });

    if (!foundUser) {
      throw new HttpErrors.Unauthorized('Invalid username or password');
    }

    const passwordMatched = await compare(credentials.password, foundUser.password);
    if (!passwordMatched) {
      throw new HttpErrors.Unauthorized('Invalid username or password');
    }

    return foundUser;
  }

  convertToUserProfile(teacher: Teacher): UserProfile {
    return {
      [securityId]: teacher.username,
      name: `${teacher.firstName} ${teacher.lastName}`,
    };
  }
}
