"use client";

import { useEffect, useState } from "react";
import { db } from "@/firebase/firebase";
import { ref, push, get, remove, update } from "firebase/database";
import { Question } from "@/types";
import { Loader2, Plus, Edit, Trash2, X, Save, ChevronDown, UploadCloud } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { BulkImportModal } from "@/components/admin/BulkImportModal";

const EMPTY_FORM = {
  category: "TWK" as "TWK" | "TIU" | "TKP",
  question: "",
  options: ["", "", "", "", ""],
  answer: 0,
  explanation: "",
  difficulty: "medium" as "easy" | "medium" | "hard",
};

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [filterCategory, setFilterCategory] = useState<string>("all");

  useEffect(() => { fetchQuestions(); }, []);

  const fetchQuestions = async () => {
    setLoading(true);
    if (!db) { setLoading(false); return; }
    try {
      const snap = await get(ref(db, "questions"));
      if (snap.exists()) {
        const data = snap.val();
        const arr: Question[] = Object.entries(data).map(([id, val]: any) => ({ id, ...val }));
        arr.sort((a, b) => (a.category > b.category ? 1 : -1));
        setQuestions(arr);
      } else {
        setQuestions([]);
      }
    } catch (err) {
      console.error("Gagal fetch soal:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.options.some(o => !o.trim())) {
      alert("Semua pilihan jawaban harus diisi.");
      return;
    }
    setSubmitting(true);
    try {
      const payload = { ...form };
      if (editingId) {
        await update(ref(db, `questions/${editingId}`), payload);
      } else {
        await push(ref(db, "questions"), payload);
      }
      resetForm();
      fetchQuestions();
    } catch (err) {
      console.error("Error saving question:", err);
      alert("Gagal menyimpan soal.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (q: Question) => {
    setForm({
      category: q.category,
      question: q.question,
      options: [...q.options],
      answer: q.answer,
      explanation: q.explanation,
      difficulty: q.difficulty,
    });
    setEditingId(q.id!);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus soal ini?")) return;
    try {
      await remove(ref(db, `questions/${id}`));
      fetchQuestions();
    } catch (err) {
      alert("Gagal menghapus soal.");
    }
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowForm(false);
  };

  const setOption = (idx: number, val: string) => {
    const opts = [...form.options];
    opts[idx] = val;
    setForm(f => ({ ...f, options: opts }));
  };

  const filtered = filterCategory === "all"
    ? questions
    : questions.filter(q => q.category === filterCategory);

  const categoryColor: Record<string, string> = {
    TWK: "bg-blue-500/10 text-blue-600",
    TIU: "bg-purple-500/10 text-purple-600",
    TKP: "bg-green-500/10 text-green-600",
  };
  const diffColor: Record<string, string> = {
    easy: "text-green-500",
    medium: "text-yellow-500",
    hard: "text-red-500",
  };

  return (
    <div className="space-y-8">
      {/* Bulk Modal */}
      <BulkImportModal 
        isOpen={showBulkModal} 
        onClose={() => setShowBulkModal(false)} 
        onSuccess={fetchQuestions}
      />

      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Bank Soal</h1>
          <p className="text-foreground/60 mt-1">{questions.length} soal tersimpan di database</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowBulkModal(true)}
            className="flex items-center gap-2 bg-surface border border-border px-5 py-2.5 rounded-xl font-bold hover:bg-surface-hover transition-colors"
          >
            <UploadCloud className="w-5 h-5 text-primary" /> Bulk Upload
          </button>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold hover:bg-primary-dark transition-colors shadow-md shadow-primary/20"
          >
            <Plus className="w-5 h-5" /> Tambah Soal
          </button>
        </div>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-surface border border-border rounded-2xl p-6 shadow-sm"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingId ? "Edit Soal" : "Tambah Soal Baru"}</h2>
              <button onClick={resetForm} className="p-2 text-foreground/50 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              {/* Category, Difficulty */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Kategori</label>
                  <select
                    value={form.category}
                    onChange={e => setForm(f => ({ ...f, category: e.target.value as any }))}
                    className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="TWK">TWK — Tes Wawasan Kebangsaan</option>
                    <option value="TIU">TIU — Tes Intelegensia Umum</option>
                    <option value="TKP">TKP — Tes Karakteristik Pribadi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Tingkat Kesulitan</label>
                  <select
                    value={form.difficulty}
                    onChange={e => setForm(f => ({ ...f, difficulty: e.target.value as any }))}
                    className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="easy">Mudah</option>
                    <option value="medium">Sedang</option>
                    <option value="hard">Sulit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5">Kunci Jawaban</label>
                  <select
                    value={form.answer}
                    onChange={e => setForm(f => ({ ...f, answer: parseInt(e.target.value) }))}
                    className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none"
                  >
                    {["A", "B", "C", "D", "E"].map((l, i) => (
                      <option key={i} value={i}>Pilihan {l}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Question */}
              <div>
                <label className="block text-sm font-semibold mb-1.5">Pertanyaan</label>
                <textarea
                  required
                  rows={3}
                  value={form.question}
                  onChange={e => setForm(f => ({ ...f, question: e.target.value }))}
                  placeholder="Tulis pertanyaan di sini..."
                  className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none resize-none"
                />
              </div>

              {/* Options */}
              <div>
                <label className="block text-sm font-semibold mb-2">Pilihan Jawaban</label>
                <div className="space-y-2">
                  {form.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 ${
                        form.answer === idx ? "bg-primary text-white" : "bg-foreground/10 text-foreground/60"
                      }`}>
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <input
                        required
                        type="text"
                        value={opt}
                        onChange={e => setOption(idx, e.target.value)}
                        placeholder={`Pilihan ${String.fromCharCode(65 + idx)}...`}
                        className="flex-1 p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Explanation */}
              <div>
                <label className="block text-sm font-semibold mb-1.5">Pembahasan / Penjelasan</label>
                <textarea
                  required
                  rows={3}
                  value={form.explanation}
                  onChange={e => setForm(f => ({ ...f, explanation: e.target.value }))}
                  placeholder="Tulis pembahasan jawaban yang benar..."
                  className="w-full p-3 rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary outline-none resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors disabled:opacity-50"
                >
                  {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  {editingId ? "Simpan Perubahan" : "Simpan Soal"}
                </button>
                <button type="button" onClick={resetForm} className="px-6 py-3 rounded-xl border border-border text-foreground/70 hover:bg-surface-hover transition-colors font-medium">
                  Batal
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        {["all", "TWK", "TIU", "TKP"].map(cat => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
              filterCategory === cat
                ? "bg-primary text-white border-primary"
                : "bg-surface border-border text-foreground/70 hover:border-primary/50"
            }`}
          >
            {cat === "all" ? "Semua" : cat}
            {cat !== "all" && <span className="ml-1 opacity-70">({questions.filter(q => q.category === cat).length})</span>}
          </button>
        ))}
      </div>

      {/* Question List */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-16 flex justify-center">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-foreground/50">
            <p className="font-medium">Belum ada soal.</p>
            <p className="text-sm mt-1">Klik "Tambah Soal" untuk menambahkan soal pertama.</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((q, idx) => (
              <div key={q.id} className="p-4 hover:bg-background/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${categoryColor[q.category]}`}>{q.category}</span>
                      <span className={`text-xs font-semibold capitalize ${diffColor[q.difficulty]}`}>{q.difficulty}</span>
                      <span className="text-xs text-foreground/40">#{idx + 1}</span>
                    </div>
                    <p className="text-sm font-medium text-foreground line-clamp-2">{q.question}</p>
                    <p className="text-xs text-foreground/50 mt-1">
                      ✓ Kunci: <span className="font-bold text-primary">{String.fromCharCode(65 + q.answer)}. {q.options[q.answer]}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleEdit(q)}
                      className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(q.id!)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Hapus"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
