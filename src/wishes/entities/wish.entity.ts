import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsUrl, Length } from 'class-validator';
import {
  Entity,
  JoinTable,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Offer } from '../../offers/entities/offer.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Wish {
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
  @ApiProperty({ example: 'Название' })
  name: string;

  @Column()
  @IsUrl()
  @ApiProperty({ example: 'https://catherine.png' })
  link: string;

  @Column()
  @IsUrl()
  @ApiProperty({ example: 'https://catherine.png' })
  image: string;

  @Column({ type: 'decimal', scale: 2, default: 1 })
  @IsNotEmpty()
  @ApiProperty({ example: '88,22' })
  price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @ApiProperty({ example: '88,22' })
  raised: number;

  @Column()
  @Length(1, 1024)
  @IsString()
  @ApiProperty({ example: 'Это моя мечта' })
  description: string;

  @Column({ default: 0 })
  @IsNumber()
  copied: number;

  @OneToMany(() => Offer, (offer) => offer.item)
  @JoinTable()
  offers: Offer[];

  @ManyToOne(() => User, (user) => user.wishes)
  @JoinTable()
  owner: User;
}
