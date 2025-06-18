import { Injectable } from '@nestjs/common';
import { QdrantClient } from '@qdrant/js-client-rest';

@Injectable()
export class VectorStoreService {
  private client = new QdrantClient({ url: 'http://localhost:6333' });
  async upsertChunks(opts: {
    fileName: string;
    chunks: string[];
    embeddings: number[][];
  }) {
    const points = opts.embeddings.map((vector, idx) => ({
      id: `${opts.fileName}#${idx}`,
      vector,
      payload: { text: opts.chunks[idx], file: opts.fileName },
    }));
    console.log('points', points);
    await this.client.upsert('pdf_chunks', { points, wait: true });
  }
}
