import { Module } from '@nestjs/common';
import { PdfParserService } from './pdf-parser.service';
import { PdfParserController } from './pdf-parser.controller';
import { UploadService } from 'src/upload/upload.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ParsedContentSchema } from 'src/schemas/document.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'ParsedContent', schema: ParsedContentSchema }])],
  controllers: [PdfParserController],
  providers: [PdfParserService, UploadService],
})
export class PdfParserModule {}