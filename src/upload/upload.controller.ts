import {
  Controller,
  Post,
  UseInterceptors,
  BadRequestException,
  UploadedFiles,
  Get,
  Param,
  Res,
} from '@nestjs/common';
import {
  FileFieldsInterceptor,
  FileInterceptor,
  FilesInterceptor,
} from '@nestjs/platform-express';
import { Response } from 'express';
import { UploadService } from './upload.service';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { UploadMultimediaDto } from './dto/upload-media.dto';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Get(':filename')
  async getFile(@Param('filename') filename: string, @Res() res: Response){
    const stream = await this.uploadService.getFileStream(filename)
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `incline; filename=${filename}`
    });
    stream.pipe(res)
  }

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
