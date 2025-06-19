import {
  Controller,
  Post,
  UseInterceptors,
  BadRequestException,
  UploadedFiles,
} from '@nestjs/common';
import {
  FilesInterceptor,
} from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { UploadMultimediaDto } from './dto/upload-media.dto';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadMultimediaDto })
  @UseInterceptors(FilesInterceptor('files', 10))
  async upload(@UploadedFiles() files?: Express.Multer.File[]) {
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

    const results = [];

    for (const file of files) {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException(
          `Unsupported file type: ${file.originalname}`,
        );
      }

      const uniqueName = this.uploadService.generateUniqueFileName(file.originalname);
      const url = await this.uploadService.uploadFile(file, file.originalname)
      results.push({ filename: file.originalname, url });
    }

    return { uploaded: results };
  }
}
