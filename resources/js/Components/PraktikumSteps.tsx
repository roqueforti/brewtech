import { useState, useEffect } from 'react';
import { Play, Pause, ArrowRight, ArrowLeft, CheckCircle2, Volume2 } from 'lucide-react';

interface PraktikumStepsProps {
  onComplete: () => void;
  userName: string;
  workshopTitle: string;
}

export function PraktikumSteps({ onComplete, userName, workshopTitle }: PraktikumStepsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      id: 1,
      title: "Persiapan Alat",
      description: "Siapkan espresso machine, milk steamer, dan cangkir",
      videoUrl: "https://player.vimeo.com/video/76979871?autoplay=1&loop=1&title=0&byline=0&portrait=0",
      emoji: "🔧",
      color: "bg-blue-100",
    },
    {
      id: 2,
      title: "Buat Espresso",
      description: "Ekstrak espresso shot dengan tekanan yang tepat",
      videoUrl: "https://player.vimeo.com/video/76979871?autoplay=1&loop=1&title=0&byline=0&portrait=0",
      emoji: "☕",
      color: "bg-amber-100",
    },
    {
      id: 3,
      title: "Steam Susu",
      description: "Panaskan susu hingga suhu 60-70°C dengan tekstur lembut",
      videoUrl: "https://player.vimeo.com/video/76979871?autoplay=1&loop=1&title=0&byline=0&portrait=0",
      emoji: "🥛",
      color: "bg-pink-100",
    },
    {
      id: 4,
      title: "Tuang & Hias",
      description: "Tuang susu dengan gerakan melingkar dan buat latte art",
      videoUrl: "https://player.vimeo.com/video/76979871?autoplay=1&loop=1&title=0&byline=0&portrait=0",
      emoji: "✨",
      color: "bg-purple-100",
    },
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

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
    const fullText = `${currentStepData.title}. ${currentStepData.description}`;
    speakText(fullText);
    return () => window.speechSynthesis?.cancel();
  }, [currentStep]);

  const handleMarkComplete = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5E6D3] p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-gray-800 mb-4">Praktikum Step-by-Step 🎥</h1>
          <div className="flex gap-2">
            {steps.map((step, idx) => (
              <div
                key={step.id}
                className={`flex-1 h-3 rounded-full transition-all ${
                  idx === currentStep
                    ? 'bg-indigo-500'
                    : completedSteps.includes(idx)
                    ? 'bg-emerald-500'
                    : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Navigation Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {steps.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setCurrentStep(idx)}
              className={`${step.color} p-4 rounded-2xl border-4 transition-all ${
                idx === currentStep
                  ? 'border-indigo-500 scale-105 shadow-lg'
                  : completedSteps.includes(idx)
                  ? 'border-emerald-500'
                  : 'border-white hover:border-indigo-200'
              }`}
            >
              <div className="text-4xl mb-2">{step.emoji}</div>
              <p className="text-sm text-gray-800 font-medium">Step {idx + 1}</p>
              {completedSteps.includes(idx) && (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto mt-2" />
              )}
            </button>
          ))}
        </div>

        {/* Video & Content Card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-lg mb-6">
          {/* Video Player */}
          <div className="relative bg-black aspect-video">
            <iframe
              src={currentStepData.videoUrl}
              className="w-full h-full"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Step Info */}
          <div className={`${currentStepData.color} p-8`}>
            <div className="flex items-start gap-4 mb-4">
              <div className="text-6xl">{currentStepData.emoji}</div>
              <div className="flex-1">
                <h2 className="text-3xl text-gray-800 mb-2">{currentStepData.title}</h2>
                <p className="text-xl text-gray-700">{currentStepData.description}</p>
              </div>
              <button
                onClick={() => speakText(`${currentStepData.title}. ${currentStepData.description}`)}
                className="w-14 h-14 bg-white hover:bg-gray-50 rounded-xl flex items-center justify-center transition-colors"
              >
                <Volume2 className="w-7 h-7 text-gray-700" />
              </button>
            </div>

            {/* Step Counter */}
            <div className="flex items-center gap-2">
              <span className="text-lg text-gray-600">
                Langkah {currentStep + 1} dari {steps.length}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className={`h-16 px-8 rounded-2xl text-xl font-medium transition-all ${
              currentStep === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-white hover:bg-gray-50 text-gray-800 shadow-md'
            }`}
          >
            <ArrowLeft className="inline-block w-6 h-6 mr-2" />
            Kembali
          </button>

          <button
            onClick={handleMarkComplete}
            className="flex-1 h-16 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-xl font-medium transition-all shadow-lg"
          >
            {isLastStep ? 'Selesai Praktikum ✓' : 'Lanjut Step Berikutnya'}
            <ArrowRight className="inline-block w-6 h-6 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
