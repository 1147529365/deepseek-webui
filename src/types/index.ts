export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  reasoning_content?: string;
}

export interface FunctionParameter {
  type: string;
  description?: string;
  enum?: string[];
}

export interface FunctionDefinition {
  id: string;
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, FunctionParameter>;
    required: string[];
  };
  url: string;
  method: 'GET' | 'POST';
  headers?: Record<string, string>;
}

export interface Settings {
  model: string;
  temperature: number;
  systemPrompt: string;
  functions: FunctionDefinition[];
}

export interface ChatSettings {
  temperature: number;
  topP: number;
  topK: number;
  maxLength: number;
  systemPrompt: string;
  model: 'chat' | 'coder';
  functions: FunctionDefinition[];
}

export interface ChatFunction {
  id: string;
  name: string;
  description: string;
  parameters: Record<string, any>;
  required_params: string[];
  url: string;
  method: 'GET' | 'POST';
  headers: Record<string, string>;
} 