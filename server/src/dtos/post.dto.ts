import {
  IsBoolean,
  IsEmpty,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  length,
  Length,
  Min,
} from "class-validator";

export class CreatePostDto {
  @IsOptional()
  @IsString()
  public userId: string;
  @IsString()
  @Length(15)
  public title: string;
  @IsString()
  @Length(22)
  public content: string;
  @IsOptional()
  @IsString()
  public coverImageUrl: string;
}

export class UpdatePostDto {
  // @IsString()
  // @Length(6, 255)
  // public userId: string;

  @IsOptional()
  @IsString()
  @Length(15)
  public title: string;

  @IsOptional()
  @IsString()
  @Length(15)
  public content: string;
  @IsOptional()
  @IsBoolean()
  public status: boolean;

  @IsOptional()
  @IsString()
  public coverImageUrl: string;
}
