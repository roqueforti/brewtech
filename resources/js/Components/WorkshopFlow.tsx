import { useState } from 'react';
import { PreTestSimple } from './PreTestSimple';
import { PraktikumSteps } from './PraktikumSteps';
import { PostTestSimple } from './PostTestSimple';
import { VisualResult } from './VisualResult';

interface WorkshopFlowProps {
  onNavigate: (page: string) => void;
  userName: string;
  workshopTitle: string;
}

type FlowStep = 'pretest' | 'pretest-result' | 'praktikum' | 'posttest' | 'posttest-result' | 'visual-result';

export function WorkshopFlow({ onNavigate, userName, workshopTitle }: WorkshopFlowProps) {
  const [currentStep, setCurrentStep] = useState<FlowStep>('pretest');
  const [preTestScore, setPreTestScore] = useState(0);
  const [postTestScore, setPostTestScore] = useState(0);

  const handlePreTestComplete = (score: number) => {
    setPreTestScore(score);
    setCurrentStep('pretest-result');
  };

  const handlePreTestResultContinue = () => {
    setCurrentStep('praktikum');
  };

  const handlePraktikumComplete = () => {
    setCurrentStep('posttest');
  };

  const handlePostTestComplete = (score: number) => {
    setPostTestScore(score);
    setCurrentStep('posttest-result');
  };

  const handlePostTestResultContinue = () => {
    setCurrentStep('visual-result');
  };

  const handleVisualResultFinish = () => {
    onNavigate('dashboard');
  };

  return (
    <>
      {currentStep === 'pretest' && (
        <PreTestSimple 
          onComplete={handlePreTestComplete}
          userName={userName}
          workshopTitle={workshopTitle}
        />
      )}
      
      {currentStep === 'pretest-result' && (
        <div className="min-h-screen bg-[#F5E6D3] p-6 flex items-center justify-center">
          <div className="max-w-2xl w-full bg-white rounded-3xl p-12 text-center shadow-lg">
            <div className="text-8xl mb-6">🎯</div>
            <h1 className="text-4xl text-gray-800 mb-4">Pre-Test Selesai!</h1>
            <div className="text-6xl text-indigo-600 mb-2">{preTestScore}/3</div>
            <p className="text-xl text-gray-600 mb-8">Skor Anda</p>
            <button
              onClick={handlePreTestResultContinue}
              className="w-full h-20 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl text-2xl transition-colors"
            >
              Lanjut ke Praktikum 🚀
            </button>
          </div>
        </div>
      )}

      {currentStep === 'praktikum' && (
        <PraktikumSteps 
          onComplete={handlePraktikumComplete}
          userName={userName}
          workshopTitle={workshopTitle}
        />
      )}

      {currentStep === 'posttest' && (
        <PostTestSimple 
          onComplete={handlePostTestComplete}
          userName={userName}
          workshopTitle={workshopTitle}
        />
      )}

      {currentStep === 'posttest-result' && (
        <div className="min-h-screen bg-[#F5E6D3] p-6 flex items-center justify-center">
          <div className="max-w-2xl w-full bg-white rounded-3xl p-12 text-center shadow-lg">
            <div className="text-8xl mb-6">🏆</div>
            <h1 className="text-4xl text-gray-800 mb-4">Post-Test Selesai!</h1>
            <div className="text-6xl text-emerald-600 mb-2">{postTestScore}/3</div>
            <p className="text-xl text-gray-600 mb-8">Skor Anda</p>
            <button
              onClick={handlePostTestResultContinue}
              className="w-full h-20 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-2xl transition-colors"
            >
              Lihat Hasil Karya 🎨
            </button>
          </div>
        </div>
      )}

      {currentStep === 'visual-result' && (
        <VisualResult 
          onFinish={handleVisualResultFinish}
          userName={userName}
          preTestScore={preTestScore}
          postTestScore={postTestScore}
        />
      )}
    </>
  );
}
