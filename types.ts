
export type Branch = 'booking' | 'gift' | 'question' | 'idle' | 'admin';

export enum TariffType {
  STANDARD = 'СТАНДАРТ',
  PRO = 'PRO',
  VIP = 'VIP'
}

export type RequestStatus = 
  | 'new' 
  | 'seen' 
  | 'replied' 
  | 'ongoing' 
  | 'success' 
  | 'ended';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'admin' | 'user';
  timestamp: string;
}

export interface BaseLead {
  id: string;
  createdAt: string;
  status: RequestStatus;
  userName: string;
  telegramUsername: string;
  phone: string;
  chatId?: number;
  chatHistory: ChatMessage[];
}

export interface BookingLead extends BaseLead {
  type: 'booking';
  tariff: TariffType;
  styles: string[];
  references: string;
  preferredTime: string;
}

export interface GiftLead extends BaseLead {
  type: 'gift';
  recipientName: string;
  recipientAge: string;
  recipientTelegram: string;
  tariff: string;
}

export interface QuestionLead extends BaseLead {
  type: 'question';
  question: string;
}

export type Lead = BookingLead | GiftLead | QuestionLead;

export interface ReferenceItem {
  url: string;
  comment: string;
}

export interface BookingData {
  tariff: TariffType | null;
  styles: string[];
  references: string;
  references_list: ReferenceItem[];
  preferredTime: string;
  userName: string;
  telegramUsername: string;
  phone: string;
  comment: string;
  customEthnic?: string;
  chatId?: number;
}

export interface GiftData {
  forWhom: string;
  recipientName: string;
  recipientAge: string;
  recipientTelegram: string;
  tariff: string;
  isBeautiful: boolean;
  userName: string;
  telegramUsername: string;
  phone: string;
  chatId?: number;
}

export interface QuestionData {
  text: string;
  userName: string;
  telegramUsername: string;
  phone: string;
  chatId?: number;
}

export interface QuizState {
  step: number;
  answers: {
    purpose: string;
    vibe: string;
    volume: string;
  };
}

export interface StyleItem {
  id: string;
  name: string;
  description: string;
  images?: string[];
}

export interface StyleCategory {
  title: string;
  description: string;
  items: StyleItem[];
}
