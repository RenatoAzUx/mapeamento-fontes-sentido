
export interface UserInfo {
  name: string;
  email: string;
  contact: string;
}

export interface Question {
  id: number;
  dimension: string;
  source: string;
  sourceCode: string;
  question_code: string;
  text: string;
  scale_min: number;
  scale_max: number;
}

export interface Dimension {
  code: string;
  name: string;
  sources: { code: string; name: string }[];
}

export interface Scores {
  sources: Record<string, number>; // S01: 0-25
  dimensions: Record<string, number>; // D1: Soma das fontes
  globalScore: number; // 0-675
}

export interface AssessmentResult {
  userInfo: UserInfo;
  scores: Scores;
  aiFeedback?: string;
}

export enum AppState {
  WELCOME = 'WELCOME',
  INTRO = 'INTRO',
  USER_INFO = 'USER_INFO',
  ASSESSMENT = 'ASSESSMENT',
  CALCULATING = 'CALCULATING',
  RESULTS = 'RESULTS'
}
