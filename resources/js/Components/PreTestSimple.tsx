import { useState, useEffect } from 'react';
import { Volume2, ArrowRight } from 'lucide-react';

interface PreTestSimpleProps {
  onComplete: (score: number) => void;
  userName: string;
  workshopTitle: string;
}

export function PreTestSimple({ onComplete, userName, workshopTitle }: PreTestSimpleProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);

  const questions = [
    {
      id: 1,
      text: "Alat apa yang digunakan untuk memanaskan susu?",
      image: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800&auto=format&fit=crop",
      options: [
        { id: 1, text: "Milk Steamer", emoji: "☕", color: "bg-pink-100" },
        { id: 2, text: "Grinder", emoji: "⚙️", color: "bg-blue-100" },
        { id: 3, text: "Espresso Machine", emoji: "🔧", color: "bg-yellow-100" },
        { id: 4, text: "French Press", emoji: "🫖", color: "bg-green-100" },
      ],
      correct: 1,
    },
    {
      id: 2,
      text: "Suhu ideal untuk steam susu?",
      image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800&auto=format&fit=crop",
      options: [
        { id: 1, text: "40-50��C", emoji: "🌡️", color: "bg-blue-100" },
        { id: 2, text: "60-70°C", emoji: "🌡️", color: "bg-green-100" },
        { id: 3, text: "80-90°C", emoji: "🌡️", color: "bg-orange-100" },
        { id: 4, text: "100°C", emoji: "🌡️", color: "bg-red-100" },
      ],
      correct: 2,
    },
    {
      id: 3,
      text: "Langkah pertama membuat latte?",
      image: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800&auto=format&fit=crop",
      options: [
        { id: 1, text: "Tuang susu", emoji: "🥛", color: "bg-blue-100" },
        { id: 2, text: "Buat espresso", emoji: "☕", color: "bg-amber-100" },
        { id: 3, text: "Kocok susu", emoji: "🥄", color: "bg-pink-100" },
        { id: 4, text: "Hias atas", emoji: "✨", color: "bg-purple-100" },
      ],
      correct: 2,
    },
  ];

  const currentQ = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'id-ID';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    speakText(currentQ.text);
    return () => window.speechSynthesis?.cancel();
  }, [currentQuestion]);

  const handleSelect = (optionId: number) => {
    setSelectedAnswer(optionId);
  };

  const handleNext = () => {
    if (selectedAnswer === null) return;
    
    const newAnswers = [...answers, selectedAnswer];
    setAnswers(newAnswers);
    
    if (isLastQuestion) {
      const score = newAnswers.filter((ans, idx) => ans === questions[idx].correct).length;
      onComplete(score);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5E6D3] p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl text-gray-800">Pre-Test 📝</h1>
            <span className="text-xl text-gray-600">
              Soal {currentQuestion + 1}/{questions.length}
            </span>
          </div>
          <div className="h-3 bg-white/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl p-8 shadow-lg mb-6">
          {/* Image */}
          <div className="relative mb-6 rounded-2xl overflow-hidden">
            <img
              src={currentQ.image}
              alt="Question"
              className="w-full h-64 object-cover"
            />
          </div>

          {/* Question Text with Speaker */}
          <div className="flex items-start gap-4 mb-8">
            <button
              onClick={() => speakText(currentQ.text)}
              className="w-16 h-16 bg-indigo-100 hover:bg-indigo-200 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors"
            >
              <Volume2 className="w-8 h-8 text-indigo-600" />
            </button>
            <p className="text-3xl text-gray-800 leading-snug flex-1">
              {currentQ.text}
            </p>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-4">
            {currentQ.options.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  handleSelect(option.id);
                  speakText(option.text);
                }}
                className={`p-6 rounded-2xl border-4 transition-all ${option.color} ${
                  selectedAnswer === option.id
                    ? 'border-indigo-500 scale-105 shadow-xl'
                    : 'border-white hover:border-indigo-200'
                }`}
              >
                <div className="text-5xl mb-3">{option.emoji}</div>
                <p className="text-xl text-gray-800">{option.text}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={selectedAnswer === null}
          className={`w-full h-20 rounded-2xl text-2xl font-medium transition-all ${
            selectedAnswer === null
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-lg'
          }`}
        >
          {isLastQuestion ? 'Selesai' : 'Selanjutnya'}
          <ArrowRight className="inline-block w-8 h-8 ml-2" />
        </button>
      </div>
    </div>
  );
}
