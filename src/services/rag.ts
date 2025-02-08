import { Index } from '@upstash/vector';
import { Message } from '../types';
import { DeepSeekService } from './deepseek';

const VECTOR_INDEX = new Index({
  url: process.env.NEXT_PUBLIC_UPSTASH_VECTOR_REST_URL!,
  token: process.env.NEXT_PUBLIC_UPSTASH_VECTOR_REST_TOKEN!,
});

export class RAGService extends DeepSeekService {
  constructor(apiKey: string) {
    super(apiKey);
  }

  private async searchSimilarDocs(query: string, topK: number = 5) {
    const results = await VECTOR_INDEX.query({
      data: query,
      topK,
      includeMetadata: true,
      includeData: true,
    });
    return results;
  }

  async sendMessage(messages: Message[]): Promise<string> {
    const userMessage = messages[messages.length - 1];
    const similarDocs = await this.searchSimilarDocs(userMessage.content);
    const context = similarDocs.map(doc => doc.data).join('\n');

    // Enhance the user's message with relevant context
    const enhancedMessages = [...messages];
    enhancedMessages[enhancedMessages.length - 1] = {
      ...userMessage,
      content: `Context: ${context}\n\nUser Question: ${userMessage.content}`
    };

    return super.sendMessage(enhancedMessages);
  }

  async analyzeImage(imageFile: File): Promise<string> {
    // Implement image analysis with vector search capabilities
    const analysis = await super.analyzeImage(imageFile);
    const similarDocs = await this.searchSimilarDocs(analysis);
    const context = similarDocs.map(doc => doc.data).join('\n');
    
    return `Based on similar items in our database:\n${context}\n\nAnalysis: ${analysis}`;
  }
}