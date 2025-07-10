// TTS API 代理服务 - 带 Google 翻译功能的版本（16语言完整版）

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// 支持的语言配置（16种已验证语言）
const LANGUAGES = {
  "zh": { name: "Chinese", displayName: "中文", chineseName: "中文", googleCode: "zh-CN" },
  "en": { name: "English", displayName: "English", chineseName: "英语", googleCode: "en" },
  "ja": { name: "Japanese", displayName: "日本語", chineseName: "日语", googleCode: "ja" },
  "ko": { name: "Korean", displayName: "한국어", chineseName: "韩语", googleCode: "ko" },
  "fr": { name: "French", displayName: "Français", chineseName: "法语", googleCode: "fr" },
  "de": { name: "German", displayName: "Deutsch", chineseName: "德语", googleCode: "de" },
  "it": { name: "Italian", displayName: "Italiano", chineseName: "意大利语", googleCode: "it" },
  "vi": { name: "Vietnamese", displayName: "Tiếng Việt", chineseName: "越南语", googleCode: "vi" },
  "es": { name: "Spanish", displayName: "Español", chineseName: "西班牙语", googleCode: "es" },
  "id": { name: "Indonesian", displayName: "Bahasa Indonesia", chineseName: "印尼语", googleCode: "id" },
  "tr": { name: "Turkish", displayName: "Türkçe", chineseName: "土耳其语", googleCode: "tr" },
  "pl": { name: "Polish", displayName: "Polski", chineseName: "波兰语", googleCode: "pl" },
  "pt": { name: "Portuguese", displayName: "Português", chineseName: "葡萄牙语", googleCode: "pt" },
  "nl": { name: "Dutch", displayName: "Nederlands", chineseName: "荷兰语", googleCode: "nl" },
  "sv": { name: "Swedish", displayName: "Svenska", chineseName: "瑞典语", googleCode: "sv" },
  "cs": { name: "Czech", displayName: "Čeština", chineseName: "捷克语", googleCode: "cs" }
};

