import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { PdfParserService } from './pdf-parser.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/upload/upload.service';
import { ApiBody } from '@nestjs/swagger';

@Controller()
export class PdfParserController {
  constructor(
    private readonly pdfParserService: PdfParserService,
    private readonly uploadService: UploadService,
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

      const parsed = await this.pdfParserService.extractTextFromBuffer(buffer);
      results.push({ filename, text: parsed });
    }

    return results;
  }
}
