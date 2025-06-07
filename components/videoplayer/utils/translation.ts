export async function translateText(
  text: string,
  targetLanguage: string,
  service: "google" | "deepl" = "google",
): Promise<string> {
  try {
    if (service === "google") {
      return await translateWithGoogle(text, targetLanguage)
    } else {
      return await translateWithDeepL(text, targetLanguage)
    }
  } catch (error) {
    console.error("Translation failed:", error)
    return text
  }
}

async function translateWithGoogle(text: string, targetLanguage: string): Promise<string> {
  // Using Google Translate API (requires API key)
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY
  if (!apiKey) {
    throw new Error("Google Translate API key not found")
  }

  const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      q: text,
      target: targetLanguage,
      format: "text",
    }),
  })

  const data = await response.json()
  return data.data.translations[0].translatedText
}

async function translateWithDeepL(text: string, targetLanguage: string): Promise<string> {
  // Using DeepL API (requires API key)
  const apiKey = process.env.NEXT_PUBLIC_DEEPL_API_KEY
  if (!apiKey) {
    throw new Error("DeepL API key not found")
  }

  const response = await fetch("https://api-free.deepl.com/v2/translate", {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${apiKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      text,
      target_lang: targetLanguage.toUpperCase(),
    }),
  })

  const data = await response.json()
  return data.translations[0].text
}

export const supportedLanguages = {
  google: [
    { code: "en", name: "English" },
    { code: "tr", name: "Türkçe" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
    { code: "it", name: "Italiano" },
    { code: "pt", name: "Português" },
    { code: "ru", name: "Русский" },
    { code: "ja", name: "日本語" },
    { code: "ko", name: "한국어" },
    { code: "zh", name: "中文" },
    { code: "ar", name: "العربية" },
  ],
  deepl: [
    { code: "EN", name: "English" },
    { code: "TR", name: "Türkçe" },
    { code: "ES", name: "Español" },
    { code: "FR", name: "Français" },
    { code: "DE", name: "Deutsch" },
    { code: "IT", name: "Italiano" },
    { code: "PT", name: "Português" },
    { code: "RU", name: "Русский" },
    { code: "JA", name: "日本語" },
    { code: "ZH", name: "中文" },
  ],
}
