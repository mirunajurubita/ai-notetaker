import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files', 10))
  async upload(@UploadedFile() files: Array<Express.Multer.File>) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const allowedMimeTypes = [
      'audio/mpeg',
      'audio/wav',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    const results = []

    for(const file of files){
        if(!allowedMimeTypes.includes(file.mimetype)){
            throw new BadRequestException(`Unsupported file type: ${file.originalname}`);
        }

        const url = await this.uploadService.uploadFile(file, 'uploads');
        results.push({ filename: file.originalname, url });
    }

    return { uploaded: results };
  }
}
