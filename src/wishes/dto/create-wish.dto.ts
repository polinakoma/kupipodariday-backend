import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUrl, Length, Min } from 'class-validator';

export class CreateWishDto {
  @IsString()
  @Length(1, 250)
  @ApiProperty({ example: 'Название' })
  name: string;

  @IsUrl()
  @ApiProperty({ example: 'https://catherine.png' })
  image: string;

  @IsUrl()
  @ApiProperty({ example: 'https://catherine.png' })
  link: string;

  @ApiProperty({ example: '88,22' })
  @Min(1)
  price: number;

  @IsString()
  @Length(1, 1024)
  @ApiProperty({ example: 'Это моя мечта' })
  description: string;
}
