const pdfParse = require('pdf-parse');
const fs = require('fs');
const Groq = require('groq-sdk');
const Session = require('../models/Session');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Step 1 - Upload Resume + Extract Text
const uploadResume = async (req, res) => {
  try {
    const filePath = req.file.path;
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;

    fs.unlinkSync(filePath);

    res.json({ success: true, resumeText });
  } catch (err) {
    console.error('Resume upload error:', err);
    res.status(500).json({ message: 'Failed to parse resume' });
  }
};

// Step 2 - Start Interview (Generate Questions)
const startInterview = async (req, res) => {
  const { resumeText, jobDescription } = req.body;

  try {
    const prompt = `
You are a Senior Software Engineer and Hiring Manager at a top product-based technology company (Google, Microsoft, Amazon, Meta, Atlassian, etc.).

Your task is to generate interview questions for a REAL technical interview.

## Candidate Resume
${resumeText}

## Job Description
${jobDescription}

## Objective
Generate exactly 8 interview questions that evaluate whether this candidate is suitable for the given role.

### Distribution
1. 3 Technical Questions
   - Focus on technologies, languages, frameworks, tools, and concepts that appear in BOTH the resume and the job description whenever possible.
   - If there is little overlap, prioritize the job description while using the closest relevant experience from the resume.

2. 2 Project Questions
   - Ask about projects explicitly mentioned in the resume.
   - Dig into architecture, design decisions, scalability, trade-offs, debugging, challenges, performance, security, or implementation details.
   - Avoid simply asking "Explain your project."

3. 2 Behavioral Questions
   - Relevant to the role.
   - Encourage answers using the STAR framework without explicitly mentioning STAR.
   - Focus on teamwork, ownership, leadership, conflict resolution, learning, deadlines, or failure.

4. 1 Situational Question
   - Present a realistic engineering scenario related to the job.
   - Require the candidate to explain their approach, reasoning, and trade-offs.

### Quality Requirements
- Questions must be personalized to THIS resume.
- Reference actual projects, technologies, internships, achievements, or experiences from the resume.
- Never invent technologies or projects not present in the resume.
- Avoid generic textbook questions.
- Avoid yes/no questions.
- Avoid duplicate topics.
- Each question should require a detailed 2–5 minute response.
- Questions should progressively increase in difficulty.
- Make the final 2 questions the most challenging.

### If Information is Missing
- If the resume lacks sufficient project details, create project questions based on the available experience instead of inventing information.

### Additional Rules
- If the candidate is a student with no internship experience, replace internship-based questions with strong academic project or open source questions.
- Never fabricate company names, technologies, or achievements not present in the resume.
- The final question must be the hardest and most open-ended.

### Output Format
Return ONLY a valid JSON array containing exactly 8 strings.

Example:
[
  "Question 1",
  "Question 2",
  "...",
  "Question 8"
]

Do not include markdown, explanations, numbering, or any additional text.
    `;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const raw = completion.choices[0].message.content;

    // Clean and parse JSON
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const questions = JSON.parse(cleaned);

    // Save session to MongoDB
    const session = await Session.create({
      userId: req.user.id,
      resumeText,
      jobDescription,
      questions,
      transcript: [],
      status: 'ongoing',
    });

    res.json({ success: true, sessionId: session._id, questions });
  } catch (err) {
    console.error('Start interview error:', err);
    res.status(500).json({ message: 'Failed to generate questions' });
  }
};

// Step 3 - Answer a Question (Cross Questioning)
const answerQuestion = async (req, res) => {
  const { sessionId, question, answer, crossQuestionCount } = req.body;

  try {
    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });

    // Save Q&A to transcript
    session.transcript.push({ question, answer });
    await session.save();

    // Limit cross questions to max 2 per main question
    if (crossQuestionCount >= 2) {
      return res.json({ success: true, followUp: null, message: 'Move to next question' });
    }

    const prompt = `
You are a Senior Software Engineer conducting a technical interview at a top tech company.

The candidate was asked: "${question}"
The candidate answered: "${answer}"

Evaluate the depth and quality of the answer:

If the answer is INCOMPLETE or SHALLOW:
- Ask ONE sharp follow-up that forces the candidate to go deeper
- Challenge vague claims by asking for specifics, metrics, or real examples
- If they mentioned a technology, ask how it works internally
- If they mentioned a solution, ask about edge cases or trade-offs

If the answer is THOROUGH and COMPLETE:
- Reply with exactly "NEXT"

Rules:
- Never repeat what was already covered in their answer
- Be concise — one focused question only
- Sound like a real interviewer, not a quiz

Reply with ONLY the follow-up question or the word "NEXT". Nothing else.
    `;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const followUp = completion.choices[0].message.content.trim();

    if (followUp === 'NEXT') {
      res.json({ success: true, followUp: null, message: 'Move to next question' });
    } else {
      res.json({ success: true, followUp });
    }
  } catch (err) {
    console.error('Answer question error:', err);
    res.status(500).json({ message: 'Failed to process answer' });
  }
};

module.exports = { uploadResume, startInterview, answerQuestion };