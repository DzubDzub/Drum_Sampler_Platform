import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from "@loopback/service-proxy";
import {BootMixin} from "@loopback/boot";
import {RepositoryMixin} from "@loopback/repository";
import {ApplicationConfig} from "@loopback/core";
import {MySequence} from "./sequence";
import {
  MyStudentServiceBindings,
  MyTeacherServiceBindings,
  PasswordHasherBindings
} from "./keys";
import {BcryptHasher} from "./services/hash.password.bcrypt";
import {MyTeacherService} from "./services/MyTeacherService";
import {MyStudentService} from "./services/MyStudentService";
import {
  RestExplorerBindings,
  RestExplorerComponent
} from "@loopback/rest-explorer";
import path from "node:path";
import {AuthenticationComponent} from "@loopback/authentication";
import {
  JWTAuthenticationComponent,
  UserServiceBindings
} from "@loopback/authentication-jwt";
import {DbDataSource} from "./datasources";
export {ApplicationConfig};
export class BackendApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);


    this.configure('cors').to({
      origin: ['http://localhost:3000'], // allow frontend origin
      methods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
      credentials: true,
    });

    // Set up the custom sequence
    this.sequence(MySequence);

    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher);
    this.bind(MyTeacherServiceBindings.USER_SERVICE).toClass(MyTeacherService);
    this.bind(MyStudentServiceBindings.USER_SERVICE).toClass(MyStudentService);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    this.bootOptions = {
      controllers: {
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
    this.component(AuthenticationComponent);
    this.component(JWTAuthenticationComponent);
    this.dataSource(DbDataSource, UserServiceBindings.DATASOURCE_NAME);
  }
}
