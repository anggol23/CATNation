"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { fetchQuestions, submitTryoutResult } from "@/services/tryout";
import { Question } from "@/types";
import { Timer } from "@/components/tryout/Timer";
import { CardSoal } from "@/components/tryout/CardSoal";
import { QuestionNav } from "@/components/tryout/QuestionNav";
import { Loader2, AlertTriangle, Maximize, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

export default function TryoutEngine() {
  const { id } = useParams() as { id: string };
  const { user } = useAuth();
  const router = useRouter();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [cheatWarnings, setCheatWarnings] = useState(0);

  // Initialize
  useEffect(() => {
    const loadData = async () => {
      const data = await fetchQuestions(id);
      setQuestions(data);
      setLoading(false);
    };
    loadData();
  }, [id]);

  // Anti-Cheat: Fullscreen & Tab Switch
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setCheatWarnings((prev) => prev + 1);
        alert("PERINGATAN: Anda terdeteksi berpindah tab/jendela. Jika terlalu sering, tryout akan dihentikan otomatis.");
      }
    };
    
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleCopy = (e: ClipboardEvent) => e.preventDefault();

    document.addEventListener("visibilitychange", handleVisibilityChange);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(err => console.log(err));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(err => console.log(err));
      }
    }
  };

  const handleSelectOption = (optionIndex: number) => {
    const currentQ = questions[currentIndex];
    setAnswers((prev) => ({
      ...prev,
      [currentQ.id!]: optionIndex,
    }));
    // Auto-save simulation
    console.log("Auto-saving...");
  };

  const handleSubmit = useCallback(async () => {
    if (!user) return;
    setSubmitting(true);
    
    // Auto exit fullscreen if any
    if (document.fullscreenElement) document.exitFullscreen();

    const res = await submitTryoutResult(user.uid, id, answers, questions);
    if (res.success) {
      router.push(`/dashboard/tryout/${id}/result?score=${res.result?.score}&correct=${res.result?.correct}&wrong=${res.result?.wrong}`);
    } else {
      alert("Gagal submit hasil. " + res.error);
      setSubmitting(false);
    }
  }, [user, id, answers, questions, router]);

  if (loading) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-foreground/60">Menyiapkan soal ujian...</p>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-center gap-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            <h1 className="font-bold text-foreground">Simulasi CAT - {id}</h1>
            <p className="text-sm text-foreground/60">{questions.length} Soal</p>
          </div>
          {cheatWarnings > 0 && (
            <div className="bg-red-500/10 text-red-500 px-3 py-1 rounded-lg text-sm font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Peringatan: {cheatWarnings}
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <Timer initialSeconds={60 * 90} onTimeUp={handleSubmit} />
          
          <button 
            onClick={toggleFullscreen}
            className="p-2 bg-background border border-border rounded-lg text-foreground/70 hover:text-primary transition-colors hidden sm:block"
            title="Fullscreen"
          >
            <Maximize className="w-5 h-5" />
          </button>

          <button 
            onClick={() => {
              if (confirm("Apakah Anda yakin ingin menyelesaikan tryout ini? Waktu masih tersisa.")) {
                handleSubmit();
              }
            }}
            disabled={submitting}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            Selesai
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        {/* Main Question Area */}
        <div className="lg:col-span-2 space-y-6">
          <CardSoal 
            question={currentQ}
            currentIndex={currentIndex}
            totalQuestions={questions.length}
            selectedOption={answers[currentQ.id!]}
            onSelectOption={handleSelectOption}
          />

          <div className="flex justify-between items-center">
            <button
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-6 py-3 bg-surface border border-border rounded-xl font-medium flex items-center gap-2 disabled:opacity-50 hover:bg-surface-hover transition-colors"
            >
              <ArrowLeft className="w-5 h-5" /> Sebelumnya
            </button>
            <button
              onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
              disabled={currentIndex === questions.length - 1}
              className="px-6 py-3 bg-primary text-white rounded-xl font-medium flex items-center gap-2 disabled:opacity-50 hover:bg-primary-dark transition-colors shadow-lg"
            >
              Selanjutnya <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 lg:sticky lg:top-24">
          <QuestionNav 
            totalQuestions={questions.length}
            currentIndex={currentIndex}
            answers={answers}
            questions={questions.map(q => ({ id: q.id! }))}
            onNavigate={setCurrentIndex}
          />
        </div>
      </div>
    </div>
  );
}
