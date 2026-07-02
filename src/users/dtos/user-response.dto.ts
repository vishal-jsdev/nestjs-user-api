import { Expose } from 'class-transformer';

export class UserResponseDto {
  @Expose()
  id!: number;
  @Expose()
  email!: string;
  @Expose()
  gender?: string;
  @Expose()
  isMarried!: boolean;
}
