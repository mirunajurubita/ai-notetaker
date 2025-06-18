import { Body, Controller, Post } from '@nestjs/common';
import { PdfParserService } from './pdf-parser.service';
import { UploadService } from 'src/upload/upload.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('document')
@Controller('document')
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
      const text = await this.pdfParserService.extractTextFromBuffer(buffer);

      await this.pdfParserService.saveParsedContent(filename, text, 'document');
      results.push({ filename, text });
    }

    return results;
  }
}
