import OpenAI from 'openai';

/**
 * OpenAI service for HUNG AI chatbot
 * Integrates with OpenRouter API using DeepSeek R1 model
 */
class OpenAIService {
  constructor() {
    this.client = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      baseURL: 'https://openrouter.ai/api/v1',
      dangerouslyAllowBrowser: true,
    });
  }

  /**
   * Sends a message to the OpenAI API and returns the response
   * @param {string} message - User's message
   * @param {Array} conversationHistory - Previous messages for context
   * @returns {Promise<string>} - AI response
   */
  async sendMessage(message, conversationHistory = []) {
    try {
      const messages = [
        {
          role: 'system',
          content: `You are HUNG AI, an intelligent and helpful AI assistant created by Lord UTK the Packer. You are knowledgeable, engaging, and provide detailed, accurate responses. You support markdown formatting and code syntax highlighting. Always be helpful, professional, and aim to provide comprehensive answers to user queries.`
        },
        ...conversationHistory.map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.content
        })),
        {
          role: 'user',
          content: message
        }
      ];

      const response = await this.client.chat.completions.create({
        model: 'deepseek/deepseek-r1:nitro',
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      return response.choices[0]?.message?.content || 'I apologize, but I was unable to generate a response. Please try again.';
    } catch (error) {
      console.error('OpenAI API Error:', error);
      
      if (error.status === 401) {
        throw new Error('Authentication failed. Please check your API key.');
      } else if (error.status === 429) {
        throw new Error('Rate limit exceeded. Please wait a moment and try again.');
      } else if (error.status === 500) {
        throw new Error('OpenAI service is temporarily unavailable. Please try again later.');
      } else if (error.message?.includes('network') || error.message?.includes('fetch')) {
        throw new Error('Network error. Please check your connection and try again.');
      } else {
        throw new Error('Unable to connect to AI service. Please try again in a moment.');
      }
    }
  }

  /**
   * Streams a message response for real-time typing effect
   * @param {string} message - User's message
   * @param {Array} conversationHistory - Previous messages for context
   * @param {Function} onChunk - Callback for each chunk of response
   * @returns {Promise<void>}
   */
  async streamMessage(message, conversationHistory = [], onChunk) {
    try {
      const messages = [
        {
          role: 'system',
          content: `You are HUNG AI, an intelligent and helpful AI assistant created by Lord UTK the Packer. You are knowledgeable, engaging, and provide detailed, accurate responses. You support markdown formatting and code syntax highlighting. Always be helpful, professional, and aim to provide comprehensive answers to user queries.`
        },
        ...conversationHistory.map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.content
        })),
        {
          role: 'user',
          content: message
        }
      ];

      const stream = await this.client.chat.completions.create({
        model: 'deepseek/deepseek-r1:nitro',
        messages: messages,
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stream: true,
      });

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          onChunk(content);
        }
      }
    } catch (error) {
      console.error('OpenAI Streaming Error:', error);
      throw error;
    }
  }
}

export default new OpenAIService();