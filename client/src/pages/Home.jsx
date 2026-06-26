import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const Home = () => {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleStartInterview = async () => {
    if (!resume || !jobDescription) {
      setError('Please upload your resume and enter a job description');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('resume', resume);
      const uploadRes = await API.post('/interview/upload', formData);
      const resumeText = uploadRes.data.resumeText;

      const startRes = await API.post('/interview/start', { resumeText, jobDescription });

      localStorage.setItem('sessionId', startRes.data.sessionId);
      localStorage.setItem('questions', JSON.stringify(startRes.data.questions));
      localStorage.setItem('resumeText', resumeText);

      navigate('/interview');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-16" style={{ background: 'linear-gradient(180deg, #f5f3ff 0%, #f4f5f7 40%)' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-200 text-violet-600 text-xs font-semibold px-4 py-2 rounded-full mb-6">
            🎙️ AI Powered Mock Interviews
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Ace Your Next<br />
            <span className="text-violet-600">Interview</span>
          </h1>
          <p className="text-gray-500 text-lg">
            Upload your resume and job description. Our AI will conduct a personalized mock interview and give you detailed feedback.
          </p>
        </div>

        {/* Card */}
        <div className="card p-8 flex flex-col gap-6">
          {/* Resume Upload */}
          <div>
            <label className="text-gray-600 text-xs font-semibold mb-3 block uppercase tracking-wider">Resume (PDF)</label>
            <label className="flex items-center gap-4 bg-gray-50 border-2 border-dashed border-gray-200 hover:border-violet-400 hover:bg-violet-50 rounded-xl px-4 py-4 cursor-pointer transition-all group">
              <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600 group-hover:bg-violet-200 transition-all">
                📄
              </div>
              <div>
                {resume ? (
                  <p className="text-green-600 font-medium text-sm">✅ {resume.name}</p>
                ) : (
                  <>
                    <p className="text-gray-700 text-sm font-medium">Click to upload resume</p>
                    <p className="text-gray-400 text-xs">PDF files only</p>
                  </>
                )}
              </div>
              <input
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => setResume(e.target.files[0])}
              />
            </label>
          </div>

          {/* Job Description */}
          <div>
            <label className="text-gray-600 text-xs font-semibold mb-3 block uppercase tracking-wider">Job Description</label>
            <textarea
              rows={6}
              placeholder="Paste the job description here..."
              className="input resize-none"
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <button
            onClick={handleStartInterview}
            disabled={loading}
            className="btn-primary py-4 rounded-xl font-semibold text-lg disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Preparing your interview...
              </span>
            ) : '🎙️ Start Interview'}
          </button>

          {/* Features */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            {[
              { icon: '🤖', label: 'AI Questions' },
              { icon: '🔄', label: 'Cross Questions' },
              { icon: '📊', label: 'Detailed Report' },
            ].map((f) => (
              <div key={f.label} className="text-center">
                <div className="text-2xl mb-1">{f.icon}</div>
                <div className="text-gray-400 text-xs font-medium">{f.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;