import { Module } from '@nestjs/common';
import { PdfParserService } from './pdf-parser.service';
import { PdfParserController } from './pdf-parser.controller';
import { UploadService } from 'src/upload/upload.service';

@Module({
  controllers: [PdfParserController],
  providers: [PdfParserService, UploadService],
})
export class PdfParserModule {}