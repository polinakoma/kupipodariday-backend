import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from '../auth/jwt.guard';
import { User } from '../users/entities/user.entity';
import { AuthUser } from '../common/user.decorator';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('Offers')
@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Post()
  create(@Body() createOfferDto: CreateOfferDto, @AuthUser() user: User) {
    return this.offersService.create(createOfferDto, user.id);
  }

  @Get()
  getOffers() {
    return this.offersService.findOffers();
  }

  @Get(':id')
  getById(@Param('id') id: string) {
    return this.offersService.findOfferById(+id);
  }
}