// 使用 Google Translate API (通过第三方代理)
async function translateText(text: string, targetLang: string): Promise<string> {
  try {
    // 使用 translate.googleapis.com 的简单接口
    const sourceLang = 'zh-CN';
    const targetLangCode = LANGUAGES[targetLang]?.googleCode || targetLang;
    
    // 备选方案1：使用 LibreTranslate API (免费开源)
    try {
      const libreUrl = 'https://libretranslate.de/translate';
      const libreResponse = await fetch(libreUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          source: 'zh',
          target: targetLang === 'zh' ? 'zh' : targetLangCode.split('-')[0],
          format: 'text'
        })
      });
      
      if (libreResponse.ok) {
        const data = await libreResponse.json();
        if (data.translatedText) {
          console.log('Translation via LibreTranslate successful');
          return data.translatedText;
        }
      }
    } catch (e) {
      console.log('LibreTranslate failed, trying alternative...');
    }
    
    // 备选方案2：使用简单的 Google Translate 接口
    const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLangCode}&dt=t&q=${encodeURIComponent(text)}`;
    
    const response = await fetch(googleUrl);
    if (response.ok) {
      const data = await response.json();
      if (data && data[0] && data[0][0] && data[0][0][0]) {
        console.log('Translation via Google successful');
        return data[0][0][0];
      }
    }
    
    throw new Error('All translation methods failed');
  } catch (error) {
    console.error('Translation error:', error);
    // 如果翻译失败，返回原文
    return text;
  }
}

// 生成测试页面
function getTestPage(): string {
  const languageOptions = Object.entries(LANGUAGES)
    .map(([code, info]) => `<option value="${code}">${info.displayName} (${code})</option>`)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>16语言 TTS 语音合成服务</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f5f5;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 2px 20px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            margin-bottom: 10px;
            text-align: center;
        }
        .subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 30px;
        }
        .language-badges {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: center;
            margin: 30px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        .lang-badge {
            background: white;
            padding: 8px 16px;
            border-radius: 20px;
            border: 2px solid #e0e0e0;
            font-size: 14px;
        }
        .input-group {
            margin: 25px 0;
        }
        label {
            display: block;
            margin-bottom: 10px;
            color: #555;
            font-weight: 500;
        }
        input, select, textarea {
            width: 100%;
            padding: 12px;
            font-size: 16px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            box-sizing: border-box;
        }
        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: #4CAF50;
            box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
        }
        textarea {
            min-height: 120px;
            resize: vertical;
        }
        button {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 14px 30px;
            font-size: 16px;
            border-radius: 8px;
            cursor: pointer;
            margin: 5px;
            transition: all 0.3s;
        }
        button:hover {
            background-color: #45a049;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
        }
        .main-button {
            display: block;
            margin: 30px auto;
            padding: 16px 50px;
            font-size: 18px;
            font-weight: 600;
        }
        .checkbox-group {
            margin: 20px 0;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
        }
        .checkbox-group input {
            width: auto;
            margin-right: 10px;
        }
        .test-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 10px;
            margin: 20px 0;
        }
        .test-btn {
            background-color: #2196F3;
            font-size: 13px;
            padding: 10px 8px;
            height: 50px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            line-height: 1.3;
        }
        .test-btn:hover {
            background-color: #1976D2;
        }
        .test-btn .original-lang {
            font-weight: 600;
            font-size: 14px;
        }
        .test-btn .chinese-name {
            font-size: 12px;
            opacity: 0.9;
            margin-top: 2px;
        }
        .translation-output {
            margin-top: 20px;
            padding: 15px;
            background: #e3f2fd;
            border-radius: 8px;
            display: none;
        }
        .translation-output.show {
            display: block;
        }
        .translation-output label {
            font-weight: 600;
            color: #1565c0;
            margin-bottom: 10px;
            display: block;
        }
        .translation-text {
            background: white;
            padding: 12px;
            border-radius: 6px;
            min-height: 60px;
            white-space: pre-wrap;
            word-break: break-word;
            border: 1px solid #90caf9;
        }
        .result-section {
            margin-top: 30px;
            padding: 25px;
            background: #f9f9f9;
            border-radius: 8px;
            display: none;
            border: 2px solid #e9ecef;
        }
        .result-section.show {
            display: block;
        }
        .status {
            padding: 15px;
            border-radius: 6px;
            margin: 15px 0;
            font-weight: 500;
        }
        .status.success { background: #e8f5e9; color: #2e7d32; }
        .status.error { background: #ffebee; color: #c62828; }
        .status.info { background: #e3f2fd; color: #1565c0; }
        audio {
            width: 100%;
            margin: 20px 0;
        }
        #debugInfo {
            margin-top: 15px;
            padding: 15px;
            background: #f5f5f5;
            border-radius: 6px;
            font-family: monospace;
            font-size: 13px;
            color: #666;
            white-space: pre-wrap;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌐 16语言 TTS 语音合成服务</h1>
        <p class="subtitle">支持全球16种主流语言的高质量语音合成</p>
        
        <div class="language-badges">
            ${Object.entries(LANGUAGES).map(([code, info]) => 
                `<span class="lang-badge">${info.displayName}</span>`
            ).join('')}
        </div>
        
        <div class="input-group">
            <label>输入文字：</label>
            <textarea id="textInput" placeholder="输入要转换的文字...">你好，欢迎使用16语言AI语音合成服务。</textarea>
        </div>
        
        <div class="input-group">
            <label>选择目标语言：</label>
            <select id="langSelect">
                ${languageOptions}
            </select>
        </div>
        
        <div class="checkbox-group">
            <label>
                <input type="checkbox" id="autoTranslate">
                启用自动翻译（将中文翻译为目标语言）
            </label>
        </div>
        
        <button class="main-button" onclick="convertToSpeech()">
            🔊 生成语音
        </button>
        
        <div id="translationOutput" class="translation-output">
            <label>翻译后的文字：</label>
            <div id="translationText" class="translation-text"></div>
        </div>
        
        <h3 style="margin-top: 40px;">快速测试各语言：</h3>
        <div class="test-grid">
            ${Object.entries(LANGUAGES).map(([code, info]) => `
                <button class="test-btn" onclick="quickTest('${code}')">
                    <span class="original-lang">${info.displayName}</span>
                    <span class="chinese-name">${info.chineseName}</span>
                </button>
            `).join('')}
        </div>
        
        <div id="resultSection" class="result-section">
            <h3>生成结果</h3>
            <div id="status"></div>
            <audio id="audioPlayer" controls></audio>
            <div id="debugInfo"></div>
        </div>
    </div>

    <script>
        const LANGUAGES = ${JSON.stringify(LANGUAGES)};
        
        function showResult() {
            document.getElementById('resultSection').classList.add('show');
        }
        
        function showStatus(message, type = 'info') {
            const status = document.getElementById('status');
            status.className = 'status ' + type;
            status.textContent = message;
            showResult();
        }
        
        function quickTest(lang) {
            document.getElementById('langSelect').value = lang;
            document.getElementById('autoTranslate').checked = (lang !== 'zh');
            convertToSpeech();
        }
        
        async function convertToSpeech() {
            const text = document.getElementById('textInput').value;
            const lang = document.getElementById('langSelect').value;
            const translate = document.getElementById('autoTranslate').checked;
            const audioPlayer = document.getElementById('audioPlayer');
            const translationOutput = document.getElementById('translationOutput');
            const translationText = document.getElementById('translationText');
            
            if (!text) {
                showStatus('请输入要转换的文字', 'error');
                return;
            }
            
            showStatus('正在生成语音，请稍候...', 'info');
            
            // 隐藏翻译输出框
            translationOutput.classList.remove('show');
            
            try {
                const response = await fetch(location.origin, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ text, lang, translate, sourceLang: 'zh' })
                });
                
                if (!response.ok) {
                    const error = await response.json();
                    showStatus('错误: ' + (error.message || error.error), 'error');
                    document.getElementById('debugInfo').textContent = JSON.stringify(error, null, 2);
                    return;
                }
                
                const audioBlob = await response.blob();
                const audioUrl = URL.createObjectURL(audioBlob);
                
                audioPlayer.src = audioUrl;
                audioPlayer.load();
                
                const wasTranslated = response.headers.get('x-was-translated') === 'true';
                const langName = LANGUAGES[lang]?.displayName || lang;
                
                // 如果有翻译，获取并显示翻译后的文字
                if (wasTranslated && response.headers.get('x-translated-text')) {
                    const translatedTextEncoded = response.headers.get('x-translated-text');
                    const translatedTextDecoded = decodeURIComponent(translatedTextEncoded);
                    translationText.textContent = translatedTextDecoded;
                    translationOutput.classList.add('show');
                }
                
                let message = '✅ 成功生成';
                message += langName + '语音';
                if (wasTranslated) {
                    message += '（已从中文翻译）';
                }
                
                showStatus(message, 'success');
                
                // 显示调试信息
                const debugInfo = {
                    '文件大小': (audioBlob.size / 1024).toFixed(2) + ' KB',
                    '文件类型': audioBlob.type,
                    '目标语言': lang + ' (' + langName + ')',
                    '是否翻译': wasTranslated ? '是' : '否',
                    '文本长度': text.length + ' 字符'
                };
                
                document.getElementById('debugInfo').textContent = 
                    '调试信息:\\n' + Object.entries(debugInfo)
                        .map(([key, value]) => '  ' + key + ': ' + value)
                        .join('\\n');
                
                // 自动播放
                audioPlayer.play().catch(e => {
                    console.log('自动播放被阻止:', e);
                });
                
            } catch (error) {
                showStatus('网络错误: ' + error.message, 'error');
                console.error(error);
                document.getElementById('debugInfo').textContent = 'Error: ' + error.stack;
            }
        }
    </script>
</body>
</html>`;
}

