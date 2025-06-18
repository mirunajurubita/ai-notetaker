import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UploadModule } from './upload/upload.model';
import { PdfParserModule } from './pdf-parser/pdf-parser.module';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UploadModule,
    PdfParserModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
