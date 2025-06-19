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
    const { data, dims } = result;

    const tensor = result[0];
    const [batch, tokens, dim] = dims;

    if (batch !== 1) {
      throw new Error(`Unexpected batch size: ${batch}`);
    }

    const pooled = new Array(dim).fill(0);
    for (let i = 0; i < tokens; i++) {
      for (let j = 0; j < dim; j++) {
        pooled[j] += data[i * dim + j];
      }
    }

    for (let j = 0; j < dim; j++) {
      pooled[j] /= tokens;
    }

    return pooled;
  }
}
