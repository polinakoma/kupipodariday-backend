import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { Repository } from 'typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
  ) {}

  create(createWishlistDto: CreateWishlistDto, creatorId: number) {
    const { itemsId, ...rest } = createWishlistDto;
    const items = itemsId.map((id) => ({ id } as Wish));
    const wishList = this.wishlistRepository.create({
      items: items,
      owner: { id: creatorId },
      ...rest,
    });
    return this.wishlistRepository.save(wishList);
  }

  findAll() {
    return this.wishlistRepository.find({
      relations: { items: true, owner: true },
    });
  }

  async findOne(id: number) {
    return await this.wishlistRepository.findOne({
      relations: { items: true },
      where: { id },
    });
  }

  async delete(id: number, user: User) {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (wishlist.owner.id !== user.id) {
      throw new ForbiddenException(
        'Вы не можете удалять чужие списки подарков',
      );
    }

    await this.wishlistRepository.delete(id);
    return wishlist;
  }

  async update(id: number, updateWishlistDto: UpdateWishlistDto, user: User) {
    const wishlist = await this.wishlistRepository.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (wishlist.owner.id !== user.id) {
      throw new ForbiddenException(
        'Вы не можете редактировать чужие списки подарков',
      );
    }

    const { itemsId, ...rest } = updateWishlistDto;
    const items = itemsId.map((id) => ({ id }));
    const updatedWishlist = { ...rest, items };

    await this.wishlistRepository.update(id, updatedWishlist);
    return await this.wishlistRepository.findOne({ where: { id } });
  }
}
