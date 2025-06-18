import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as pdfParse from 'pdf-parse';
import { ParsedContentDocument } from 'src/schemas/document.schema';



@Injectable()
export class PdfParserService{
    constructor(
        @InjectModel('ParsedContent')
        private parsedModel: Model<ParsedContentDocument>
    ){}

    async extractTextFromBuffer(buffer: Buffer){
        const data = await pdfParse(buffer)
        return data.text
    }

    async saveParsedContent(filename: string, text: string, fileType: 'document' | 'audio'){
        const parsed = new this.parsedModel({filename, text, fileType})
        return parsed.save()
    }
}