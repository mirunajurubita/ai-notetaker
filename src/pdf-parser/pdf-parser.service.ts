import { Injectable } from '@nestjs/common';
import * as pdfParse from 'pdf-parse';



@Injectable()
export class PdfParserService{
    async extractTextFromBuffer(buffer: Buffer){
        const data = await pdfParse(buffer)
        return data.text
    }
}