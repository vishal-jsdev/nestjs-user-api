import { IsInt, IsOptional } from 'class-validator';

export class PageQueryDto {
  @IsInt()
  @IsOptional()
  limit: number = 10;

  @IsInt()
  @IsOptional()
  page: number = 1;
}
