import { ApiProperty } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MaxLength,
} from 'class-validator';
import {
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity()
export class Wishlist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  @Length(1, 250)
  @IsString()
  @ApiProperty({ example: 'Вишлист' })
  name: string;

  @Column()
  @MaxLength(1500)
  @IsString()
  @ApiProperty({ example: 'Мои желания' })
  description: string;

  @Column()
  @IsUrl()
  @ApiProperty({ example: 'https://pixnio.com/2.jpg' })
  image: string;

  @ManyToOne(() => User, (user) => user.wishlists)
  @JoinTable()
  owner: User;

  @ManyToMany(() => Wish)
  @JoinTable()
  @IsOptional()
  items: Wish[];
}
