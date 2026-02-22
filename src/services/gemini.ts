import { GoogleGenAI, Type } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

const ai = new GoogleGenAI({ apiKey });

export interface StockAnalysis {
  companySummary: string;
  scorecard: {
    financialHealth: string;
    growth: string;
    valuation: string;
  };
  buyNowChecklist: {
    priceContext: string;
    expertOpinion: string;
    historicalPattern: string;
  };
  postBuySupport: {
    whatToWatch: string;
    exitLogic: string;
  };
  news: {
    title: string;
    summary: string;
    date: string;
  }[];
}

export async function analyzeStock(stockName: string): Promise<StockAnalysis> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Analyze the stock '${stockName}' for a beginner investor.
    Use plain, jargon-free language. Do not give buy/sell advice. Just inform.
    Also fetch the latest news about this company and provide a plain language summary for each news item.
    Provide the output in JSON format.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          companySummary: {
            type: Type.STRING,
            description: "Plain language description of what the company does and how it makes money.",
          },
          scorecard: {
            type: Type.OBJECT,
            properties: {
              financialHealth: { type: Type.STRING, description: "e.g., 'Strong - They have more cash than debt.'" },
              growth: { type: Type.STRING, description: "e.g., 'Growing fast - Sales are up 20% this year.'" },
              valuation: { type: Type.STRING, description: "e.g., 'Expensive - People are paying a premium for it right now.'" },
            },
            required: ["financialHealth", "growth", "valuation"],
          },
          buyNowChecklist: {
            type: Type.OBJECT,
            properties: {
              priceContext: { type: Type.STRING, description: "e.g., 'It is currently priced lower than its 3-month average.'" },
              expertOpinion: { type: Type.STRING, description: "e.g., 'Most analysts think it will continue to grow.'" },
              historicalPattern: { type: Type.STRING, description: "e.g., 'It usually dips in the summer but recovers by winter.'" },
            },
            required: ["priceContext", "expertOpinion", "historicalPattern"],
          },
          postBuySupport: {
            type: Type.OBJECT,
            properties: {
              whatToWatch: { type: Type.STRING, description: "e.g., 'Keep an eye on their next earnings report in October.'" },
              exitLogic: { type: Type.STRING, description: "e.g., 'Consider selling if their core delivery business starts losing money.'" },
            },
            required: ["whatToWatch", "exitLogic"],
          },
          news: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "Headline of the news article" },
                summary: { type: Type.STRING, description: "Plain language summary of the news" },
                date: { type: Type.STRING, description: "Approximate date or time of the news (e.g., '2 days ago')" },
              },
              required: ["title", "summary", "date"],
            },
            description: "Recent news articles related to the stock, summarized in plain language.",
          },
        },
        required: ["companySummary", "scorecard", "buyNowChecklist", "postBuySupport", "news"],
      },
    },
  });

  return JSON.parse(response.text || "{}");
}
