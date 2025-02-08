import { Message } from '../types';

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface DeepSeekError {
  error: {
    message: string;
    type: string;
    code: string;
  };
}

const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions';

export class DeepSeekService {
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) throw new Error('DeepSeek API key is required');
    this.apiKey = apiKey;
  }

  async sendMessage(messages: Message[]): Promise<string> {
    if (!messages.length) {
      throw new Error('At least one message is required');
    }

    try {
      const response = await fetch(DEEPSEEK_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: messages.map(msg => ({
            role: msg.isUser ? 'user' : 'assistant',
            content: msg.content
          })),
          stream: false
        })
      });

      const data = await response.json() as DeepSeekResponse | DeepSeekError;

      if (!response.ok) {
        const errorData = data as DeepSeekError;
        throw new Error(`API request failed: ${errorData.error?.message || response.statusText}`);
      }

      const successData = data as DeepSeekResponse;
      if (!successData.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from DeepSeek API');
      }

      return successData.choices[0].message.content;
    } catch (error) {
      console.error('Error calling DeepSeek API:', error);
      throw error instanceof Error ? error : new Error('Unknown error occurred');
    }
  }

  async analyzeImage(imageFile: File): Promise<string> {
    if (!imageFile) {
      throw new Error('Image file is required');
    }

    if (!imageFile.type.startsWith('image/')) {
      throw new Error('Invalid file type. Only images are supported.');
    }

    // TODO: Implement image analysis using DeepSeek's vision capabilities
    // This is a placeholder for future implementation
    return 'Image analysis will be implemented in future versions.';
  }
}