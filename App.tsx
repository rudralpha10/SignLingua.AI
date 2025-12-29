import React, { useState, useEffect } from 'react';
import { AvatarViewer } from './components/AvatarViewer';
import { ChatPanel } from './components/ChatPanel';
import { WebcamHandTracker } from './components/WebcamHandTracker';
import { useSpeechToSign } from './hooks/useSpeechToSign';
import { Mic, MicOff, Camera, Video, VideoOff } from 'lucide-react';
import { ChatMessage } from './types';

const App: React.FC = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [currentGloss, setCurrentGloss] = useState<string | null>(null);

  const { isListening, transcript, gloss, startListening, stopListening, error: speechError } = useSpeechToSign();

  // Effect to handle new speech-to-sign results
  useEffect(() => {
    if (gloss && gloss !== currentGloss) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        sender: 'user',
        text: transcript,
        gloss: gloss,
        timestamp: new Date()
      };
      setChatHistory(prev => [...prev, newMessage]);
      setCurrentGloss(gloss);
    }
  }, [gloss, transcript, currentGloss]);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
            <span className="font-bold text-white">SL</span>
          </div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
            SignLingua AI
          </h1>
        </div>
        <div className="text-sm text-slate-400">
          Gemini-Powered Translator
        </div>
      </header>

      {/* Main Content Split */}
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        
        {/* Left: 3D Avatar Area */}
        <section className="flex-1 relative bg-gradient-to-b from-slate-900 to-slate-800 min-h-[50vh] md:min-h-0">
          <div className="absolute inset-0">
             <AvatarViewer currentGloss={currentGloss} />
          </div>
          
          {/* Overlay Status */}
          <div className="absolute top-4 left-4 z-10 pointer-events-none">
            {isListening && (
              <div className="flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-400 rounded-full border border-red-500/30 backdrop-blur-sm animate-pulse">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-xs font-medium">Listening...</span>
              </div>
            )}
            {speechError && (
              <div className="mt-2 px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg border border-yellow-500/30 backdrop-blur-sm text-xs">
                {speechError}
              </div>
            )}
          </div>
        </section>

        {/* Right: Chat & Interactions */}
        <section className="flex-1 md:max-w-md lg:max-w-lg flex flex-col border-l border-slate-800 bg-slate-950/50 backdrop-blur-sm z-20">
          
          {/* Webcam Vision Preview (Collapsible or small) */}
          {isCameraOpen && (
            <div className="h-48 bg-black relative border-b border-slate-800 shrink-0">
               <WebcamHandTracker isOpen={isCameraOpen} />
               <button 
                onClick={() => setIsCameraOpen(false)}
                className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full text-white/70"
               >
                 <VideoOff size={16} />
               </button>
            </div>
          )}

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-4">
            <ChatPanel messages={chatHistory} />
            {isListening && !gloss && transcript && (
              <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700 animate-pulse">
                <p className="text-slate-400 text-sm">Hearing: "{transcript}"...</p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="p-4 bg-slate-900 border-t border-slate-800">
            <div className="flex items-center justify-center gap-6">
              <button
                onClick={() => setIsCameraOpen(!isCameraOpen)}
                className={`p-4 rounded-full transition-all duration-200 ${
                  isCameraOpen 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
                title="Toggle Sign-to-Speech Camera"
              >
                {isCameraOpen ? <Camera size={24} /> : <Video size={24} />}
              </button>

              <button
                onClick={handleToggleListening}
                className={`p-6 rounded-full transition-all duration-300 transform ${
                  isListening 
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30 scale-110' 
                    : 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-500 hover:scale-105'
                }`}
                title="Toggle Speech-to-Sign Mic"
              >
                {isListening ? <MicOff size={32} /> : <Mic size={32} />}
              </button>
            </div>
            <p className="text-center text-xs text-slate-500 mt-3">
              {isListening ? "Listening... Tap to stop" : "Tap microphone to speak"}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;