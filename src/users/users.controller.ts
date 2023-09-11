import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Post,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FindUserDto } from './dto/find-user.dto';
import { JwtGuard } from '../auth/jwt.guard';
import { User } from './entities/user.entity';
import { AuthUser } from '../common/user.decorator';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@AuthUser() user: User): Promise<User> {
    return await this.usersService.findOne({
      where: { id: user.id },
      select: {
        email: true,
        username: true,
        id: true,
        avatar: true,
        about: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  @Patch('me')
  async updateOne(
    @AuthUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const { id } = user;
    return this.usersService.updateOne(id, updateUserDto);
  }

  @Get('me/wishes')
  findMyWishes(@AuthUser() user: User) {
    return this.usersService.findUserWishes(user.username);
  }

  @Get(':username')
  findByUsername(@Param('username') username: string) {
    return this.usersService.findByUsername(username);
  }

  @Get(':username/wishes')
  async getUsersWishes(@Param('username') username: string) {
    const wishes = await this.usersService.findUserWishes(username);
    return wishes;
  }

  @Post('find')
  findByCredential(@Body() findUserDto: FindUserDto) {
    const { query } = findUserDto;
    return this.usersService.findByCredential(query);
  }
}
