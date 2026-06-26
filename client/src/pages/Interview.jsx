import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const Interview = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [transcript, setTranscript] = useState([]);
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [crossQuestionCount, setCrossQuestionCount] = useState(0);
  const sessionId = localStorage.getItem('sessionId');
  const navigate = useNavigate();
  const recognitionRef = useRef(null);

  useEffect(() => {
    const qs = JSON.parse(localStorage.getItem('questions') || '[]');
    setQuestions(qs);
    setCurrentQuestion(qs[0] || '');
    speakQuestion(qs[0] || '');
  }, []);

  const speakQuestion = (text) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Use Chrome for voice support.');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (e) => setAnswer(e.results[0][0].transcript);
    recognition.onend = () => setListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  };

  const handleSubmitAnswer = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    try {
      const res = await API.post('/interview/answer', {
        sessionId,
        question: currentQuestion,
        answer,
        crossQuestionCount,
      });

      setTranscript([...transcript, { question: currentQuestion, answer }]);
      setAnswer('');

      if (res.data.followUp) {
        setCurrentQuestion(res.data.followUp);
        speakQuestion(res.data.followUp);
        setCrossQuestionCount(prev => prev + 1);
      } else {
        setCrossQuestionCount(0);
        const nextIndex = currentIndex + 1;
        if (nextIndex < questions.length) {
          setCurrentIndex(nextIndex);
          setCurrentQuestion(questions[nextIndex]);
          speakQuestion(questions[nextIndex]);
        } else {
          setDone(true);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen px-6 py-10" style={{ background: 'linear-gradient(180deg, #f5f3ff 0%, #f4f5f7 30%)' }}>
      <div className="max-w-2xl mx-auto">
        {!done ? (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Mock Interview</h2>
                <p className="text-gray-500 text-sm">
                  Question {currentIndex + 1} of {questions.length}
                  {crossQuestionCount > 0 && (
                    <span className="text-violet-600 ml-2 font-medium">(Follow-up {crossQuestionCount})</span>
                  )}
                </p>
              </div>
              <div className="text-right">
                <span className="text-violet-600 font-bold text-2xl">{currentIndex + 1}</span>
                <span className="text-gray-400">/{questions.length}</span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-1.5 mb-8">
              <div
                className="h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #7c3aed, #a78bfa)' }}
              />
            </div>

            {/* Question Card */}
            <div className="card p-6 mb-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600 shrink-0 text-lg">
                  🤖
                </div>
                <div className="flex-1">
                  <p className="text-xs text-violet-600 font-semibold uppercase tracking-wider mb-2">Interviewer</p>
                  <p className="text-gray-800 text-lg leading-relaxed">{currentQuestion}</p>
                  <button
                    onClick={() => speakQuestion(currentQuestion)}
                    className="text-xs text-gray-400 hover:text-violet-600 mt-3 transition-colors"
                  >
                    🔊 Repeat question
                  </button>
                </div>
              </div>
            </div>

            {/* Answer Section */}
            <div className="card p-6 flex flex-col gap-4">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Your Answer</p>
              <textarea
                rows={4}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Speak or type your answer here..."
                className="input resize-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={startListening}
                  className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all border ${
                    listening
                      ? 'bg-red-50 border-red-300 text-red-500 animate-pulse'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-violet-400 hover:text-violet-600'
                  }`}
                >
                  {listening ? '🔴 Listening...' : '🎙️ Speak Answer'}
                </button>
                <button
                  onClick={handleSubmitAnswer}
                  disabled={loading || !answer.trim()}
                  className="flex-1 btn-primary py-3 rounded-xl font-medium text-sm disabled:opacity-40"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </span>
                  ) : 'Submit Answer →'}
                </button>
              </div>
            </div>

            {/* Transcript */}
            {transcript.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Transcript</h3>
                <div className="flex flex-col gap-3">
                  {transcript.map((item, i) => (
                    <div key={i} className="card p-4">
                      <p className="text-violet-600 text-xs font-medium mb-1">Q: {item.question}</p>
                      <p className="text-gray-600 text-sm">A: {item.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="card p-12 text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-3">Interview Complete!</h3>
            <p className="text-gray-500 mb-8">Great job! Your AI analysis report is ready.</p>
            <button
              onClick={() => navigate('/report')}
              className="btn-primary px-10 py-4 rounded-xl font-semibold text-lg"
            >
              View My Report →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Interview;