import { ApiProperty } from '@nestjs/swagger';
import { User } from '../users.model';

export class LoginSwaggerResponse {
  @ApiProperty()
  user: User;

  @ApiProperty()
  jwt: string;
}

export class SignUpSwaggerResponse {
  @ApiProperty()
  user: User;

  @ApiProperty()
  jwt: string;
}

export class ChangePasswordSwaggerResponse {
  @ApiProperty()
  user: User;

  @ApiProperty()
  jwt: string;
}

export class GetMeSwaggerResponse extends User {}