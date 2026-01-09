import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateBlog(req, res) {
  try {
    const { topic } = req.body;

    const prompt = `Write a detailed SEO-friendly blog on: "${topic}"
    Respond in JSON format:
    {
      "title": "",
      "tags": [],
      "content": ""
    }`;

    const response = await openai.chat.completions.create({
      model: 'gpt-5.2',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    const text = response.choices[0].message.content;
    const json = JSON.parse(text.substring(text.indexOf('{')));

    res.status(200).json({
      ok: true,
      message: 'Blog generated successfully',
      ...json,
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

    const prompt = `
      Generate 5 engaging blog titles for this content:
      "${content}"
      Respond as: { "titles": [] }
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-5.2',
      messages: [{ role: 'user', content: prompt }],
    });

    const json = JSON.parse(response.choices[0].message.content);

    res.status(200).json({
      ok: true,
      message: 'Titles generated successfully',
      ...json,
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

    const prompt = `
      Fix grammar, clarity, and fluency of the following:
      "${content}"
      Return only improved text.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-5.2',
      messages: [{ role: 'user', content: prompt }],
    });

    res.json({
      ok: true,
      message: 'Grammar fixed successfully',
      content: response.choices[0].message.content,
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

    const prompt = `
      Improve this blog: add depth, detail, and improve readability.
      "${content}"
      Return improved content only.
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-5.2',
      messages: [{ role: 'user', content: prompt }],
    });

    res.json({
      ok: true,
      message: 'Content improved successfully',
      content: response.choices[0].message.content,
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
