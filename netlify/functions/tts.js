exports.handler = async (event) => {
  const { text, lang = 'es-US' } = event.queryStringParameters || {};
  if (!text) return { statusCode: 400, body: 'Missing text' };
  const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&ttsspeed=0.85&tl=${lang}&q=${encodeURIComponent(text)}`;
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://translate.google.com/'
      }
    });
    if (!response.ok) return { statusCode: response.status, body: 'TTS fetch failed' };
    const buffer = await response.arrayBuffer();
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400',
        'Access-Control-Allow-Origin': '*'
      },
      body: Buffer.from(buffer).toString('base64'),
      isBase64Encoded: true
    };
  } catch (err) {
    return { statusCode: 502, body: 'Proxy error: ' + err.message };
  }
};
