import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { instanceToPlain } from 'class-transformer';
import { AuthUser } from 'src/common/user.decorator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { SigninUserDto } from './dto/signin-user.dto';
import { LocalGuard } from './local.guard';

@Controller('/')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @ApiTags('Signin')
  @UseGuards(LocalGuard)
  @Post('signin')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  signin(@AuthUser() user, @Body() signinUserDto: SigninUserDto) {
    return this.authService.auth(user);
  }

  @ApiTags('Signup')
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.createUser(createUserDto);
    return instanceToPlain(user);
  }
}
