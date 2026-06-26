const Groq = require('groq-sdk');
const Session = require('../models/Session');
const Report = require('../models/Report');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateReport = async (req, res) => {
  const { sessionId } = req.body;

  try {
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const transcriptText = session.transcript
      .map((t, i) => `Q${i + 1}: ${t.question}\nA: ${t.answer}`)
      .join('\n\n');

    const prompt = `
You are an expert interview evaluator.
Analyze the following interview transcript and generate a detailed report.

Include:
1. Overall Score (out of 10)
2. Technical Knowledge — strengths and weaknesses
3. Communication Skills
4. Areas of Improvement
5. Final Recommendation (Ready / Needs Preparation / Not Ready)

Transcript:
${transcriptText}
    `;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const reportText = completion.choices[0].message.content;

    const report = await Report.create({
      sessionId,
      userId: req.user.id,
      reportText,
    });

    session.status = 'completed';
    await session.save();

    res.json({ success: true, report: report.reportText });
  } catch (err) {
    console.error('Report generation error:', err);
    res.status(500).json({ message: 'Failed to generate report' });
  }
};

module.exports = { generateReport };