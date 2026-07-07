import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    let body: any = {};
    try {
      body = await request.json();
    } catch (e) {
      // Bỏ qua nếu request body rỗng
    }
    const { text, voiceName = 'vi-VN-Neural2-D' } = body;

    if (!text) {
      return NextResponse.json({ error: 'Văn bản là bắt buộc' }, { status: 400 });
    }

    const apiKey = process.env.GOOGLE_TTS_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Chưa cấu hình Google TTS API Key' }, { status: 500 });
    }

    const googleTtsUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

    const response = await fetch(googleTtsUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: { text },
        voice: {
          languageCode: 'vi-VN',
          name: voiceName,
        },
        audioConfig: {
          audioEncoding: 'MP3',
          speakingRate: 0.85, // Đọc chậm một chút giúp các bé 6 tuổi nghe rõ hơn
          pitch: 1.0,
        },
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error('Google Cloud TTS API Error:', errData);
      return NextResponse.json({ error: 'Lỗi tổng hợp giọng nói từ Google Cloud' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json({ audioContent: data.audioContent });
  } catch (error: any) {
    console.error('TTS API Route Error:', error);
    return NextResponse.json({ error: error.message || 'Lỗi Server Nội bộ' }, { status: 500 });
  }
}
