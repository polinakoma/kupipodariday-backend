import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hashPassword } from '../utils/hashing';
import { Repository, FindOneOptions, FindManyOptions } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) //если нужно подключиться к нескольким, то перечислить чрез запятую
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { password } = createUserDto;
    const user = await this.userRepository.create({
      ...createUserDto,
      password: await hashPassword(password),
    });
    return this.userRepository.save(user);
  }

  findAll(users: FindManyOptions<User>) {
    return this.userRepository.find(users);
  }

  findOne(user: FindOneOptions<User>) {
    return this.userRepository.findOneOrFail(user);
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    const { password } = updateUserDto;
    const user = await this.findById(id);

    if (password) {
      updateUserDto.password = await hashPassword(password);
    }

    return this.userRepository.save({ ...user, ...updateUserDto });
  }

  async findUserWishes(name: string) {
    const user = await this.userRepository.findOne({
      where: {
        username: name,
      },
      relations: {
        wishes: true,
      },
    });
    return user.wishes;
  }

  findByUsername(username: string) {
    return this.userRepository.findOneBy({ username });
  }

  // вернет полную запись из БД
  async findById(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    return user;
  }

  findByCredential(credential: string) {
    return this.findAll({
      where: [{ username: credential }, { email: credential }],
    });
  }
}
