// src/utils/openaiService.ts

import { OpenAI } from 'openai';

export interface OpenAIRequest {
  model: string;
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  temperature?: number;
  max_tokens?: number;
}

export interface OpenAIResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: { role: string; content: string };
    finish_reason: string;
  }>;
}

export class OpenAIService {
  private openai: OpenAI;

  constructor(apiKey: string, apiUrl = 'https://api.openai.com/v1') {
    this.openai = new OpenAI({ apiKey, baseURL: apiUrl, dangerouslyAllowBrowser: true });
  }

  async sendMessage(request: OpenAIRequest): Promise<OpenAIResponse> {
    const response = await this.openai.chat.completions.create({
      model: request.model,
      messages: request.messages,
      temperature: request.temperature,
      max_tokens: request.max_tokens,
    });
    // Adapt the SDK response to match the OpenAIResponse interface
    return {
      id: response.id,
      object: response.object,
      created: response.created,
      model: response.model,
      choices: response.choices.map(choice => ({
        index: choice.index,
        message: choice.message,
        finish_reason: choice.finish_reason,
      })),
    };
  }
}
