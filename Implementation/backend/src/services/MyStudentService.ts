import {UserProfile} from '@loopback/security';
import {StudentRepository, TeacherRepository} from '../repositories';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {compare} from 'bcryptjs';
import {Credentials} from './user-service';
import {Student, Teacher} from '../models';
import {securityId} from '@loopback/security';

export class MyStudentService {
  constructor(
    @repository(StudentRepository)
    public studentRepository: StudentRepository,
  ) {}

  async verifyCredentials(credentials: Credentials): Promise<Student> {
    const foundUser = await this.studentRepository.findOne({
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

  convertToUserProfile(student: Student): UserProfile {
    return {
      [securityId]: student.username,
      name: `${student.firstName} ${student.lastName}`,
    };
  }
}
