import { ApiProperty, PickType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

export class SigninUserResponseDto {
  @ApiProperty({ description: 'JWT-token' })
  access_token: string;
}

export class SigninUserDto extends PickType(CreateUserDto, [
  'username',
  'password',
]) {}
