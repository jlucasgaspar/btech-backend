import { ApiProperty } from '@nestjs/swagger';

export class ErrorSwagger {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: number;

  @ApiProperty()
  error: number;
}