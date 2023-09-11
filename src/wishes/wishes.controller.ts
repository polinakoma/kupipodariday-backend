import {
  Controller,
  Get,
  Param,
  Delete,
  UseGuards,
  Post,
  Body,
  Patch,
  Req,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt.guard';
import { User } from '../users/entities/user.entity';
import { UpdateWishDto } from './dto/update-wish.dto';
import { AuthUser } from '../common/user.decorator';

@ApiTags('Wishes')
@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post()
  create(@Body() createWishDto: CreateWishDto, @Req() req) {
    return this.wishesService.create(createWishDto, req.user.id);
  }

  @Get('top')
  getTopWishes() {
    return this.wishesService.getPopularWishes();
  }

  @Get('last')
  getLastWishes() {
    return this.wishesService.getRecentlyAddedWishes();
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.wishesService.findWishById(+id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @AuthUser() user: User,
    @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService.update(+id, user.id, updateWishDto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @AuthUser() user: User) {
    return this.wishesService.remove(+id, user.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copy(@Param('id') wishId: string, @AuthUser() user: User) {
    return this.wishesService.copy(+wishId, user.id);
  }
}
