import React, { useState } from "react";
import { 
  Trophy, Award, RefreshCw, ChevronRight, CheckCircle2, XCircle, 
  HelpCircle, BookOpen, Brain, Play
} from "lucide-react";
import { QuizQuestion } from "../types";
import { audioService } from "../utils/audioService";

interface QuizArenaProps {
  onQuizCompleted: (score: number, topic: string) => void;
}

const TOPICS = [
  { id: "superposition", name: "Superposition", icon: "⚛" },
  { id: "duality", name: "Wave-Particle Duality", icon: "🌊" },
  { id: "entanglement", name: "Entanglement", icon: "🔗" }
];

const DIFFICULTIES = ["beginner", "intermediate", "advanced"];

export default function QuizArena({ onQuizCompleted }: QuizArenaProps) {
  const [selectedTopic, setSelectedTopic] = useState("superposition");
  const [selectedDifficulty, setSelectedDifficulty] = useState("beginner");

  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Generate quiz via backend API (which calls Gemini or fallbacks elegantly)
  const generateQuiz = async () => {
    setIsLoading(true);
    setQuestions([]);
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizFinished(false);

    try {
      const response = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: selectedTopic,
          difficulty: selectedDifficulty
        })
      });
      const data = await response.json();
      if (data && data.questions) {
        setQuestions(data.questions);
      } else {
        setQuestions([]);
      }
    } catch (error) {
      console.error("Quiz generation error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    setIsAnswerSubmitted(true);
    if (selectedAnswer === questions[currentIdx].correctIndex) {
      setScore((prev) => prev + 1);
      audioService.playNotification("success");
    } else {
      audioService.playNotification("warning");
    }
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    audioService.playClick("tap");
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setQuizFinished(true);
      const percentageScore = Math.round((score / questions.length) * 100);
      onQuizCompleted(percentageScore, selectedTopic);
      audioService.playCalibration("database");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 text-left animate-fade-in">
      {/* Quiz selection dashboard */}
      {questions.length === 0 && !isLoading && (
        <div className="rounded-xl glass-panel border border-white/5 p-6 md:p-8 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-glow/10 to-violet-glow/5 rounded-full blur-3xl -z-10"></div>
          
          <div className="border-b border-white/5 pb-4">
            <h2 className="text-2xl font-display font-bold text-white flex items-center">
              <Trophy className="w-6 h-6 text-cyan-glow mr-3" /> Quantum Quiz Arena
            </h2>
            <p className="text-xs text-slate-400">Join the arena, take adaptive quizzes powered by our AI Physics engine, and unlock real scientific badges</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Topic Select */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-300 uppercase tracking-widest block">Choose Topic</label>
              <div className="grid grid-cols-1 gap-2.5">
                {TOPICS.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => {
                      setSelectedTopic(topic.id);
                      audioService.playClick("tap");
                    }}
                    onMouseEnter={() => {
                      audioService.playHover("tick");
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all flex items-center space-x-3 text-xs ${selectedTopic === topic.id ? "bg-gradient-to-r from-cyan-950/40 to-violet-950/20 border-cyan-glow/40 shadow-sm" : "border-white/5 hover:bg-white/5"}`}
                  >
                    <span className="text-lg">{topic.icon}</span>
                    <div>
                      <span className="font-semibold text-white block">{topic.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Select */}
            <div className="space-y-3 flex flex-col justify-between">
              <div>
                <label className="text-xs font-mono text-slate-300 uppercase tracking-widest block mb-2">Difficulty Scale</label>
                <div className="flex bg-slate-900 p-0.5 rounded border border-slate-850">
                  {DIFFICULTIES.map((diff) => (
                    <button
                      key={diff}
                      onClick={() => {
                        setSelectedDifficulty(diff);
                        audioService.playClick("tap");
                      }}
                      onMouseEnter={() => {
                        audioService.playHover("tick");
                      }}
                      className={`flex-1 py-1.5 rounded text-xs font-mono capitalize transition-all ${selectedDifficulty === diff ? "bg-cyan-glow text-slate-950 font-bold" : "text-slate-400 hover:text-white"}`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Enter Button */}
              <button
                onClick={() => {
                  generateQuiz();
                  audioService.playHyperdriveCharging();
                }}
                onMouseEnter={() => {
                  audioService.playHover("tick");
                }}
                className="w-full py-3 rounded bg-gradient-to-r from-cyan-glow to-quantum-blue hover:opacity-90 transition-all font-mono text-xs font-bold text-slate-950 shadow-md hover:shadow-[0_0_20px_rgba(0,243,255,0.25)] flex items-center justify-center space-x-2"
              >
                <Play className="w-3.5 h-3.5 fill-slate-950" />
                <span>GENERATE ARENA CHALLENGE</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="rounded-xl glass-panel border border-white/5 p-12 text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-cyan-glow animate-spin mx-auto" />
          <h3 className="font-mono text-xs text-slate-300">ENGAGING QUANTUM PROBABILITIES</h3>
          <p className="text-[11px] text-slate-500 max-w-sm mx-auto">AI Physics Core is compiling 3 scientifically accurate multiple-choice questions matching your requested parameters...</p>
        </div>
      )}

      {/* Active Quiz steps */}
      {questions.length > 0 && !quizFinished && (
        <div className="rounded-xl glass-panel border border-white/5 p-6 md:p-8 space-y-6">
          {/* Progress Header */}
          <div className="flex justify-between items-center border-b border-white/5 pb-3">
            <span className="text-xs font-mono text-cyan-glow uppercase tracking-wider">
              ARENA QUESTION {currentIdx + 1} OF {questions.length}
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              Topic: <span className="text-white capitalize">{selectedTopic}</span> | Difficulty: <span className="text-white capitalize">{selectedDifficulty}</span>
            </span>
          </div>

          {/* Question Text */}
          <h3 className="text-base font-semibold text-white leading-relaxed">
            {questions[currentIdx].question}
          </h3>

          {/* Options list */}
          <div className="grid grid-cols-1 gap-2.5">
            {questions[currentIdx].options.map((opt, oIdx) => {
              const isSelected = selectedAnswer === oIdx;
              const isCorrect = oIdx === questions[currentIdx].correctIndex;
              const isWrong = isSelected && !isCorrect;

              let buttonStyle = "border-white/5 hover:bg-white/5";
              if (isSelected && !isAnswerSubmitted) {
                buttonStyle = "bg-cyan-950/30 border-cyan-glow/40 text-white";
              } else if (isAnswerSubmitted) {
                if (isCorrect) {
                  buttonStyle = "bg-emerald-950/30 border-emerald-500/50 text-emerald-400";
                } else if (isWrong) {
                  buttonStyle = "bg-red-950/30 border-red-500/50 text-red-400";
                } else {
                  buttonStyle = "border-white/5 opacity-60";
                }
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => {
                    if (!isAnswerSubmitted) {
                      setSelectedAnswer(oIdx);
                      audioService.playPressed("low");
                    }
                  }}
                  onMouseEnter={() => {
                    if (!isAnswerSubmitted) {
                      audioService.playHover("tick");
                    }
                  }}
                  disabled={isAnswerSubmitted}
                  className={`w-full text-left p-3.5 rounded-lg border text-xs transition-all flex items-start space-x-3 leading-relaxed ${buttonStyle}`}
                >
                  <span className="font-mono text-slate-500 select-none">{String.fromCharCode(65 + oIdx)}.</span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Action buttons / Submits */}
          <div className="flex justify-end pt-4 border-t border-white/5">
            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswer === null}
                onMouseEnter={() => {
                  if (selectedAnswer !== null) {
                    audioService.playHover("tick");
                  }
                }}
                className="px-5 py-2 rounded bg-gradient-to-r from-cyan-glow to-quantum-blue text-slate-950 hover:opacity-90 font-mono text-xs font-bold transition-all disabled:opacity-50"
              >
                SUBMIT RESPONSE
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                onMouseEnter={() => {
                  audioService.playHover("tick");
                }}
                className="px-5 py-2 rounded bg-slate-900 border border-slate-700 hover:border-cyan-glow hover:text-cyan-glow font-mono text-xs text-white transition-all flex items-center space-x-1"
              >
                <span>{currentIdx + 1 < questions.length ? "NEXT QUESTION" : "REVEAL RESULTS"}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Scientific Explanations block revealed on answer submit */}
          {isAnswerSubmitted && (
            <div className={`p-5 rounded-lg border flex items-start space-x-4 ${selectedAnswer === questions[currentIdx].correctIndex ? "bg-emerald-950/20 border-emerald-500/10" : "bg-red-950/20 border-red-500/10"}`}>
              <div className="mt-0.5">
                {selectedAnswer === questions[currentIdx].correctIndex ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
              </div>
              <div className="space-y-1.5 text-left text-xs leading-relaxed">
                <h4 className="font-mono font-bold uppercase tracking-wider text-white">
                  {selectedAnswer === questions[currentIdx].correctIndex ? "RESPONSIVE COHERENCE MATCHED" : "COHERENCE FLIPPED"}
                </h4>
                <p className="text-slate-300">{questions[currentIdx].explanation}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quiz Finished Results screen */}
      {quizFinished && (
        <div className="rounded-xl glass-panel border border-white/5 p-8 text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-glow/10 to-violet-glow/5 rounded-full blur-3xl -z-10"></div>
          
          <Trophy className="w-12 h-12 text-cyan-glow mx-auto animate-bounce" />
          
          <div className="space-y-2">
            <h2 className="text-2xl font-display font-bold text-white">ARENA CHALLENGE CONCLUDED</h2>
            <p className="text-xs text-slate-400">Your quantum state collapsed to a final deterministic score.</p>
          </div>

          {/* Score percentage card */}
          <div className="bg-slate-950/60 inline-block p-6 rounded-lg border border-cyan-glow/20">
            <span className="text-slate-500 font-mono text-[10px] tracking-widest uppercase block mb-1">SCORE COLLAPSE</span>
            <div className="text-4xl font-display font-bold text-cyan-glow glow-cyan">{Math.round((score / questions.length) * 100)}%</div>
            <span className="text-[11px] font-mono text-slate-400 block mt-2">{score} out of {questions.length} correct</span>
          </div>

          {/* Unlocked Badge alert */}
          {score === questions.length && (
            <div className="bg-gradient-to-r from-cyan-950/30 to-violet-950/30 border border-cyan-glow/30 p-4 rounded-lg max-w-md mx-auto flex items-start space-x-4 text-left">
              <Award className="w-8 h-8 text-cyan-glow shrink-0 mt-0.5 animate-pulse" />
              <div>
                <span className="text-[9px] font-mono text-cyan-glow uppercase tracking-widest block">ACCOMPLISHMENT BADGE UNLOCKED</span>
                <span className="font-semibold text-white text-sm block mt-0.5">
                  {selectedTopic === "superposition" ? "Superposition Sovereign" : selectedTopic === "duality" ? "Duality Overlord" : "Entanglement Sage"}
                </span>
                <p className="text-slate-400 text-[10px] leading-relaxed mt-1">
                  You scored 100% on a quantum topic, proving conceptual coherence of subatomic anomalies. This badge will persist on your main lab dashboard.
                </p>
              </div>
            </div>
          )}

          <div className="flex justify-center space-x-3 pt-4 border-t border-white/5">
            <button
              onClick={() => {
                generateQuiz();
                audioService.playHyperdriveCharging();
              }}
              onMouseEnter={() => {
                audioService.playHover("tick");
              }}
              className="px-5 py-2.5 rounded bg-gradient-to-r from-cyan-glow to-quantum-blue hover:opacity-90 text-slate-950 font-mono text-xs font-bold transition-all shadow-md"
            >
              CHALLENGE AGAIN
            </button>
            <button
              onClick={() => {
                setQuestions([]);
                setQuizFinished(false);
                audioService.playClick("confirm");
              }}
              onMouseEnter={() => {
                audioService.playHover("tick");
              }}
              className="px-5 py-2.5 rounded bg-slate-900 border border-slate-700 hover:border-cyan-glow text-slate-300 font-mono text-xs transition-all"
            >
              EXIT ARENA
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
