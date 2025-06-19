import { Body, Controller, Post } from '@nestjs/common';
import { PdfParserService } from './pdf-parser.service';
import { UploadService } from 'src/upload/upload.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { EmbeddingService } from 'src/embedding/embedding.service';
import { VectorStoreService } from 'src/vector-store/vector-store.service';

@ApiTags('document')
@Controller('document')
export class PdfParserController {
  constructor(
    private readonly pdfParserService: PdfParserService,
    private readonly uploadService: UploadService,
    private readonly embeddingService: EmbeddingService,
    private readonly vectorStoreService: VectorStoreService,
  ) {}

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        filenames: {
          type: 'array',
          items: { type: 'string' },
          example: ['file1.pdf', 'file2.pdf'],
        },
      },
      required: ['filenames'],
    },
  })
  @Post('parse-many')
  async parsePdf(@Body() body: { filenames: string[] }) {
    const results = [];
    for (const filename of body.filenames) {
      const stream = await this.uploadService.getFileStream(filename);
      const buffer = await this.uploadService.streamToBuffer(stream);
      const text = await this.pdfParserService.extractTextFromBuffer(buffer);

      await this.pdfParserService.saveParsedContent(filename, text, 'document');

      const chunks = this.embeddingService.chunkText(text);
      const embeddings = await Promise.all(
        chunks.map((chunk) => this.embeddingService.embedText(chunk)),
      );

      await this.vectorStoreService.ensureCollectionExists('pdf_chunks');
      await this.vectorStoreService.upsertChunks({
        fileName: filename,
        chunks,
        embeddings,
      });
      results.push({ filename, text });
    }

    return results;
  }
}
