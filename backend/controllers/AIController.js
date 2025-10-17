const path = require('node:path');
if (!process.env.OPENAI_API_KEY) {
  try {
    require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
  } catch (_) { }
}

let OpenAI;
try {
  ({ OpenAI } = require('@langchain/openai'));
} catch (_) {
  OpenAI = null;
}

const DEFAULT_OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo-instruct';
const DEFAULT_MAX_TOKENS = Number(process.env.OPENAI_MAX_TOKENS || 512);

const llm = (OpenAI && process.env.OPENAI_API_KEY)
  ? new OpenAI({
      model: DEFAULT_OPENAI_MODEL,
      temperature: 0,
      timeout: undefined,
      maxRetries: 1,
      maxTokens: DEFAULT_MAX_TOKENS,
      apiKey: process.env.OPENAI_API_KEY,
    })
  : null;

const askAI = async (req, res) => {
  const body = req.body || {};
  const inputText = typeof body.prompt === 'string' ? body.prompt : '';
  const requestedMaxTokens = Number(body.max_tokens ?? body.maxTokens);
  const requestedTemperature = body.temperature !== undefined ? Number(body.temperature) : undefined;
  const useCustom = Number.isFinite(requestedMaxTokens) || Number.isFinite(requestedTemperature);

  if (!llm) {
    return res.status(501).json({
      success: false,
      error: 'AI not configured. Install @langchain/openai and set OPENAI_API_KEY.'
    });
  }

  if (!inputText) {
    return res.status(400).json({ success: false, error: 'Missing prompt' });
  }

  try {
    let modelToUse = llm;
    if (useCustom) {
      modelToUse = new OpenAI({
        model: DEFAULT_OPENAI_MODEL,
        temperature: Number.isFinite(requestedTemperature) ? requestedTemperature : 0,
        timeout: undefined,
        maxRetries: 1,
        maxTokens: Number.isFinite(requestedMaxTokens) ? requestedMaxTokens : DEFAULT_MAX_TOKENS,
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
    const result = await modelToUse.invoke(inputText);
    const text = typeof result === 'string' ? result : (result?.content ?? String(result));
    return res.status(200).json({ success: true, text });
  } catch (err) {
    console.error('AI invocation failed:', err?.response?.data || err?.message || err);
    return res.status(500).json({ success: false, error: 'AI request failed' });
  }
};

module.exports = { askAI };