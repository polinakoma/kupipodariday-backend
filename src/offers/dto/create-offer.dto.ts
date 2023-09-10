import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsBoolean } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  @ApiProperty()
  amount: number;

  @IsBoolean()
  @ApiProperty({ default: false })
  hidden: boolean;

  @IsNumber()
  @ApiProperty()
  itemId: number;
}
