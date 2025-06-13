class AIService {
  static GEMINI_API_URL = process.env.REACT_APP_GEMINI_API_URL;
  static GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

  static async generateContent(prompt) {
    if (!this.GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    try {
      const response = await fetch(`${this.GEMINI_API_URL}?key=${this.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const result = await response.json();
      
      if (!result.candidates || !result.candidates[0]?.content?.parts?.[0]) {
        throw new Error('Invalid AI response format');
      }

      return result.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw new Error('Failed to generate AI content');
    }
  }

  static async analyzeTrade(trade, accountCurrency) {
    const prompt = `Anda adalah psikolog trading. Analisis catatan dari satu trade ini:
      Pair: ${trade.pair}
      Profit/Loss: ${trade.pl} ${accountCurrency}
      Catatan: "${trade.notes}"
      
      Berikan analisis psikologis membangun 1-2 paragraf. Identifikasi bias (FOMO, dll.) dan berikan satu saran konkret.`;

    return this.generateContent(prompt);
  }

  static async analyzePerformance(tradeHistory) {
    const prompt = `Anda adalah mentor trading. Analisis riwayat trading ini. 
      Berikan masukan tajam format poin-poin HTML (<ul><li>). 
      Sertakan juga ringkasan dari trade dengan profit terbesar dan loss terbesar sebagai contoh. 
      Fokus pada: pola profit/loss, strategi/pair terbaik & terburuk, kesalahan psikologis dari catatan, 
      dan 1-2 saran perbaikan terpenting. Data: ${JSON.stringify(tradeHistory)}`;

    return this.generateContent(prompt);
  }

  static async getRiskAnalysis(params) {
    const { 
      accountCurrency, 
      balance, 
      riskPercentage, 
      stopLoss, 
      lotSize, 
      pair 
    } = params;

    const prompt = `Saya trading di akun ${accountCurrency} dengan saldo ${balance}. 
      Saya berencana membuka posisi di ${pair} dengan risiko ${riskPercentage}% 
      dan stop loss ${stopLoss} pips. Kalkulator menyarankan total lot size ${lotSize}. 
      Berdasarkan ini:
      1. Berikan 'sanity check' singkat. Apakah ini rencana manajemen risiko yang masuk akal?
      2. Berikan rekomendasi strategi layering (misal, 2-3 layer) dengan pembagian lot yang sesuai 
         untuk setiap layer (total lot harus sama dengan ${lotSize}) dan berikan saran perkiraan 
         titik entry untuk setiap layer relatif terhadap harga saat ini.
      Gunakan format HTML yang jelas.`;

    return this.generateContent(prompt);
  }

  static async getMarketAnalysis(params) {
    const { 
      watchedPairs, 
      newsHeadlines 
    } = params;

    const prompt = `Anda adalah analis pasar keuangan netral. 
      Berdasarkan berita utama forex berikut: "${newsHeadlines}". 
      Dan dengan fokus pada pasangan mata uang ini: "${watchedPairs}". 
      Berikan ringkasan sentimen pasar saat ini dalam 2-3 poin singkat (gunakan <ul><li>). 
      Hindari saran beli/jual, fokus hanya pada potensi volatilitas atau arah umum yang 
      diimplikasikan oleh berita.`;

    return this.generateContent(prompt);
  }
}

export default AIService;
