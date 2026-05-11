"use client";

interface QuestionNavProps {
  totalQuestions: number;
  currentIndex: number;
  answers: Record<string, number>;
  questions: { id: string }[];
  onNavigate: (index: number) => void;
}

export function QuestionNav({ totalQuestions, currentIndex, answers, questions, onNavigate }: QuestionNavProps) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-foreground mb-4">Navigasi Soal</h3>
      <div className="grid grid-cols-5 sm:grid-cols-4 md:grid-cols-5 gap-2">
        {Array.from({ length: totalQuestions }).map((_, idx) => {
          const qId = questions[idx]?.id;
          const isAnswered = answers[qId] !== undefined;
          const isActive = currentIndex === idx;

          let baseClass = "w-full aspect-square flex items-center justify-center rounded-lg font-bold text-sm transition-all ";
          
          if (isActive) {
            baseClass += "bg-primary text-white ring-2 ring-primary ring-offset-2 ring-offset-background";
          } else if (isAnswered) {
            baseClass += "bg-green-500/20 text-green-700 border border-green-500/30 hover:bg-green-500/30";
          } else {
            baseClass += "bg-background border border-border text-foreground/70 hover:border-primary/50";
          }

          return (
            <button
              key={idx}
              onClick={() => onNavigate(idx)}
              className={baseClass}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
      
      <div className="mt-6 flex flex-col gap-2 text-sm text-foreground/70">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500/20 border border-green-500/30"></div>
          <span>Sudah Dijawab</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-background border border-border"></div>
          <span>Belum Dijawab</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary"></div>
          <span>Posisi Saat Ini</span>
        </div>
      </div>
    </div>
  );
}