async function handleRequest(request: Request): Promise<Response> {
  const url = new URL(request.url);
  
  // 处理 CORS 预检请求
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // 获取支持的语言列表
  if (request.method === "GET" && url.pathname === "/languages") {
    return new Response(JSON.stringify(LANGUAGES, null, 2), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }

  // 测试翻译功能
  if (request.method === "POST" && url.pathname === "/translate-test") {
    try {
      const body = await request.json();
      const { text, targetLang } = body;
      const translated = await translateText(text, targetLang);
      
      return new Response(JSON.stringify({
        original: text,
        translated: translated,
        targetLang: targetLang
      }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({
        error: "Translation test failed",
        message: error.message
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }
  }

  // 提供测试页面
  if (request.method === "GET" && url.pathname === "/") {
    return new Response(getTestPage(), {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/html; charset=utf-8"
      }
    });
  }

  // API 信息
  if (request.method === "GET") {
    return new Response(JSON.stringify({
      service: "TTS Proxy with Translation",
      version: "3.2",
      languages: 16,
      features: ["text-to-speech", "auto-translation", "multi-language-support"],
      endpoints: {
        tts: "POST /",
        translate_test: "POST /translate-test",
        languages: "GET /languages"
      },
      supported_languages: Object.keys(LANGUAGES),
      translation_note: "Automatic translation from Chinese to target language is supported"
    }, null, 2), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }

  if (request.method !== "POST") {
    return new Response(JSON.stringify({
      error: "Method not allowed"
    }), { 
      status: 405,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }

  try {
    const body = await request.json();
    let { text, lang = "zh", translate = false, sourceLang = "zh" } = body;

    if (!text) {
      return new Response(JSON.stringify({ 
        error: "Missing required parameter: text"
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }

    // 标准化语言代码
    lang = lang.toLowerCase().split('-')[0];
    let finalText = text;
    let translatedText = null;

    // 如果需要翻译且目标语言不是中文
    if (translate && lang !== "zh" && sourceLang === "zh") {
      console.log(`Translating from Chinese to ${lang}...`);
      translatedText = await translateText(text, lang);
      finalText = translatedText;
      console.log(`Translation result: ${translatedText.substring(0, 50)}...`);
    }

    console.log(`TTS Request: lang=${lang}, text="${finalText.substring(0, 50)}..."`);

    // 调用 GBase TTS API
    const ttsResponse = await fetch("https://tts.gbase.ai/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Referer": "https://gbase.ai/",
        "Accept": "audio/wav, audio/*"
      },
      body: JSON.stringify({ text: finalText, lang })
    });

    if (!ttsResponse.ok) {
      const errorText = await ttsResponse.text();
      return new Response(JSON.stringify({ 
        error: "TTS service error",
        status: ttsResponse.status,
        details: errorText
      }), {
        status: ttsResponse.status,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }

    const contentType = ttsResponse.headers.get('content-type') || 'audio/wav';
    const audioBuffer = await ttsResponse.arrayBuffer();
    
    console.log(`Audio received: ${audioBuffer.byteLength} bytes`);

    if (audioBuffer.byteLength < 100) {
      return new Response(JSON.stringify({
        error: "Invalid audio response",
        size: audioBuffer.byteLength,
        lang: lang,
        message: "The audio file is too small"
      }), {
        status: 422,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });
    }

    return new Response(audioBuffer, {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": contentType,
        "Content-Length": String(audioBuffer.byteLength),
        "Cache-Control": "no-cache",
        "X-Audio-Size": String(audioBuffer.byteLength),
        "X-Audio-Language": lang,
        "X-Language-Name": LANGUAGES[lang]?.name || lang, // 使用英文名避免 ByteString 错误
        "X-Was-Translated": String(translate && translatedText !== null),
        "X-Translated-Text": translatedText ? encodeURIComponent(translatedText) : ""
      }
    });

  } catch (error) {
    console.error("Proxy error:", error);
    return new Response(JSON.stringify({ 
      error: "Internal server error",
      message: error.message
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
}

// Deno Deploy 入口点
Deno.serve(handleRequest);