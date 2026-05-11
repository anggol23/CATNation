export interface User {
  uid: string;
  name: string;
  email: string;
  premium: boolean;
  createdAt: any; // Firebase Timestamp
}

export interface Question {
  id?: string;
  category: "TIU" | "TWK" | "TKP";
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface Result {
  id?: string;
  userId: string;
  score: number;
  correct: number;
  wrong: number;
  createdAt: any; // Firebase Timestamp
}

export interface Payment {
  id?: string;
  userId: string;
  amount: number;
  status: "paid" | "pending" | "refund";
  method: string;
}

export interface BlogPost {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  author: string;
  createdAt: string;
}

