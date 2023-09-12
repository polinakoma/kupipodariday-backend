import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  DataSource,
  FindManyOptions,
  FindOneOptions,
} from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { WishesService } from '../wishes/wishes.service';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
    private readonly dataSource: DataSource,
  ) {}

  async create(createOfferDto: CreateOfferDto, userId: number) {
    const { amount, itemId } = createOfferDto;
    const wish = await this.wishesService.findOne({
      where: { id: itemId },
      relations: ['owner'],
    });
    const { price, raised, owner } = wish;

    if (owner.id === userId) {
      throw new ForbiddenException('Скинуться на подарок себе не выйдет');
    }

    if (Number(amount) + Number(raised) > Number(price)) {
      throw new ForbiddenException(
        `Сумма взноса превышает сумму остатка стоимости подарка`,
      );
    }

    const offer = this.offerRepository.create({
      ...createOfferDto,
      user: { id: userId },
      item: { id: itemId },
    });

    await this.dataSource.transaction(async (transactionalEntityManager) => {
      await transactionalEntityManager.insert<Offer>(Offer, offer);
      await transactionalEntityManager.update<Wish>(Wish, itemId, {
        raised: Number(raised) + Number(amount),
      });
    });

    return {};
  }

  findMany(allOffers: FindManyOptions<Offer>) {
    return this.offerRepository.find(allOffers);
  }

  findOne(offer: FindOneOptions<Offer>) {
    return this.offerRepository.findOne(offer);
  }

  findOffers() {
    return this.findMany({
      relations: {
        item: { owner: true },
        user: { wishes: true, offers: true },
      },
    });
  }

  findOfferById(id: number) {
    return this.findOne({
      where: { id },
      relations: {
        item: { owner: true },
        user: { wishes: true, offers: true },
      },
    });
  }
}
