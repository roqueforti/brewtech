import { Send } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import { HeaderPeserta } from "./HeaderPeserta";
import { BottomNavPeserta } from "./BottomNavPeserta";

interface FeedbackPageProps {
  onNavigate: (page: string) => void;
  userName?: string;
}

export function FeedbackPage({ onNavigate, userName = "Peserta" }: FeedbackPageProps) {
  const [message, setMessage] = useState("");

  const feedbacks = [
    {
      id: 1,
      from: "Bu Sari (Pengajar)",
      message: "Halo! Kamu sudah melakukan dengan baik di modul 2. Upload foto hasil praktikmu sangat rapi. Pertahankan semangat belajarnya ya! 💪",
      time: "2 jam yang lalu",
      color: "bg-[#66BB6A]",
      isOwn: false
    },
    {
      id: 2,
      from: "Bu Sari (Pengajar)",
      message: "Untuk modul latte art, coba perhatikan lagi teknik menuang susunya. Hasil kamu sudah bagus, tapi bisa lebih sempurna lagi! ☕✨",
      time: "Kemarin",
      color: "bg-[#A2D2FF]",
      isOwn: false
    },
    {
      id: 3,
      from: "Kamu",
      message: "Terima kasih Bu! Saya akan lebih banyak latihan lagi 😊",
      time: "Kemarin",
      color: "bg-[#9C27B0]",
      isOwn: true
    },
    {
      id: 4,
      from: "Bu Sari (Pengajar)",
      message: "Nilai post-test kamu meningkat 16 poin! Luar biasa! Ini artinya kamu benar-benar menyerap materi dengan baik. Terus semangat! 🎉",
      time: "3 hari yang lalu",
      color: "bg-[#FFD166]",
      isOwn: false
    }
  ];

  const handleSend = () => {
    if (message.trim()) {
      // Logic to send message
      console.log("Message sent:", message);
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F3E5F5] via-[#FCE4EC] to-[#FFF3E0] pb-24">
      <HeaderPeserta userName={userName} onNavigate={onNavigate} />

      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <Card className="bg-gradient-to-r from-[#9C27B0] to-[#E91E63] rounded-2xl p-6 mb-6 border-0 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-white/30 rounded-2xl flex items-center justify-center backdrop-blur text-4xl">
              💬
            </div>
            <div>
              <h1 className="text-white mb-1">Feedback & Pesan</h1>
              <p className="text-white/90 text-sm">Komunikasi dengan pengajar</p>
            </div>
          </div>
        </Card>

        {/* Chat Messages */}
        <div className="space-y-4 mb-24">
          {feedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className={`flex ${feedback.isOwn ? "justify-end" : "justify-start"}`}
            >
              <Card
                className={`max-w-[80%] p-4 rounded-2xl border-0 shadow-md ${
                  feedback.isOwn
                    ? "bg-gradient-to-r from-[#9C27B0] to-[#E91E63] text-white"
                    : "bg-white"
                }`}
              >
                <div className="mb-2">
                  <p className={`text-sm ${feedback.isOwn ? "text-white/90" : "text-gray-600"}`}>
                    {feedback.from}
                  </p>
                </div>
                <p className={`mb-2 ${feedback.isOwn ? "text-white" : "text-gray-800"}`}>
                  {feedback.message}
                </p>
                <p className={`text-xs ${feedback.isOwn ? "text-white/70" : "text-gray-500"}`}>
                  {feedback.time}
                </p>
              </Card>
            </div>
          ))}
        </div>

        {/* Input Box */}
        <div className="fixed bottom-20 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
          <div className="max-w-4xl mx-auto flex gap-3">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tulis pesan atau pertanyaan..."
              className="flex-1 rounded-xl border-gray-300 resize-none min-h-[60px] max-h-[120px]"
            />
            <Button
              onClick={handleSend}
              disabled={!message.trim()}
              className={`h-[60px] px-6 rounded-xl ${
                message.trim()
                  ? "bg-gradient-to-r from-[#9C27B0] to-[#E91E63] text-white hover:scale-105"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <BottomNavPeserta onNavigate={onNavigate} currentPage="dashboard" />
    </div>
  );
}
