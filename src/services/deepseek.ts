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

const DEEPSEEK_API_URL = 'https://api.deepseek.ai/v1/chat/completions';

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

    if (!this.apiKey || this.apiKey === 'your_deepseek_api_key_here') {
      throw new Error('Invalid or missing DeepSeek API key. Please set a valid API key in your .env.local file.');
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

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `API request failed with status ${response.status}`;
        try {
          const errorData = JSON.parse(errorText) as DeepSeekError;
          errorMessage = errorData.error?.message || errorMessage;
        } catch (e) {
          errorMessage += `: ${errorText}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json() as DeepSeekResponse;
      if (!data.choices?.[0]?.message?.content) {
        throw new Error('Invalid response format from DeepSeek API');
      }

      return data.choices[0].message.content;
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