import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function generateBlog(req, res) {
  try {
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ ok: false, message: 'Topic is required' });
    }

    const prompt = `
      Write a full high-quality blog post about: "${topic}"
      Format using:
      - proper headings
      - paragraphs
      - examples
      - insights
    `;

    const response = await model.generateContent(prompt);
    const text = response.response.text();

    res.status(200).json({
      ok: true,
      message: 'Blog generated successfully',
      content: text,
    });
  } catch (error) {
    console.error('Error in generateBlog():', error);
    res.status(500).json({
      ok: false,
      message: 'Failed to generate blog',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

export async function generateTitles(req, res) {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ ok: false, message: 'Content is required' });
    }

    const prompt = `
      Based on the following content, suggest 5 attractive, SEO-friendly blog titles:
      ${content}
    `;

    const response = await model.generateContent(prompt);
    const text = response.response.text();
    const titles = text.split('\n').filter((t) => t.trim() !== '');

    res.status(200).json({
      ok: true,
      message: 'Titles generated successfully',
      titles,
    });
  } catch (error) {
    console.error('Error in generateTitles():', error);
    res.status(500).json({
      ok: false,
      message: 'Failed to generate titles',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

export async function fixGrammar(req, res) {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({ ok: false, message: 'Content is required' });
    }

    const prompt = `
      Fix grammar, punctuation, and clarity without changing the meaning:
      ${content}
    `;

    const response = await model.generateContent(prompt);
    const text = response.response.text();

    res.json({
      ok: true,
      message: 'Grammar fixed successfully',
      content: text,
    });
  } catch (error) {
    console.error('Error in fixGrammar():', error);
    res.status(500).json({
      ok: false,
      message: 'Failed to fix grammar',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}

export async function improveContent(req, res) {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ ok: false, message: 'Content is required' });

    const prompt = `
      Improve this content for readability, structure, and quality. Make it engaging & professional:
      ${content}
    `;

    const response = await model.generateContent(prompt);
    const text = response.response.text();

    res.json({
      ok: true,
      message: 'Content improved successfully',
      content: text,
    });
  } catch (error) {
    console.error('Error in improveContent():', error);
    res.status(500).json({
      ok: false,
      message: 'Failed to improve content',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
