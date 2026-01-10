import { useState, useRef } from 'react';
import { Trophy, Star, Award, Camera, ArrowRight, Upload, RotateCcw } from 'lucide-react';

interface VisualResultProps {
  onFinish: () => void;
  userName: string;
  preTestScore: number;
  postTestScore: number;
}

export function VisualResult({ onFinish, userName, preTestScore, postTestScore }: VisualResultProps) {
  const [step, setStep] = useState<'capture' | 'result'>('capture');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);

  const improvement = postTestScore - preTestScore;
  const totalQuestions = 3;

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        setStream(mediaStream);
        setCameraActive(true);
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      alert('Tidak bisa mengakses kamera. Silakan upload foto dari galeri.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
      setCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    stopCamera();
  };

  const handleContinue = () => {
    setStep('result');
    stopCamera();
  };

  // Camera Capture Step
  if (step === 'capture') {
    return (
      <div className="min-h-screen bg-[#F5E6D3] p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-7xl mb-4">📸</div>
            <h1 className="text-4xl text-gray-800 mb-2">Foto Hasil Karya Kamu!</h1>
            <p className="text-xl text-gray-600">Ambil foto minuman yang sudah kamu buat</p>
          </div>

          {/* Camera/Preview Card */}
          <div className="bg-white rounded-3xl p-8 shadow-lg mb-6">
            {!capturedImage ? (
              <>
                {/* Camera Preview or Placeholder */}
                <div className="relative bg-gray-900 rounded-2xl overflow-hidden mb-6 aspect-square">
                  {cameraActive ? (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Camera className="w-24 h-24 text-gray-600 mx-auto mb-4" />
                        <p className="text-white text-xl">Kamera belum aktif</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Camera Controls */}
                <div className="grid grid-cols-2 gap-4">
                  {!cameraActive ? (
                    <>
                      <button
                        onClick={startCamera}
                        className="h-16 bg-indigo-500 hover:bg-indigo-600 text-white rounded-2xl text-xl font-medium transition-all shadow-lg flex items-center justify-center gap-2"
                      >
                        <Camera className="w-6 h-6" />
                        Buka Kamera
                      </button>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="h-16 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl text-xl font-medium transition-all shadow-lg flex items-center justify-center gap-2"
                      >
                        <Upload className="w-6 h-6" />
                        Upload Foto
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </>
                  ) : (
                    <>
                      <button
                        onClick={stopCamera}
                        className="h-16 bg-gray-500 hover:bg-gray-600 text-white rounded-2xl text-xl font-medium transition-all shadow-lg"
                      >
                        Tutup Kamera
                      </button>
                      <button
                        onClick={capturePhoto}
                        className="h-16 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-xl font-medium transition-all shadow-lg flex items-center justify-center gap-2"
                      >
                        <Camera className="w-6 h-6" />
                        Jepret! 📸
                      </button>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* Preview Captured Image */}
                <div className="relative rounded-2xl overflow-hidden mb-6">
                  <img
                    src={capturedImage}
                    alt="Hasil Karya"
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-xl flex items-center gap-2">
                    <Star className="w-5 h-5 fill-white" />
                    <span className="text-lg">Keren!</span>
                  </div>
                </div>

                {/* Preview Controls */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleRetake}
                    className="h-16 bg-gray-500 hover:bg-gray-600 text-white rounded-2xl text-xl font-medium transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-6 h-6" />
                    Foto Ulang
                  </button>
                  <button
                    onClick={handleContinue}
                    className="h-16 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-xl font-medium transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    Lanjut
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Helper Text */}
          <div className="bg-blue-100 rounded-2xl p-6 border-4 border-blue-300">
            <p className="text-center text-gray-700 text-lg">
              💡 Tips: Pastikan minumanmu terlihat jelas dan cahaya cukup terang!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Result Step (Original)
  return (
    <div className="min-h-screen bg-[#F5E6D3] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="text-8xl mb-4">🎉</div>
          <h1 className="text-4xl text-gray-800 mb-2">Selamat, {userName}!</h1>
          <p className="text-xl text-gray-600">Workshop selesai dengan sempurna</p>
        </div>

        {/* Score Comparison */}
        <div className="bg-white rounded-3xl p-8 shadow-lg mb-6">
          <h2 className="text-2xl text-gray-800 mb-6 text-center">Perbandingan Nilai 📊</h2>
          
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Pre-Test Score */}
            <div className="bg-indigo-100 rounded-2xl p-6 text-center border-4 border-indigo-300">
              <p className="text-lg text-gray-700 mb-2">Pre-Test</p>
              <div className="text-5xl text-indigo-600 mb-2">{preTestScore}/{totalQuestions}</div>
              <p className="text-sm text-gray-600">{Math.round((preTestScore/totalQuestions)*100)}%</p>
            </div>

            {/* Post-Test Score */}
            <div className="bg-emerald-100 rounded-2xl p-6 text-center border-4 border-emerald-300">
              <p className="text-lg text-gray-700 mb-2">Post-Test</p>
              <div className="text-5xl text-emerald-600 mb-2">{postTestScore}/{totalQuestions}</div>
              <p className="text-sm text-gray-600">{Math.round((postTestScore/totalQuestions)*100)}%</p>
            </div>
          </div>

          {/* Improvement */}
          {improvement > 0 && (
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 text-center border-4 border-orange-300">
              <p className="text-lg text-gray-700 mb-2">Peningkatan 📈</p>
              <div className="text-4xl text-orange-600 font-bold">+{improvement} poin</div>
            </div>
          )}
          
          {improvement === 0 && postTestScore === totalQuestions && (
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 text-center border-4 border-purple-300">
              <Trophy className="w-12 h-12 text-purple-600 mx-auto mb-2" />
              <p className="text-xl text-purple-700">Perfect Score! 🌟</p>
            </div>
          )}
        </div>

        {/* Visual Result - User's Photo */}
        <div className="bg-white rounded-3xl p-8 shadow-lg mb-6">
          <h2 className="text-2xl text-gray-800 mb-6 flex items-center justify-center gap-3">
            <Camera className="w-8 h-8" />
            Hasil Karya Kamu
          </h2>
          
          <div className="relative rounded-2xl overflow-hidden mb-4">
            <img
              src={capturedImage || 'https://images.unsplash.com/photo-1514066558159-fc8c737ef259?w=1200&auto=format&fit=crop'}
              alt="Hasil Karya Latte"
              className="w-full h-96 object-cover"
            />
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-xl px-4 py-2">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="text-lg text-gray-800">Excellent!</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 border-4 border-purple-300">
            <h3 className="text-xl text-gray-800 mb-3">Penilaian Instruktur ✨</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <span className="text-gray-700">Teknik Steaming</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[1,2,3,4].map(i => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  ))}
                  <Star className="w-5 h-5 text-gray-300" />
                </div>
                <span className="text-gray-700">Latte Art</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <span className="text-gray-700">Kebersihan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Badges */}
        <div className="bg-white rounded-3xl p-8 shadow-lg mb-6">
          <h2 className="text-2xl text-gray-800 mb-6 text-center">Badge yang Didapat 🏅</h2>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-yellow-100 rounded-2xl p-6 text-center border-4 border-yellow-300">
              <Trophy className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
              <p className="text-sm text-gray-700">Workshop Master</p>
            </div>
            <div className="bg-pink-100 rounded-2xl p-6 text-center border-4 border-pink-300">
              <Award className="w-12 h-12 text-pink-600 mx-auto mb-3" />
              <p className="text-sm text-gray-700">Latte Artist</p>
            </div>
            <div className="bg-blue-100 rounded-2xl p-6 text-center border-4 border-blue-300">
              <Star className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <p className="text-sm text-gray-700">Quick Learner</p>
            </div>
          </div>
        </div>

        {/* Finish Button */}
        <button
          onClick={onFinish}
          className="w-full h-20 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white rounded-2xl text-2xl font-medium transition-all shadow-lg"
        >
          Kembali ke Dashboard
          <ArrowRight className="inline-block w-8 h-8 ml-2" />
        </button>
      </div>
    </div>
  );
}