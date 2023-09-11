import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(2, 30)
  @ApiProperty({ example: 'Ваше имя' })
  username: string;

  @Length(2, 200)
  @IsOptional()
  @ApiPropertyOptional({ default: 'Пока ничего не рассказал о себе' })
  about: string;

  @IsUrl()
  @IsOptional()
  @ApiPropertyOptional({ default: 'https://i.pravatar.cc/300' })
  avatar: string;

  @IsEmail()
  @IsString()
  @ApiProperty({ example: 'email@yandex.ru' })
  email: string;

  @IsString()
  @ApiProperty({ example: 'super_strong_password' })
  password: string;
}
