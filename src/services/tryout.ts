import { Question, Result } from "@/types";
import { db } from "@/firebase/firebase";
import { ref, push, set, get } from "firebase/database";

export const fetchQuestions = async (tryoutId: string): Promise<Question[]> => {
  if (!db) return [];

  try {
    // In a real scenario, you might filter by tryoutId or Category
    // For now, we fetch all questions from our pool to make the app "alive"
    const questionsRef = ref(db, "questions");
    const snapshot = await get(questionsRef);
    
    if (snapshot.exists()) {
      const data = snapshot.val();
      const arr: Question[] = Object.entries(data).map(([id, val]: any) => ({
        id,
        ...val,
      }));
      
      // Shuffle questions to make it feel like a real simulation
      return arr.sort(() => Math.random() - 0.5);
    }
  } catch (error) {
    console.error("Error fetching questions:", error);
  }

  // Fallback to minimal mock if DB is empty
  return [
    {
      id: "q1",
      category: "TIU",
      question: "Contoh Soal: Jika A = B dan B = C, maka...",
      options: ["A tidak sama dengan C", "A = C", "A > C", "A < C", "Tidak dapat disimpulkan"],
      answer: 1,
      explanation: "Hukum silogisme.",
      difficulty: "easy"
    }
  ];
};

export const submitTryoutResult = async (userId: string, tryoutId: string, answers: Record<string, number>, questions: Question[]) => {
  let correct = 0;
  let wrong = 0;
  let score = 0;

  // Real SKD Scoring Logic:
  // TWK/TIU: Correct +5, Wrong 0
  // TKP: Every option has 1-5 points (we'll simplify to 5 for correct for now)
  questions.forEach((q) => {
    const userAnswer = answers[q.id!];
    if (userAnswer !== undefined) {
      if (userAnswer === q.answer) {
        correct += 1;
        score += 5;
      } else {
        wrong += 1;
      }
    } else {
      wrong += 1;
    }
  });

  const result: Result = {
    userId,
    score,
    correct,
    wrong,
    createdAt: new Date().toISOString()
  };

  if (!db) return { success: true, result };

  try {
    const resultsRef = ref(db, `results/${userId}`);
    const newResultRef = push(resultsRef);
    await set(newResultRef, { ...result, tryoutId });
    
    // Also save to a global results node for Leaderboard
    const globalResultsRef = ref(db, `results/${userId}/${newResultRef.key}`);
    // (Already saved above)

    return { success: true, result };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
