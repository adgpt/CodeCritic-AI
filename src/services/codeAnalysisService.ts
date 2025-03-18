
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load API Key securely
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.error("⚠️ Missing Gemini API Key! Ensure it's set in your .env file.");
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export async function analyzeCode(code: string) {
  try {
    const prompt = generatePrompt(code);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean JSON before parsing
    const cleanJSON = text.replace(/```json|```/g, "").trim();

    return parseGeminiResponse(cleanJSON);
  } catch (error: any) {
    console.error("❌ Error analyzing code:", error);
    return {
      summary: "Error analyzing code",
      issues: [{ type: "error", message: error.message || "Failed to analyze code" }],
    };
  }
}

// Ensures Gemini outputs RAW JSON without Markdown formatting
function generatePrompt(code: string) {
  return `You are a code review assistant. Analyze the following code and return structured JSON feedback.

- Identify issues related to:
  - Code quality and best practices
  - Potential bugs and issues
  - Performance considerations
  - Security concerns
  - Maintainability

Code:
\`\`\`
${code}
\`\`\`

Return only **raw JSON** without Markdown formatting:
{
  "summary": "Overall feedback on the code",
  "issues": [
    { "type": "error", "message": "Critical issue found", "code": "optional code snippet" },
    { "type": "warning", "message": "Potential improvement suggestion" },
    { "type": "info", "message": "Informational note" },
    { "type": "success", "message": "Good practice found" }
  ]
}`;
}

// Parses AI response safely
function parseGeminiResponse(response: string) {
  try {
    return JSON.parse(response);
  } catch (error) {
    console.error("⚠️ Error parsing AI response:", error);
    return {
      summary: "Invalid response format",
      issues: [{ type: "error", message: "Could not parse AI response" }],
    };
  }
}
