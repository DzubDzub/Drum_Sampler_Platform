// src/keys.ts
import {BindingKey} from '@loopback/core';
import {UserService} from '@loopback/authentication';
import {Student, Teacher} from './models';
import {Credentials} from './services/user-service';
import {PasswordHasher} from "./services/hash.password.bcrypt";

export namespace MyTeacherServiceBindings {
  export const USER_SERVICE = BindingKey.create<UserService<Teacher, Credentials>>(
    'services.teacher.user.service',
  );
}
export namespace MyStudentServiceBindings {
  export const USER_SERVICE = BindingKey.create<UserService<Student, Credentials>>(
    'services.student.user.service',
  );
}
export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER = BindingKey.create<PasswordHasher>('services.hasher');
}
