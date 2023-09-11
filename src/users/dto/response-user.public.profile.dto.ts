import { OmitType } from '@nestjs/swagger';
import { UserProfileResponseDto } from './response-user.profile.dto';

export class UserPublicProfileResponseDto extends OmitType(
  UserProfileResponseDto,
  ['email'],
) {}
