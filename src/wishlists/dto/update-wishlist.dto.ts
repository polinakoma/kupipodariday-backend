import { OmitType } from '@nestjs/swagger';
import { CreateWishlistDto } from './create-wishlist.dto';

export class UpdateWishlistDto extends OmitType(CreateWishlistDto, [
  'description',
]) {}
