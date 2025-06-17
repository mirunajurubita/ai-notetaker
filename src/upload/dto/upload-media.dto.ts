import { ApiProperty } from "@nestjs/swagger";

export class UploadMultimediaDto {
  @ApiProperty({
    type: 'array',
    items: { type: 'string', format: 'binary' },
  })
  files: any[];
}