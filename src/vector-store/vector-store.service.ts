import { Injectable } from '@nestjs/common';
import { QdrantClient } from '@qdrant/js-client-rest';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class VectorStoreService {
  private client = new QdrantClient({ url: 'http://localhost:6333' });

  async ensureCollectionExists(collectionName: string) {
    const collections = await this.client.getCollections();
    const exists = collections.collections.some(
      (c) => c.name == collectionName,
    );
    
    if (!exists) {
      await this.client.createCollection(collectionName, {
        vectors: {
          size: 384,
          distance: 'Cosine',
        },
      });
    }
  }
  async upsertChunks(opts: {
    fileName: string;
    chunks: string[];
    embeddings: number[][];
  }) {
    try {
      const points = opts.embeddings.map((vector, idx) => ({
        id: uuidv4(),
        vector,
        payload: { text: opts.chunks[idx], file: opts.fileName },
      }));

      await this.client.upsert('pdf_chunks', { wait: true, points });
    } catch (err) {
      throw err;
    }
  }
}
