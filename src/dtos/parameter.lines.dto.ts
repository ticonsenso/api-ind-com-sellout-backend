import {IsNotEmpty, IsOptional, IsString, MaxLength} from 'class-validator';
import {Expose} from 'class-transformer';

export class CreateParameterLineDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name!: string;

  @IsOptional()
  @IsString()
  description!: string;

  @IsOptional()
  @IsString()
  groupProductLine!: string;
}

export class UpdateParameterLineDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name!: string;

  @IsOptional()
  @IsString()
  description!: string;

  @IsOptional()
  @IsString()
  groupProductLine!: string;
}

export class ParameterLineResponseDto {
  @Expose()
  id!: number;

  @Expose()
  name!: string;

  @Expose()
  description!: string;

  @Expose()
  groupProductLine!: string;
}

export class ParameterLineResponseDataDto {
  @Expose()
  items!: ParameterLineResponseDto[];

  @Expose()
  total!: number;
}

export class CreateParameterLineSearchDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  groupProductLine?: string;
}
