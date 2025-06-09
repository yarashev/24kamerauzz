import OpenAI from "openai";

const openai = new OpenAI({ baseURL: "https://api.x.ai/v1", apiKey: process.env.XAI_API_KEY });

// Jarvis maslahatchi uchun kamera va xavfsizlik bo'yicha maslahat berish
export async function askJarvisGrok(userMessage: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "grok-2-1212",
      messages: [
        {
          role: "system",
          content: `Siz 24kamera.uz saytining professional Jarvis maslahatchisisiz. Siz kamera va xavfsizlik tizimlaridagi mutaxassisssiz. 
          
          Sizning vazifangiz:
          - Kameralar va xavfsizlik tizimlari bo'yicha professional maslahat berish
          - Turli brendlar (Hikvision, Dahua, HiLook, HiWatch, EZVIZ, Imou, TP-Link, TVT) orasidan eng mos keluvchisini tavsiya qilish
          - IP kameralar, Turbo HD, Wi-Fi kameralar, DVR, NVR tizimlari haqida ma'lumot berish
          - Narx va sifat balansini hisobga olgan holda maslahat berish
          - Faqat o'zbek tilida javob bering
          - Qisqa va aniq javoblar bering
          - Agar savolga javob berish uchun qo'shimcha ma'lumot kerak bo'lsa, so'rang`
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    return response.choices[0].message.content || "Kechirasiz, javob bermadim. Iltimos, boshqa savol bering.";
  } catch (error) {
    console.error("Grok API xatosi:", error);
    return "Kechirasiz, hozirda maslahat xizmatida texnik muammo. Iltimos, keyinroq qayta urinib ko'ring.";
  }
}

// Kamera tavsiyasi hisoblash
export async function calculateCameraRecommendationGrok(area: number, angle: number, distance: number): Promise<{
  recommendedBrand: string;
  recommendedModel: string;
  specifications: string[];
  price: string;
  reasoning: string;
}> {
  try {
    const prompt = `Quyidagi parametrlar asosida eng mos kamera tavsiya qiling:
    - Hudud: ${area} kv.m
    - Ko'rish burchagi: ${angle} daraja
    - Masofa: ${distance} metr
    
    24kamera.uz saytida mavjud brendlar: Hikvision, Dahua, HiLook, HiWatch, EZVIZ, Imou, TP-Link, TVT
    
    JSON formatida javob bering: {"recommendedBrand": "", "recommendedModel": "", "specifications": [], "price": "", "reasoning": ""}`;

    const response = await openai.chat.completions.create({
      model: "grok-2-1212",
      messages: [
        {
          role: "system",
          content: "Siz kamera mutaxassisi sifatida aniq tavsiyalar berasiz. Faqat JSON formatida javob bering."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 400
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      recommendedBrand: result.recommendedBrand || "Hikvision",
      recommendedModel: result.recommendedModel || "DS-2CD1023G0-I",
      specifications: result.specifications || ["2MP", "IR 30m", "H.265+"],
      price: result.price || "650,000 so'm",
      reasoning: result.reasoning || "Sizning parametrlaringiz uchun eng maqbul tanlov"
    };
  } catch (error) {
    console.error("Grok kamera tavsiya xatosi:", error);
    return {
      recommendedBrand: "Hikvision",
      recommendedModel: "DS-2CD1023G0-I", 
      specifications: ["2MP", "IR 30m", "H.265+"],
      price: "650,000 so'm",
      reasoning: "Umumiy foydalanish uchun tavsiya"
    };
  }
}