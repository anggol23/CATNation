"use client";

import { useState, useRef } from "react";
import { X, FileText, FileSpreadsheet, File as FileIcon, Upload, Loader2, CheckCircle2, AlertCircle, Save, Download, HelpCircle, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as XLSX from "xlsx";
import { db } from "@/firebase/firebase";
import { ref, push } from "firebase/database";
import { Question } from "@/types";

// PDFjs configuration
import * as pdfjsLib from "pdfjs-dist";
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Tab = "excel" | "pdf" | "text";

export function BulkImportModal({ isOpen, onClose, onSuccess }: BulkImportModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("excel");
  const [loading, setLoading] = useState(false);
  const [parsedQuestions, setParsedQuestions] = useState<Question[]>([]);
  const [rawText, setRawText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [showGuide, setShowGuide] = useState(true);

  if (!isOpen) return null;

  const downloadTemplate = () => {
    const data = [
      {
        Kategori: "TWK",
        Pertanyaan: "Apa ibu kota Indonesia saat ini?",
        A: "Jakarta",
        B: "Bandung",
        C: "Surabaya",
        D: "Medan",
        E: "Makassar",
        Jawaban: "A",
        Penjelasan: "Jakarta adalah pusat pemerintahan RI.",
        Kesulitan: "Easy"
      },
      {
        Kategori: "TIU",
        Pertanyaan: "15 + 25 = ...",
        A: "30",
        B: "35",
        C: "40",
        D: "45",
        E: "50",
        Jawaban: "C",
        Penjelasan: "Hasil penjumlahan dasar.",
        Kesulitan: "Easy"
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Template Soal");
    XLSX.writeFile(workbook, "Template_Bulk_Upload_CATNation.xlsx");
  };

  const handleExcelUpload = async (file: File) => {
    setLoading(true);
    setStatus(null);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

      const mapped: Question[] = jsonData.map((row) => ({
        category: (row.Kategori || row.category || "TWK") as any,
        question: String(row.Pertanyaan || row.question || ""),
        options: [
          String(row.A || row.option_a || ""),
          String(row.B || row.option_b || ""),
          String(row.C || row.option_c || ""),
          String(row.D || row.option_d || ""),
          String(row.E || row.option_e || ""),
        ].filter(o => o.trim() !== ""),
        answer: parseAnswer(row.Jawaban || row.answer),
        explanation: String(row.Penjelasan || row.explanation || ""),
        difficulty: String(row.Kesulitan || row.difficulty || "medium").toLowerCase() as any,
      })).filter(q => q.question && q.options.length >= 2);

      setParsedQuestions(mapped);
      if (mapped.length === 0) setStatus({ type: "error", message: "Tidak ada soal valid yang ditemukan di file Excel." });
      else setShowGuide(false);
    } catch (error) {
      console.error(error);
      setStatus({ type: "error", message: "Gagal membaca file Excel." });
    } finally {
      setLoading(false);
    }
  };

  const handlePdfUpload = async (file: File) => {
    setLoading(true);
    setStatus(null);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(" ");
        fullText += pageText + "\n";
      }

      parseRawText(fullText);
    } catch (error) {
      console.error(error);
      setStatus({ type: "error", message: "Gagal membaca file PDF." });
    } finally {
      setLoading(false);
    }
  };

  const parseRawText = (text: string) => {
    const questions: Question[] = [];
    
    // Split by numbers like 1. or 1) or No. 1
    const blocks = text.split(/(?:\r?\n|^)(?:No\.?\s*)?\d+[\.\)]/i);
    
    blocks.forEach((block, idx) => {
      if (!block.trim()) return;
      
      // Find options a. b. c. d. e. (case insensitive)
      const optMatch = block.match(/[a-e][\.\)]\s*([^\n]+)/gi);
      if (!optMatch) return;

      const questionText = block.split(/[a-e][\.\)]/i)[0].trim();
      const options: string[] = optMatch.map(opt => opt.replace(/[a-e][\.\)]\s*/i, "").trim());

      let answer = 0;
      // More flexible answer matching (supports "jawaban A", "jawaban: A", "Kunci: A", etc.)
      const keyMatch = block.match(/(?:Kunci|Jawaban|Key|Ans|jawaban)(?::|\s+)([a-e])/i);
      if (keyMatch) {
        answer = keyMatch[1].toUpperCase().charCodeAt(0) - 65;
      }

      let explanation = "";
      const expMatch = block.match(/(?:Penjelasan|Pembahasan|Exp):\s*([\s\S]+)/i);
      if (expMatch) explanation = expMatch[1].trim();

      if (questionText && options.length >= 2) {
        questions.push({
          category: "TWK", // Default, user can edit later
          question: questionText,
          options,
          answer,
          explanation: explanation || "Pembahasan otomatis",
          difficulty: "medium",
        });
      }
    });

    setParsedQuestions(questions);
    if (questions.length === 0) {
      setStatus({ type: "error", message: "Format tidak dikenali. Pastikan ada nomor soal dan pilihan A-E." });
    } else {
      setShowGuide(false);
    }
  };

  const parseAnswer = (val: any): number => {
    if (typeof val === "number") return val;
    if (typeof val === "string") {
      const v = val.trim().toUpperCase();
      if (v.length === 1 && v >= "A" && v <= "E") return v.charCodeAt(0) - 65;
      return (parseInt(v) - 1) || 0; // handle 1-indexed number
    }
    return 0;
  };

  const handleImport = async () => {
    if (parsedQuestions.length === 0) return;
    setLoading(true);
    try {
      const qRef = ref(db, "questions");
      const promises = parsedQuestions.map(q => push(qRef, q));
      await Promise.all(promises);
      setStatus({ type: "success", message: `Berhasil mengimpor ${parsedQuestions.length} soal!` });
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (error) {
      setStatus({ type: "error", message: "Gagal menyimpan ke database." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-surface border border-border w-full max-w-5xl max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-8 border-b border-border flex justify-between items-start bg-background/50">
          <div>
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
              <Upload className="w-8 h-8 text-primary" />
              Bulk Import Soal
            </h2>
            <p className="text-foreground/60 mt-2 font-medium">Unggah ratusan soal sekaligus dengan satu klik.</p>
          </div>
          <button onClick={onClose} className="p-3 bg-foreground/5 hover:bg-red-500/10 hover:text-red-500 rounded-2xl transition-all">
            <X className="w-7 h-7" />
          </button>
        </div>

        {/* Tabs & Guide Toggle */}
        <div className="flex items-center justify-between border-b border-border bg-background/30 px-6">
          <div className="flex">
            {(["excel", "pdf", "text"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => { setActiveTab(tab); setParsedQuestions([]); setStatus(null); }}
                className={`px-8 py-5 text-sm font-bold capitalize flex items-center gap-2 transition-all border-b-2 ${
                  activeTab === tab 
                  ? "border-primary text-primary bg-primary/5" 
                  : "border-transparent text-foreground/50 hover:text-foreground hover:bg-foreground/5"
                }`}
              >
                {tab === "excel" && <FileSpreadsheet className="w-4 h-4" />}
                {tab === "pdf" && <FileIcon className="w-4 h-4" />}
                {tab === "text" && <FileText className="w-4 h-4" />}
                {tab}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setShowGuide(!showGuide)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              showGuide ? "bg-primary text-white" : "bg-foreground/5 text-foreground/60 hover:bg-foreground/10"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            {showGuide ? "Sembunyikan Panduan" : "Lihat Panduan"}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Guide Section */}
          <AnimatePresence>
            {showGuide && parsedQuestions.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-primary/5 border border-primary/20 rounded-3xl p-6"
              >
                <h4 className="font-bold text-primary mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Format yang Disarankan ({activeTab.toUpperCase()})
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    {activeTab === "excel" ? (
                      <>
                        <p className="text-sm text-foreground/70 leading-relaxed">Gunakan file Excel dengan header yang tepat untuk hasil terbaik.</p>
                        <button 
                          onClick={downloadTemplate}
                          className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary/20 transition-all mt-2"
                        >
                          <Download className="w-4 h-4" /> Download Template .xlsx
                        </button>
                      </>
                    ) : activeTab === "pdf" ? (
                      <p className="text-sm text-foreground/70 leading-relaxed">
                        Pastikan PDF berisi teks (bukan scan gambar). Format soal harus diawali angka (1. 2.) dan pilihan A-E.
                      </p>
                    ) : (
                      <p className="text-sm text-foreground/70 leading-relaxed">
                        Pisahkan soal dengan angka. Gunakan label "Kunci:" untuk menentukan jawaban benar.
                      </p>
                    )}
                  </div>
                  <div className="bg-background/50 rounded-2xl p-4 font-mono text-[11px] text-foreground/60 border border-border">
                    {activeTab === "excel" ? (
                      "Kolom: Kategori, Pertanyaan, A, B, C, D, E, Jawaban, Penjelasan, Kesulitan"
                    ) : (
                      <>
                        1. Apa singkatan dari CAT?<br/>
                        a. Computer Assisted Test<br/>
                        b. Computer Answer Tool<br/>
                        c. ...<br/>
                        d. ...<br/>
                        e. ...<br/><br/>
                        jawaban a<br/>
                        pembahasan: CAT adalah sistem seleksi...
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status Message */}
          <AnimatePresence>
            {status && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className={`p-5 rounded-2xl flex items-center gap-3 ${
                  status.type === "success" ? "bg-green-500/10 text-green-600 border border-green-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"
                }`}
              >
                {status.type === "success" ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                <span className="font-bold">{status.message}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upload Area */}
          {parsedQuestions.length === 0 && !loading && (
            <div className="space-y-4">
              {activeTab !== "text" ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-[2.5rem] p-20 text-center hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-all group relative overflow-hidden"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept={activeTab === "excel" ? ".xlsx, .xls" : ".pdf"}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (activeTab === "excel") handleExcelUpload(file);
                        else handlePdfUpload(file);
                      }
                    }}
                  />
                  <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl shadow-primary/10">
                    <Upload className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-foreground">Klik atau Seret File</h3>
                  <p className="text-foreground/50 mt-2 font-medium">
                    {activeTab === "excel" ? "File Excel (.xlsx, .xls) maksimal 10MB" : "File PDF dengan teks terdeteksi"}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <textarea 
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    placeholder="Tempel soal di sini...&#10;&#10;1. Apa ibu kota RI?&#10;a. Jakarta&#10;b. IKN&#10;c. Bandung&#10;d. Surabaya&#10;e. Medan&#10;&#10;jawaban a"
                    className="w-full h-72 p-6 rounded-[2rem] border border-border bg-background focus:ring-4 focus:ring-primary/20 outline-none font-mono text-sm resize-none shadow-inner"
                  />
                  <button 
                    onClick={() => parseRawText(rawText)}
                    disabled={!rawText.trim()}
                    className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg hover:bg-primary-dark transition-all disabled:opacity-50 shadow-lg shadow-primary/30"
                  >
                    Mulai Parsing Teks
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="py-24 flex flex-col items-center justify-center gap-6">
              <div className="relative">
                <Loader2 className="w-20 h-20 text-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 bg-primary/20 rounded-full animate-ping" />
                </div>
              </div>
              <p className="text-xl font-bold text-foreground/60 animate-pulse tracking-wide">Menganalisis Soal...</p>
            </div>
          )}

          {/* Preview Area */}
          {parsedQuestions.length > 0 && !loading && (
            <div className="space-y-6">
              <div className="flex justify-between items-center bg-background/40 p-4 rounded-2xl border border-border">
                <div>
                  <h3 className="font-black text-xl text-foreground flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    {parsedQuestions.length} Soal Berhasil Dikenali
                  </h3>
                  <p className="text-xs text-foreground/50 font-medium">Klik tombol import di bawah untuk menyimpan ke database.</p>
                </div>
                <button 
                  onClick={() => setParsedQuestions([])} 
                  className="px-4 py-2 text-xs font-bold text-red-500 bg-red-500/10 rounded-xl hover:bg-red-500/20 transition-all"
                >
                  Ganti File
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {parsedQuestions.map((q, idx) => (
                  <motion.div 
                    key={idx} 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    className="p-6 bg-background/50 border border-border rounded-3xl hover:border-primary/40 transition-all group"
                  >
                    <div className="flex gap-5">
                      <span className="flex items-center justify-center w-10 h-10 rounded-2xl bg-primary/10 text-primary font-black shrink-0">
                        {idx + 1}
                      </span>
                      <div className="flex-1 space-y-4">
                        <p className="font-bold text-foreground leading-relaxed">{q.question}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {q.options.map((opt, oIdx) => (
                            <div 
                              key={oIdx} 
                              className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                                q.answer === oIdx 
                                ? "bg-green-500/10 border-green-500/30 text-green-600" 
                                : "bg-foreground/5 border-border text-foreground/40"
                              }`}
                            >
                              <span className="opacity-50">{String.fromCharCode(65 + oIdx)}.</span>
                              <span className="truncate">{opt}</span>
                              {q.answer === oIdx && <CheckCircle2 className="w-3 h-3 ml-auto" />}
                            </div>
                          ))}
                        </div>
                        {q.explanation && (
                          <div className="mt-2 p-3 bg-foreground/5 rounded-xl text-[10px] text-foreground/50 italic flex items-start gap-2">
                            <HelpCircle className="w-3 h-3 mt-0.5 shrink-0" />
                            <span>{q.explanation}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 border-t border-border bg-background/50 flex gap-4">
          <button 
            disabled={parsedQuestions.length === 0 || loading}
            onClick={handleImport}
            className="flex-[2] bg-primary text-white py-5 rounded-[1.5rem] font-black text-xl hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-primary/30 flex items-center justify-center gap-3 group"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-6 h-6 group-hover:scale-125 transition-transform" />}
            Import {parsedQuestions.length} Soal Sekarang
          </button>
          <button 
            onClick={onClose}
            className="flex-1 px-8 py-5 rounded-[1.5rem] border border-border font-bold hover:bg-foreground/5 transition-all text-foreground/60"
          >
            Batal
          </button>
        </div>
      </motion.div>
    </div>
  );
}
