import { Length, IsUrl, IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

export class WishPartialDto {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdAt: string;

  @CreateDateColumn()
  updatedAt: string;

  @IsString()
  @Length(1, 250)
  @ApiProperty({ example: 'Название' })
  name: string;

  @IsUrl()
  @ApiProperty({ example: 'https://catherine.png' })
  link: string;

  @IsUrl()
  @ApiProperty({ example: 'https://catherine.png' })
  image: string;

  @ApiProperty({ example: '88,22' })
  @Min(1)
  price: number;

  @IsNumber()
  raised: number;

  @IsNumber()
  copied: number;

  @Length(1, 1024)
  @IsString()
  @ApiProperty({ example: 'Это моя мечта' })
  description: string;
}
