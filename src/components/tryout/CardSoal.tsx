"use client";

import { Question } from "@/types";
import { motion } from "framer-motion";

interface CardSoalProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  selectedOption?: number;
  onSelectOption: (optionIndex: number) => void;
}

export function CardSoal({ question, currentIndex, totalQuestions, selectedOption, onSelectOption }: CardSoalProps) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm font-bold">
          {question.category}
        </span>
        <span className="text-foreground/60 text-sm font-medium">
          Soal {currentIndex + 1} dari {totalQuestions}
        </span>
      </div>

      <div className="text-lg text-foreground mb-8 leading-relaxed">
        {question.question}
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedOption === index;
          const letter = String.fromCharCode(65 + index); // A, B, C, D, E

          return (
            <motion.button
              key={index}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => onSelectOption(index)}
              className={`w-full flex items-center p-4 rounded-xl border text-left transition-all ${
                isSelected 
                  ? "border-primary bg-primary/5 text-primary" 
                  : "border-border hover:border-primary/50 text-foreground"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-4 shrink-0 font-bold ${
                isSelected ? "bg-primary text-white" : "bg-foreground/5 text-foreground/70"
              }`}>
                {letter}
              </div>
              <span className="flex-1">{option}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
