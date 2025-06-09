import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export async function askJarvis(userMessage: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are Jarvis, an AI assistant for 24kamera.uz, a security camera and electronics store in Uzbekistan. You help customers with:
          - Security camera recommendations
          - Technical specifications
          - Installation advice
          - Product comparisons
          - General security questions
          
          Always respond in a helpful, professional manner. If asked about products not related to security cameras or electronics, politely redirect to your expertise. Respond in the same language as the user (Uzbek, Russian, or English).`
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    return response.choices[0].message.content || "Kechirasiz, javob berishda xatolik yuz berdi. Iltimos, qayta urinib ko'ring.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    return "Kechirasiz, hozirda xizmat mavjud emas. Iltimos, keyinroq urinib ko'ring yoki bizga qo'ng'iroq qiling: +998 91 308 95 12";
  }
}

export async function calculateCameraRecommendation(area: number, angle: number, distance: number): Promise<{
  recommendedCount: number;
  coverage: number;
  suggestions: string[];
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a security camera expert. Calculate camera recommendations based on area coverage. Provide JSON response with:
          - recommendedCount: number of cameras needed
          - coverage: actual coverage area per camera
          - suggestions: array of helpful tips
          
          Use practical formulas for camera coverage calculations.`
        },
        {
          role: "user",
          content: `Calculate camera requirements for:
          - Area: ${area} square meters
          - Viewing angle: ${angle} degrees
          - Maximum distance: ${distance} meters
          
          Provide recommendations in JSON format.`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 300
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      recommendedCount: result.recommendedCount || Math.ceil(area / 50),
      coverage: result.coverage || (angle / 90) * (distance * distance * Math.PI / 4),
      suggestions: result.suggestions || [
        "Kameralarni strategik joylarga o'rnating",
        "Yoritish sharoitlarini hisobga oling",
        "Backup tizimi o'rnating"
      ]
    };
  } catch (error) {
    console.error("Camera calculation error:", error);
    // Fallback calculation
    const coverage = (angle / 90) * (distance * distance * Math.PI / 4);
    const recommendedCount = Math.ceil(area / coverage);
    
    return {
      recommendedCount,
      coverage,
      suggestions: [
        "Kameralarni strategik joylarga o'rnating",
        "Yoritish sharoitlarini hisobga oling",
        "Backup tizimi o'rnating"
      ]
    };
  }
}
