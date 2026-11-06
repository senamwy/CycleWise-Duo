import React, { useState, useEffect } from 'react';
import { User, EducationArticle, Quiz, QuizQuestion } from '../types';
import { EDUCATION_ARTICLES, QUIZZES } from '../data/educationData';
import {
  getReadArticles,
  toggleReadArticle,
  getQuizResults,
  saveQuizResult
} from '../utils/storage';
import {
  BookOpen,
  CheckCircle,
  Clock,
  Sparkles,
  Award,
  ArrowRight,
  ShieldAlert,
  X,
  HelpCircle,
  Lightbulb,
  Check,
  RotateCcw,
  Microscope
} from 'lucide-react';
import { ScientificResearchHub } from './ScientificResearchHub';

interface LearnViewProps {
  user: User;
  initialArticleId?: string | null;
  onClearInitialArticle?: () => void;
  onOpenStudyArticle?: (studyId: string) => void;
}

export const LearnView: React.FC<LearnViewProps> = ({
  user,
  initialArticleId,
  onClearInitialArticle,
  onOpenStudyArticle
}) => {
  const [activeTab, setActiveTab] = useState<'articles' | 'quizzes' | 'research'>(() => {
    if (initialArticleId === 'research' || initialArticleId === 'studies') {
      return 'research';
    }
    return 'articles';
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [readArticleIds, setReadArticleIds] = useState<string[]>(() => getReadArticles(user.id));
  const [selectedArticle, setSelectedArticle] = useState<EducationArticle | null>(() => {
    if (initialArticleId && initialArticleId !== 'research' && initialArticleId !== 'studies') {
      return EDUCATION_ARTICLES.find((a) => a.id === initialArticleId) || null;
    }
    return null;
  });

  useEffect(() => {
    if (initialArticleId === 'research' || initialArticleId === 'studies') {
      setActiveTab('research');
      setSelectedArticle(null);
    } else if (initialArticleId) {
      const art = EDUCATION_ARTICLES.find((a) => a.id === initialArticleId);
      if (art) {
        setSelectedArticle(art);
        setActiveTab('articles');
      }
    }
  }, [initialArticleId]);

  // Quiz state
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [quizQuestionIndex, setQuizQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizResults, setQuizResults] = useState(() => getQuizResults(user.id));

  const handleToggleRead = (articleId: string) => {
    toggleReadArticle(user.id, articleId);
    setReadArticleIds(getReadArticles(user.id));
  };

  const categories = [
    { id: 'all', label: 'Alle Themen' },
    { id: 'phases', label: 'Die 4 Zyklusphasen' },
    { id: 'basics', label: 'Grundlagen' },
    { id: 'symptoms', label: 'Symptome & Krämpfe' },
    { id: 'communication', label: 'Kommunikation' },
    { id: 'myths', label: 'Mythen & Fakten' }
  ];

  const filteredArticles = EDUCATION_ARTICLES.filter((article) => {
    if (selectedCategory === 'all') return true;
    return article.category === selectedCategory;
  });

  // Quiz logic
  const handleStartQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setQuizQuestionIndex(0);
    setSelectedOption(null);
    setHasAnswered(false);
    setQuizScore(0);
    setQuizFinished(false);
  };

  const handleAnswerSubmit = (optionIndex: number) => {
    if (hasAnswered || !activeQuiz) return;
    setSelectedOption(optionIndex);
    setHasAnswered(true);

    const currentQ = activeQuiz.questions[quizQuestionIndex];
    if (optionIndex === currentQ.correctIndex) {
      setQuizScore((prev) => prev + 1);
    }
  };

  const handleNextQuizQuestion = () => {
    if (!activeQuiz) return;
    if (quizQuestionIndex + 1 < activeQuiz.questions.length) {
      setQuizQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setHasAnswered(false);
    } else {
      // Quiz complete
      setQuizFinished(true);
      const newScore = quizScore;
      saveQuizResult({
        userId: user.id,
        quizId: activeQuiz.id,
        score: newScore,
        total: activeQuiz.questions.length,
        completedAt: new Date().toISOString()
      });
      setQuizResults(getQuizResults(user.id));
    }
  };

  return (
    <div className="space-y-6 pb-24 md:pb-12 max-w-5xl mx-auto px-4 sm:px-6 pt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 tracking-wide uppercase">
            <span>Wissens-Bibliothek</span>
            <span aria-hidden="true">·</span>
            <span>Wissenschaftlich & Empathisch</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Den weiblichen Zyklus verstehen
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Fundiertes Wissen ohne Tabus – für feinfühlige, aufmerksame Partner.
          </p>
        </div>

        {/* Tab switcher: Articles vs Quizzes vs Research */}
        <div className="flex flex-wrap items-center gap-1 bg-[#1A1A26] p-1 rounded-2xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('articles')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'articles'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Artikel ({EDUCATION_ARTICLES.length})
          </button>
          <button
            onClick={() => setActiveTab('quizzes')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
              activeTab === 'quizzes'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Quizze ({QUIZZES.length})
          </button>
          <button
            onClick={() => setActiveTab('research')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'research'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Microscope className="w-3.5 h-3.5 text-purple-300" />
            <span>Wissenschaft & Studien</span>
          </button>
        </div>
      </div>

      {/* Medical Disclaimer Notice */}
      <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/20 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <p className="text-xs text-purple-200/90 leading-relaxed">
          <strong>Wichtiger Hinweis:</strong> Alle Inhalte dienen der allgemeinen partnerschaftlichen Aufklärung und Empathieförderung. Sie ersetzen keine ärztliche oder gynäkologische Beratung. Zyklusverläufe und Symptome sind individuell verschieden und bestimmen niemals den Charakter eines Menschen.
        </p>
      </div>

      {activeTab === 'articles' && (
        <>
          {/* Visual 4-Phase Roadmap preview */}
          <div className="rounded-3xl bg-[#1A1A26] border border-slate-800 p-5 sm:p-6 shadow-xl">
            <h2 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-3">
              Die 4 Phasen im Überblick
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { num: '1', name: 'Menstruation', days: 'Tage 1–5', desc: 'Rückzug & Wärme', id: 'phase-1-menstruation', color: 'from-pink-900/30 to-purple-900/20' },
                { num: '2', name: 'Follikelphase', days: 'Tage 6–13', desc: 'Energie & Pläne', id: 'phase-2-follicular', color: 'from-purple-900/30 to-indigo-900/20' },
                { num: '3', name: 'Ovulation', days: 'Tag 14', desc: 'Höchste Vitalität', id: 'phase-3-ovulation', color: 'from-amber-900/30 to-orange-900/20' },
                { num: '4', name: 'Lutealphase', days: 'Tage 15–28', desc: 'PMS & Geborgenheit', id: 'phase-4-luteal-pms', color: 'from-rose-900/30 to-pink-900/20' }
              ].map((phase) => (
                <button
                  key={phase.id}
                  onClick={() => {
                    const art = EDUCATION_ARTICLES.find((a) => a.id === phase.id);
                    if (art) setSelectedArticle(art);
                  }}
                  className={`p-3.5 rounded-2xl bg-gradient-to-br ${phase.color} border border-slate-800/80 hover:border-purple-500/40 text-left transition-all cursor-pointer group`}
                >
                  <div className="flex items-center justify-between text-xs text-purple-300 font-bold mb-1">
                    <span>Phase {phase.num}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{phase.days}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-purple-200 transition-colors">
                    {phase.name}
                  </h3>
                  <p className="text-[11px] text-slate-300 mt-1">{phase.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter Bar */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-[#1A1A26] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArticles.map((article) => {
              const isRead = readArticleIds.includes(article.id);
              return (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="rounded-3xl bg-[#1A1A26] border border-slate-800 hover:border-purple-500/40 p-5 sm:p-6 transition-all cursor-pointer flex flex-col justify-between group shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-purple-400 font-semibold mb-2">
                      <div className="flex items-center gap-2">
                        <span>{article.categoryLabel}</span>
                        {article.phaseDays && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-slate-400">{article.phaseDays}</span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                        <Clock className="w-3 h-3" />
                        <span>{article.readingTimeMinutes} Min.</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-purple-200 transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                      {article.summary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-800/80 text-xs">
                    <span className="text-purple-300 font-semibold flex items-center gap-1 group-hover:gap-1.5 transition-all">
                      <span>Lesen</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleRead(article.id);
                      }}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                        isRead
                          ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <CheckCircle className={`w-3.5 h-3.5 ${isRead ? 'text-emerald-400' : ''}`} />
                      <span>{isRead ? 'Gelesen' : 'Als gelesen markieren'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Quizzes Tab */}
      {activeTab === 'quizzes' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {QUIZZES.map((quiz) => {
              const prevResult = quizResults.find((r) => r.quizId === quiz.id);
              return (
                <div
                  key={quiz.id}
                  className="rounded-3xl bg-[#1A1A26] border border-slate-800 p-6 flex flex-col justify-between shadow-xl"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs text-purple-400 font-semibold mb-2">
                      <span>{quiz.category}</span>
                      <span>{quiz.questions.length} Fragen</span>
                    </div>
                    <h3 className="text-lg font-bold text-white">{quiz.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                      {quiz.description}
                    </p>

                    {prevResult && (
                      <div className="mt-4 p-3 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs text-purple-200 flex items-center justify-between">
                        <span>Letztes Ergebnis:</span>
                        <span className="font-bold tabular-nums">
                          {prevResult.score} / {prevResult.total} Punkte ({Math.round((prevResult.score / prevResult.total) * 100)}%)
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => handleStartQuiz(quiz)}
                    className="w-full mt-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-md shadow-purple-600/20"
                  >
                    <Award className="w-4 h-4" />
                    <span>{prevResult ? 'Quiz wiederholen' : 'Quiz starten'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Scientific Research Hub Tab */}
      {activeTab === 'research' && (
        <ScientificResearchHub onOpenStudyArticle={onOpenStudyArticle} />
      )}

      {/* ARTICLE READER MODAL */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-2xl rounded-3xl bg-[#1A1A26] border border-purple-500/30 p-6 sm:p-8 text-slate-100 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
            {/* Header / Close */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-xs font-semibold text-purple-400">
                <span>{selectedArticle.categoryLabel}</span>
                {selectedArticle.phaseDays && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-400">{selectedArticle.phaseDays}</span>
                  </>
                )}
                <span aria-hidden="true">·</span>
                <span>{selectedArticle.readingTimeMinutes} Min. Lesezeit</span>
              </div>
              <button
                onClick={() => {
                  setSelectedArticle(null);
                  if (onClearInitialArticle) onClearInitialArticle();
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
                aria-label="Schließen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Article Content */}
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-3">
              {selectedArticle.title}
            </h2>
            <p className="text-sm text-purple-200/90 font-medium mb-6 leading-relaxed p-3.5 rounded-2xl bg-purple-950/30 border border-purple-500/20">
              {selectedArticle.summary}
            </p>

            <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
              {selectedArticle.sections.map((section, idx) => (
                <div key={idx} className="space-y-2.5">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                    {section.heading}
                  </h3>
                  <p className="text-slate-300">{section.body}</p>

                  {section.bulletPoints && (
                    <ul className="space-y-1.5 pl-4 border-l-2 border-purple-500/30 my-3">
                      {section.bulletPoints.map((pt, pIdx) => (
                        <li key={pIdx} className="text-xs sm:text-sm text-slate-300">
                          {pt}
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.boyfriendTip && (
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-950/40 to-pink-950/20 border border-purple-500/30 my-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-pink-300 mb-1">
                        <Lightbulb className="w-4 h-4 text-pink-400" />
                        Tipp für dich als Partner:
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-medium">
                        {section.boyfriendTip}
                      </p>
                    </div>
                  )}
                </div>
              ))}

              {/* Key Takeaways */}
              <div className="p-4 rounded-2xl bg-[#101018] border border-slate-800 mt-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300 mb-2">
                  Die wichtigsten Erkenntnisse:
                </h4>
                <ul className="space-y-1.5">
                  {selectedArticle.keyTakeaways.map((item, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-800">
              <button
                onClick={() => handleToggleRead(selectedArticle.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  readArticleIds.includes(selectedArticle.id)
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300'
                    : 'bg-purple-600 hover:bg-purple-500 text-white'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>
                  {readArticleIds.includes(selectedArticle.id)
                    ? 'Als gelesen markiert ✓'
                    : 'Als gelesen abschließen'}
                </span>
              </button>

              <button
                onClick={() => {
                  setSelectedArticle(null);
                  if (onClearInitialArticle) onClearInitialArticle();
                }}
                className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUIZ MODAL */}
      {activeQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-3xl bg-[#1A1A26] border border-purple-500/30 p-6 sm:p-8 text-slate-100 shadow-2xl relative my-8">
            {!quizFinished ? (
              <div className="space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-purple-400">{activeQuiz.title}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-xs text-slate-400">
                      Frage {quizQuestionIndex + 1} von {activeQuiz.questions.length}
                    </span>
                  </div>
                  <button
                    onClick={() => setActiveQuiz(null)}
                    className="text-slate-400 hover:text-white p-1"
                    aria-label="Quiz abbrechen"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Question */}
                <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                  {activeQuiz.questions[quizQuestionIndex].question}
                </h3>

                {/* Options */}
                <div className="space-y-2.5">
                  {activeQuiz.questions[quizQuestionIndex].options.map((opt, optIdx) => {
                    const isSelected = selectedOption === optIdx;
                    const isCorrect = optIdx === activeQuiz.questions[quizQuestionIndex].correctIndex;

                    let btnStyle = 'bg-[#101018] border-slate-800 text-slate-300 hover:border-slate-700';
                    if (hasAnswered) {
                      if (isCorrect) {
                        btnStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'bg-rose-950/40 border-rose-500 text-rose-200';
                      } else {
                        btnStyle = 'bg-[#101018] border-slate-800/40 opacity-40 text-slate-500';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-purple-950/50 border-purple-500 text-white';
                    }

                    return (
                      <button
                        key={optIdx}
                        disabled={hasAnswered}
                        onClick={() => handleAnswerSubmit(optIdx)}
                        className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-medium transition-all cursor-pointer flex items-center justify-between gap-3 ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {hasAnswered && isCorrect && (
                          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        )}
                        {hasAnswered && isSelected && !isCorrect && (
                          <X className="w-4 h-4 text-rose-400 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Feedback after answering */}
                {hasAnswered && (
                  <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/20 text-xs space-y-1.5 animate-in fade-in">
                    <p className="font-bold text-purple-300">Erklärung:</p>
                    <p className="text-slate-300 leading-relaxed">
                      {activeQuiz.questions[quizQuestionIndex].explanation}
                    </p>
                    <p className="text-[11px] text-pink-300 font-medium pt-1">
                      💡 Merke: {activeQuiz.questions[quizQuestionIndex].takeaway}
                    </p>
                  </div>
                )}

                {/* Next button */}
                {hasAnswered && (
                  <button
                    onClick={handleNextQuizQuestion}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <span>
                      {quizQuestionIndex + 1 < activeQuiz.questions.length
                        ? 'Nächste Frage'
                        : 'Ergebnis anzeigen'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            ) : (
              /* Quiz Finished View */
              <div className="text-center space-y-5 py-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center mx-auto text-white shadow-xl shadow-purple-600/30">
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Quiz abgeschlossen!</h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Du hast {quizScore} von {activeQuiz.questions.length} Fragen richtig beantwortet.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#101018] border border-slate-800 max-w-xs mx-auto">
                  <p className="text-xs text-purple-300 font-bold">Erfolgsquote:</p>
                  <p className="text-3xl font-extrabold text-white mt-1 tabular-nums">
                    {Math.round((quizScore / activeQuiz.questions.length) * 100)}%
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleStartQuiz(activeQuiz)}
                    className="w-1/2 py-2.5 bg-[#101018] border border-slate-700 hover:border-slate-600 text-slate-200 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Wiederholen</span>
                  </button>
                  <button
                    onClick={() => setActiveQuiz(null)}
                    className="w-1/2 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                  >
                    Fertig
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
