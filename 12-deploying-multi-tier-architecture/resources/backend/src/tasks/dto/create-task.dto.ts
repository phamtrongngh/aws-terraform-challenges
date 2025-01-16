import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @ApiProperty()
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(256)
  @ApiProperty({ required: false })
  description: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ required: false })
  completed: boolean;
}
