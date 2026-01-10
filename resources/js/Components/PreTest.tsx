import { useState, useEffect } from 'react';
import { Volume2, ArrowRight, ArrowLeft, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { HeaderPeserta } from './HeaderPeserta';

interface PreTestProps {
  onNavigate: (page: string) => void;
  workshopTitle: string;
  userName: string;
}

export function PreTest({ onNavigate, workshopTitle, userName }: PreTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  // Questions dengan image-based soal
  const questions = [
    {
      id: 1,
      questionText: "Alat apa yang digunakan untuk memanaskan susu?",
      imageUrl: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop",
      options: [
        { id: 1, text: "Milk Steamer", imageUrl: "https://images.unsplash.com/photo-1610632978522-11c12b0801fb?w=400&auto=format&fit=crop" },
        { id: 2, text: "Coffee Grinder", imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&auto=format&fit=crop" },
        { id: 3, text: "Espresso Machine", imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&auto=format&fit=crop" },
        { id: 4, text: "French Press", imageUrl: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&auto=format&fit=crop" },
      ],
      correctAnswer: 1,
      audioText: "Alat apa yang digunakan untuk memanaskan susu?"
    },
    {
      id: 2,
      questionText: "Langkah pertama membuat latte adalah?",
      imageUrl: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&auto=format&fit=crop",
      options: [
        { id: 1, text: "Menuang susu", imageUrl: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=400&auto=format&fit=crop" },
        { id: 2, text: "Membuat espresso", imageUrl: "https://images.unsplash.com/photo-1514066558159-fc8c737ef259?w=400&auto=format&fit=crop" },
        { id: 3, text: "Mengocok susu", imageUrl: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&auto=format&fit=crop" },
        { id: 4, text: "Menghias atas", imageUrl: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400&auto=format&fit=crop" },
      ],
      correctAnswer: 2,
      audioText: "Langkah pertama membuat latte adalah?"
    },
    {
      id: 3,
      questionText: "Suhu ideal untuk steaming susu adalah?",
      imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&auto=format&fit=crop",
      options: [
        { id: 1, text: "40-50°C", imageUrl: "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=400&auto=format&fit=crop" },
        { id: 2, text: "60-70°C", imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&auto=format&fit=crop" },
        { id: 3, text: "80-90°C", imageUrl: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&auto=format&fit=crop" },
        { id: 4, text: "100°C", imageUrl: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&auto=format&fit=crop" },
      ],
      correctAnswer: 2,
      audioText: "Suhu ideal untuk steaming susu adalah?"
    },
  ];

  const currentQ = questions[currentQuestion];
  const selectedAnswer = answers[currentQuestion];

  // Text-to-Speech Function
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID'; // Indonesian language
      utterance.rate = 0.8; // Slower speed untuk accessibility
      utterance.pitch = 1;
      utterance.volume = 1;
      
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Browser Anda tidak mendukung text-to-speech');
    }
  };

  // Auto-speak question when it changes
  useEffect(() => {
    speakText(currentQ.audioText);
    
    // Cleanup: stop speech when component unmounts
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentQuestion]);

  const handleSelectAnswer = (optionId: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = optionId;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
      const correctCount = answers.filter((ans, idx) => ans === questions[idx].correctAnswer).length;
      const resultText = `Anda menjawab benar ${correctCount} dari ${questions.length} soal.`;
      speakText(resultText);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleContinue = () => {
    onNavigate('praktikum');
  };

  const correctCount = answers.filter((ans, idx) => ans === questions[idx].correctAnswer).length;

  if (showResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 p-6">
        <HeaderPeserta userName={userName} />
        
        <div className="max-w-4xl mx-auto mt-12">
          {/* Result Card */}
          <Card className="bg-white border-4 border-indigo-200 rounded-[32px] p-12 text-center shadow-2xl">
            <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <CheckCircle2 className="w-20 h-20 text-white" strokeWidth={2.5} />
            </div>

            <h1 className="text-gray-900 mb-6" style={{ fontSize: '48px' }}>
              Pre-Test Selesai! 🎉
            </h1>

            <div className="bg-gradient-to-r from-indigo-50 to-emerald-50 rounded-3xl p-8 mb-8">
              <p className="text-gray-600 mb-4" style={{ fontSize: '32px' }}>
                Skor Anda:
              </p>
              <p className="text-indigo-600 mb-2" style={{ fontSize: '72px', fontWeight: 'bold' }}>
                {correctCount}/{questions.length}
              </p>
              <p className="text-gray-500" style={{ fontSize: '24px' }}>
                {Math.round((correctCount / questions.length) * 100)}% Benar
              </p>
            </div>

            {/* Review Answers */}
            <div className="space-y-4 mb-8">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className={`flex items-center justify-between p-6 rounded-2xl border-2 ${
                    answers[idx] === q.correctAnswer
                      ? 'bg-emerald-50 border-emerald-300'
                      : 'bg-red-50 border-red-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {answers[idx] === q.correctAnswer ? (
                      <CheckCircle2 className="w-10 h-10 text-emerald-600" strokeWidth={2.5} />
                    ) : (
                      <XCircle className="w-10 h-10 text-red-600" strokeWidth={2.5} />
                    )}
                    <span className="text-gray-700" style={{ fontSize: '24px' }}>
                      Soal {idx + 1}
                    </span>
                  </div>
                  <span
                    className={`text-2xl ${
                      answers[idx] === q.correctAnswer ? 'text-emerald-700' : 'text-red-700'
                    }`}
                  >
                    {answers[idx] === q.correctAnswer ? 'Benar ✓' : 'Salah ✗'}
                  </span>
                </div>
              ))}
            </div>

            <Button
              onClick={handleContinue}
              className="w-full h-24 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white border-0 rounded-[28px] shadow-xl text-4xl"
            >
              Lanjut ke Pembelajaran 🚀
              <ArrowRight className="w-12 h-12 ml-4" strokeWidth={2.5} />
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-emerald-50 p-6">
      <HeaderPeserta userName={userName} />

      <div className="max-w-6xl mx-auto mt-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900" style={{ fontSize: '36px' }}>
              Pre-Test
            </h2>
            <p className="text-gray-600" style={{ fontSize: '28px' }}>
              Soal {currentQuestion + 1} dari {questions.length}
            </p>
          </div>
          <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <Card className="bg-white border-4 border-slate-200 rounded-[32px] p-10 shadow-2xl mb-8">
          {/* Question Image */}
          <div className="relative mb-8 rounded-3xl overflow-hidden">
            <img
              src={currentQ.imageUrl}
              alt="Soal"
              className="w-full h-96 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>

          {/* Question Text with Audio */}
          <div className="flex items-start gap-6 mb-10">
            <Button
              onClick={() => speakText(currentQ.audioText)}
              className="w-20 h-20 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 border-0 rounded-2xl flex-shrink-0 shadow-lg"
            >
              <Volume2 className="w-10 h-10" strokeWidth={2.5} />
            </Button>
            <div className="flex-1">
              <p className="text-gray-900 leading-tight" style={{ fontSize: '36px' }}>
                {currentQ.questionText}
              </p>
            </div>
          </div>

          {/* Answer Options - Grid with Images */}
          <div className="grid grid-cols-2 gap-6">
            {currentQ.options.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  handleSelectAnswer(option.id);
                  speakText(option.text);
                }}
                className={`group relative overflow-hidden rounded-3xl border-4 transition-all duration-300 ${
                  selectedAnswer === option.id
                    ? 'border-indigo-500 shadow-2xl shadow-indigo-500/30 scale-105'
                    : 'border-slate-200 hover:border-indigo-300 hover:shadow-xl'
                }`}
              >
                {/* Option Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={option.imageUrl}
                    alt={option.text}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {selectedAnswer === option.id && (
                    <div className="absolute inset-0 bg-indigo-600/20 backdrop-blur-[1px]"></div>
                  )}
                </div>

                {/* Option Text */}
                <div className={`p-6 ${selectedAnswer === option.id ? 'bg-indigo-50' : 'bg-white'}`}>
                  <p className={`text-center ${selectedAnswer === option.id ? 'text-indigo-700' : 'text-gray-700'}`} style={{ fontSize: '24px', fontWeight: selectedAnswer === option.id ? 'bold' : 'normal' }}>
                    {option.text}
                  </p>
                </div>

                {/* Selected Indicator */}
                {selectedAnswer === option.id && (
                  <div className="absolute top-4 right-4 w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="w-8 h-8 text-white" strokeWidth={3} />
                  </div>
                )}

                {/* Audio Button on Hover */}
                <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg">
                    <Volume2 className="w-5 h-5 text-indigo-600" strokeWidth={2.5} />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`h-20 px-8 rounded-2xl text-2xl ${
              currentQuestion === 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            } border-0 shadow-lg`}
          >
            <ArrowLeft className="w-8 h-8 mr-3" strokeWidth={2.5} />
            Sebelumnya
          </Button>

          <Button
            onClick={handleNext}
            disabled={selectedAnswer === undefined}
            className={`flex-1 h-20 rounded-2xl text-2xl ${
              selectedAnswer === undefined
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white'
            } border-0 shadow-xl`}
          >
            {currentQuestion === questions.length - 1 ? 'Selesai' : 'Selanjutnya'}
            <ArrowRight className="w-8 h-8 ml-3" strokeWidth={2.5} />
          </Button>
        </div>
      </div>
    </div>
  );
}