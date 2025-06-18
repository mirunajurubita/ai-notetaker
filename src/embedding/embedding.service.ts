import { Injectable } from '@nestjs/common';

@Injectable()
export class EmbeddingService {
  private embedder: any;

  async onModuleInit() {
    const TransformersApi = Function('return import("@xenova/transformers")')();
    const { pipeline } = await TransformersApi;
    
    this.embedder = await pipeline(
      'feature-extraction',
      'Xenova/all-MiniLM-L6-v2',
    );
  }
  chunkText(text: string): string[] {
    // split into 500‑char chunks
    const chunks: string[] = [];
    for (let i = 0; i < text.length; i += 500) {
      chunks.push(text.slice(i, i + 500));
    }
    return chunks;
  }
  async embedText(text: string): Promise<number[]> {
    const result = await this.embedder(text);
    return result[0]; // Float32Array → number[]
  }
}
