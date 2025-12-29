export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot'; // 'user' speaks (converted to sign), 'bot' (system messages or sign interpretation)
  text: string;
  gloss?: string; // The sign language gloss representation
  timestamp: Date;
}

export interface SignConfig {
  modelUrl: string;
}

export enum ConnectionStatus {
  DISCONNECTED,
  CONNECTING,
  CONNECTED,
  ERROR
}
