import {Exclude, Expose} from 'class-transformer';
import {IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min} from 'class-validator';

@Exclude()
export class CreateSeasonDto {
  @Expose()
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(12)
  month!: number;

  @Expose()
  @IsNotEmpty()
  @IsString()
  name!: string;

  @Expose()
  @IsOptional()
  @IsString()
  description!: string;

  @Expose()
  @IsNotEmpty()
  @IsBoolean()
  isHighSeason!: boolean;
}

@Exclude()
export class UpdateSeasonDto {
  @Expose()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number;

  @Expose()
  @IsOptional()
  @IsString()
  name?: string;

  @Expose()
  @IsOptional()
  @IsString()
  description?: string;

  @Expose()
  @IsOptional()
  @IsBoolean()
  isHighSeason?: boolean;
}

@Exclude()
export class SeasonResponseDto {
  @Expose()
  id!: number;

  @Expose()
  month!: number;

  @Expose()
  name!: string;

  @Expose()
  description!: string;

  @Expose()
  isHighSeason!: boolean;
}

export class ResponseSeasonDto {
  @Expose()
  total!: number;

  @Expose()
  data!: SeasonResponseDto[];
}

@Exclude()
export class SearchSeasonDto {
  @Expose()
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(12)
  month?: number;

  @Expose()
  @IsOptional()
  @IsString()
  name?: string;

  @Expose()
  @IsOptional()
  @IsString()
  description?: string;

  @Expose()
  @IsOptional()
  @IsBoolean()
  isHighSeason?: boolean;
}
