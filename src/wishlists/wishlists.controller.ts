import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt.guard';
import { Wishlist } from './entities/wishlist.entity';
import { AuthUser } from '../common/user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('Wishlists')
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  findAll(): Promise<Wishlist[]> {
    return this.wishlistsService.findAll();
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Post()
  create(@Body() createWishlistDto: CreateWishlistDto, @AuthUser() user: User) {
    return this.wishlistsService.create(createWishlistDto, user.id);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.wishlistsService.findOne(+id);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateWishlistDto: UpdateWishlistDto,
    @Req() req,
  ) {
    return this.wishlistsService.update(+id, updateWishlistDto, req.user);
  }

  @UseGuards(JwtGuard)
  @ApiBearerAuth()
  @Delete(':id')
  remove(@Param('id') id: number, @AuthUser() user: User) {
    return this.wishlistsService.delete(+id, user);
  }
}
