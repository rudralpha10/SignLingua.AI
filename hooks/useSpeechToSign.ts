import { useState, useEffect, useRef, useCallback } from 'react';
import { generateGlossFromText } from '../services/geminiService';

interface SpeechToSignState {
  isListening: boolean;
  transcript: string;
  gloss: string | null;
  error: string | null;
  startListening: () => void;
  stopListening: () => void;
}

export const useSpeechToSign = (): SpeechToSignState => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [gloss, setGloss] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  const handleTranslation = useCallback(async (text: string) => {
    try {
        const result = await generateGlossFromText(text);
        setGloss(result);
    } catch (err) {
        console.error(err);
        setError("Translation failed.");
    }
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false; // Capture one sentence at a time for translation
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setError(null);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onerror = (event: any) => {
          console.warn("Speech recognition error:", event.error);
          
          switch (event.error) {
            case 'no-speech':
              setError("No speech detected. Please try again.");
              break;
            case 'not-allowed':
              setError("Microphone access denied.");
              break;
            case 'aborted':
              // User stopped listening, not an error
              setError(null);
              break;
            case 'network':
              setError("Network error. Check connection.");
              break;
            default:
              setError(`Speech error: ${event.error}`);
          }
          
          setIsListening(false);
        };

        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          setTranscript(finalTranscript || interimTranscript);

          if (finalTranscript) {
            // Trigger Gemini translation
            handleTranslation(finalTranscript);
          }
        };

        recognitionRef.current = recognition;
      } else {
        setError("Speech recognition not supported in this browser.");
      }
    }
  }, [handleTranslation]);

  const startListening = useCallback(() => {
    if (recognitionRef.current) {
      setTranscript('');
      setGloss(null);
      setError(null);
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error("Already started", e);
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  return {
    isListening,
    transcript,
    gloss,
    error,
    startListening,
    stopListening
  };
};