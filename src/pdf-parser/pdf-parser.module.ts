import { Module } from '@nestjs/common';
import { PdfParserService } from './pdf-parser.service';
import { PdfParserController } from './pdf-parser.controller';
import { UploadService } from 'src/upload/upload.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ParsedContentSchema } from 'src/schemas/document.schema';
import { EmbeddingService } from 'src/embedding/embedding.service';
import { VectorStoreService } from 'src/vector-store/vector-store.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'ParsedContent', schema: ParsedContentSchema }])],
  controllers: [PdfParserController],
  providers: [PdfParserService, UploadService, EmbeddingService, VectorStoreService],
})
export class PdfParserModule {}