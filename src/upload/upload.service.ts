import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UploadService {
  private blobServiceClient: BlobServiceClient;
  private containerName: string;

  constructor(private configService: ConfigService) {
    this.blobServiceClient = BlobServiceClient.fromConnectionString(
      this.configService.get<string>('AZURE_STORAGE_CONNECTION_STRING'),
      {
        retryOptions: {
          maxTries: 5,
          tryTimeoutInMs: 5000,
          retryDelayInMs: 1000,
        },
      },
    );

    this.containerName = this.configService.get<string>(
      'AZURE_STORAGE_CONTAINER_NAME',
    );
  }

  async onModuleInit() {
    try {
      await this.ensureContainerExists();
      console.log('UploadService initialized successfully');
    } catch (error) {
      console.error('Failed to initialize UploadService:', error);
    }
  }

  private getBlobClient(fileName: string): BlockBlobClient {
    const containerClient = this.blobServiceClient.getContainerClient(
      this.containerName,
    );
    return containerClient.getBlockBlobClient(fileName);
  }

  private async ensureContainerExists(): Promise<void> {
    const containerClient = this.blobServiceClient.getContainerClient(
      this.containerName,
    );

    const exists = await containerClient.exists();
    if (!exists) {
      console.log(
        `Container "${this.containerName}" does not exist. Creating it...`,
      );
      await containerClient.create();
      console.log(`Container "${this.containerName}" created successfully.`);
    } else {
      console.log(`Container "${this.containerName}" already exists.`);
    }
  }
  async fileExists(fileName: string): Promise<boolean> {
    const relativePath = fileName.includes('blob.core.windows.net')
      ? fileName.split(
          this.configService.get<string>('AZURE_STORAGE_CONTAINER_NAME'),
        )[1]
      : fileName;

    const blobClient = this.getBlobClient(relativePath);
    return await blobClient.exists();
  }

  async uploadFile(
    file: Express.Multer.File,
    fileName: string,
  ): Promise<string> {
    await this.ensureContainerExists();

    const blobClient = this.getBlobClient(fileName);
    await blobClient.uploadData(file.buffer, {
      blobHTTPHeaders: { blobContentType: file.mimetype },
    });

    console.log('Upload completed successfully');
    return fileName;
  }

  async deleteFile(fileName: string): Promise<void> {
    const blobClient = this.getBlobClient(fileName);
    await blobClient.delete();
  }

  generateUniqueFileName(originalName: string): string {
    const timestamp = new Date().getTime();
    const random = Math.floor(Math.random() * 1000);
    const extension = originalName.split('.').pop();
    return `${timestamp}-${random}.${extension}`;
  }

  async getFileStream(fileName: string): Promise<NodeJS.ReadableStream> {
    const relativePath = fileName.includes('blob.core.windows.net')
      ? fileName.split(
          this.configService.get<string>('AZURE_STORAGE_CONTAINER_NAME'),
        )[1]
      : fileName;

    const blobClient = this.getBlobClient(relativePath);
    const downloadResponse = await blobClient.download();

    if (!downloadResponse.readableStreamBody) {
      throw new Error('No readable stream available');
    }

    return downloadResponse.readableStreamBody;
  }

  async streamToBuffer(readableStream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      readableStream.on('data', (data) => chunks.push(Buffer.from(data)));
      readableStream.on('end', () => resolve(Buffer.concat(chunks)));
      readableStream.on('error', reject);
    });
  }
}
