import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindOneOptions,
  FindManyOptions,
  DataSource,
} from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishRepository: Repository<Wish>,
    private dataSource: DataSource,
  ) {}

  create(createWishDto: CreateWishDto, userId: number) {
    const wish = this.wishRepository.create({
      ...createWishDto,
      owner: { id: userId },
    });
    return this.wishRepository.save(wish);
  }

  findOne(wish: FindOneOptions<Wish>) {
    return this.wishRepository.findOne(wish);
  }

  findAll(wishes: FindManyOptions<Wish>) {
    return this.wishRepository.find(wishes);
  }

  findWishById(id: number) {
    return this.findOne({
      where: { id },
      relations: { owner: true },
    });
  }

  async update(id: number, userId: number, updateWishDto: UpdateWishDto) {
    const wish = await this.findOne({
      where: { id },
      relations: { owner: true, offers: true },
    });

    if (userId !== wish.owner.id) {
      throw new ForbiddenException('Вы не можете редактировать чужие подарки');
    }

    if (updateWishDto.price && wish.raised > 0) {
      throw new ForbiddenException(
        'Вы не можете изменять стоимость подарка, если уже есть желающие скинуться',
      );
    }

    return this.wishRepository.update(id, updateWishDto);
  }

  async remove(id: number, userId: number) {
    const wish = await this.findOne({
      where: { id },
      relations: { owner: true, offers: true },
    });

    if (userId !== wish.owner.id) {
      throw new ForbiddenException('Нельзя удалить чужие подарки');
    }

    this.wishRepository.delete(id);
    return wish;
  }

  getPopularWishes() {
    return this.findAll({ order: { copied: 'DESC' }, take: 20 });
  }

  getRecentlyAddedWishes() {
    return this.findAll({ order: { createdAt: 'DESC' }, take: 40 });
  }

  async copy(wishId: number, userId: number) {
    const wish = await this.findOne({ where: { id: wishId } });

    const { name, description, image, link, price, copied } = wish;

    const isExist = !!(await this.findOne({
      where: {
        name,
        link,
        price,
        owner: { id: userId },
      },
      relations: { owner: true },
    }));

    if (isExist) {
      throw new ForbiddenException(
        'Подарок уже добавлен в список ваших желаний',
      );
    }

    const wishCopy = {
      name,
      description,
      image,
      link,
      price,
      owner: { id: userId },
    };

    await this.dataSource.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.update<Wish>(Wish, wishId, {
        copied: copied + 1,
      });

      await transactionalEntityManager.insert<Wish>(Wish, wishCopy);
    });

    return {};
  }
}
