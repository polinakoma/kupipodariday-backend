import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Post,
  Body,
  Patch,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt.guard';
import { User } from '../users/entities/user.entity';
import { UpdateWishDto } from './dto/update-wish.dto';
import { AuthUser } from '../common/user.decorator';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@ApiTags('Wishes')
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Post()
  create(@Body() createWishDto: CreateWishDto, @AuthUser() user: User) {
    return this.wishesService.create(createWishDto, user.id);
  }

  @Get('top')
  getTopWishes() {
    return this.wishesService.getPopularWishes();
  }

  @Get('last')
  getLastWishes() {
    return this.wishesService.getRecentlyAddedWishes();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.wishesService.findWishById(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @AuthUser() user: User,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService.update(+id, user.id, updateWishDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @AuthUser() user: User) {
    return this.wishesService.remove(+id, user.id);
  }

  @Post(':id/copy')
  copy(@Param('id') wishId: string, @AuthUser() user: User) {
    return this.wishesService.copy(+wishId, user.id);
  }
}
