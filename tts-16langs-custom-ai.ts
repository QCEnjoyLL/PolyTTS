// TTS API 代理服务 - AI翻译可选版（16语言）

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

// 使用自定义AI进行翻译
async function translateWithCustomAI(text: string, targetLang: string, aiConfig: any): Promise<string> {
  const { apiUrl, apiKey, model } = aiConfig;
  
  if (!apiUrl || !apiKey || !model) {
    console.log("AI config incomplete, falling back to Google Translate");
    return translateWithGoogle(text, targetLang);
  }

  const targetLangName = LANGUAGES[targetLang]?.displayName || targetLang;
  const prompt = `请将以下中文文本准确翻译成${targetLangName}。只返回翻译后的文本，不要包含任何解释或其他内容。

中文原文：${text}`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: "你是一个专业的翻译助手，精通多国语言翻译。请直接返回翻译结果，不要包含任何额外的解释。"
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    });

    if (response.ok) {
      const data = await response.json();
      let translatedText = "";
      
      // 兼容不同的响应格式
      if (data.choices?.[0]?.message?.content) {
        translatedText = data.choices[0].message.content.trim();
      } else if (data.output?.text) {
        translatedText = data.output.text.trim();
      } else if (data.result) {
        translatedText = data.result.trim();
      }
      
      if (translatedText) {
        console.log(`AI translation successful`);
        return translatedText;
      }
    }
  } catch (error) {
    console.error("AI translation error:", error);
  }

  // 如果AI翻译失败，回退到Google翻译
  return translateWithGoogle(text, targetLang);
}

// 使用 Google Translate
async function translateWithGoogle(text: string, targetLang: string): Promise<string> {
  try {
    const sourceLang = 'zh-CN';
    const targetLangCode = LANGUAGES[targetLang]?.googleCode || targetLang;
    
    const googleUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLangCode}&dt=t&q=${encodeURIComponent(text)}`;
    
    const response = await fetch(googleUrl);
    if (response.ok) {
      const data = await response.json();
      if (data && data[0] && data[0][0] && data[0][0][0]) {
        console.log('Google translation successful');
        return data[0][0][0];
      }
    }
  } catch (error) {
    console.error('Google translation error:', error);
  }
  
  return text;
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
    <title>16语言 TTS 语音合成服务（可选AI翻译）</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        .container {
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.2), 
                        0 0 100px rgba(102, 126, 234, 0.1);
            backdrop-filter: blur(10px);
        }
        h1 {
            color: #333;
            margin-bottom: 10px;
            text-align: center;
            font-size: 2.5rem;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
        }
        .subtitle {
            text-align: center;
            color: #666;
            margin-bottom: 30px;
            font-size: 1.1rem;
        }
        .language-badges {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: center;
            margin: 30px 0;
            padding: 25px;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border-radius: 15px;
            box-shadow: inset 0 2px 10px rgba(0,0,0,0.05);
        }
        .lang-badge {
            background: white;
            padding: 10px 18px;
            border-radius: 25px;
            border: 2px solid transparent;
            font-size: 14px;
            font-weight: 500;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .lang-badge:hover {
            border-color: #667eea;
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        .input-group {
            margin: 25px 0;
            position: relative;
        }
        .input-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        label {
            color: #555;
            font-weight: 600;
            font-size: 1.05rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .copy-button {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 8px 16px;
            font-size: 14px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 6px;
            font-weight: 500;
        }
        .copy-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
        }
        .copy-button:active {
            transform: translateY(0);
        }
        .copy-button.copied {
            background: linear-gradient(135deg, #4caf50 0%, #45a049 100%);
        }
        input, select, textarea {
            width: 100%;
            padding: 14px 18px;
            font-size: 16px;
            border: 2px solid #e9ecef;
            border-radius: 12px;
            box-sizing: border-box;
            transition: all 0.3s;
            background: #fafbfc;
            font-family: inherit;
        }
        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
            background: white;
        }
        textarea {
            min-height: 120px;
            resize: vertical;
            line-height: 1.5;
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
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 16px 40px;
            font-size: 17px;
            font-weight: 600;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
        }
        .main-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4);
        }
        .checkbox-group {
            margin: 20px 0;
        }
        .collapsible {
            background: white;
            border-radius: 12px;
            margin: 20px 0;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0,0,0,0.08);
            border: 1px solid #e9ecef;
        }
        .collapsible-header {
            padding: 18px 20px;
            cursor: pointer;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%);
            transition: all 0.3s;
            user-select: none;
        }
        .collapsible-header:hover {
            background: linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%);
        }
        .collapsible-header h3 {
            margin: 0;
            font-size: 16px;
            color: #495057;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .collapsible-arrow {
            transition: transform 0.3s;
            font-size: 14px;
            color: #6c757d;
        }
        .collapsible-arrow.open {
            transform: rotate(180deg);
        }
        .collapsible-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-out;
            background: #fafbfc;
        }
        .collapsible-content.open {
            max-height: 500px;
        }
        .collapsible-inner {
            padding: 20px;
        }
        .collapsible-inner input[type="checkbox"] {
            width: auto;
            margin-right: 10px;
            cursor: pointer;
        }
        .collapsible-inner label {
            cursor: pointer;
            user-select: none;
            margin-bottom: 15px;
            display: block;
        }
        .ai-config {
            margin-top: 20px;
            padding: 20px;
            background: white;
            border-radius: 10px;
            display: none;
            border: 1px solid #e9ecef;
            box-shadow: inset 0 2px 4px rgba(0,0,0,0.04);
        }
        .ai-config.show {
            display: block;
            animation: fadeIn 0.3s ease;
        }
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .ai-config input {
            margin-bottom: 12px;
        }
        .ai-config label {
            font-size: 14px;
            margin-bottom: 6px;
            color: #6c757d;
        }
        .test-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 12px;
            margin: 20px 0;
        }
        .test-btn {
            background: linear-gradient(135deg, #42a5f5 0%, #2196f3 100%);
            color: white;
            font-size: 13px;
            padding: 12px 10px;
            height: 55px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            line-height: 1.3;
            border-radius: 10px;
            border: none;
            transition: all 0.3s;
            box-shadow: 0 2px 8px rgba(33, 150, 243, 0.3);
        }
        .test-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(33, 150, 243, 0.4);
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
            margin-top: 25px;
            padding: 20px;
            background: linear-gradient(135deg, #e3f2fd 0%, #e8f5e9 100%);
            border-radius: 12px;
            display: none;
            box-shadow: 0 2px 10px rgba(0,0,0,0.08);
            position: relative;
        }
        .translation-output.show {
            display: block;
            animation: fadeIn 0.3s ease;
        }
        .translation-output label {
            font-weight: 600;
            color: #1565c0;
            margin-bottom: 12px;
            display: block;
        }
        .translation-text {
            background: white;
            padding: 15px;
            border-radius: 8px;
            min-height: 60px;
            white-space: pre-wrap;
            word-break: break-word;
            border: 1px solid #90caf9;
            font-size: 16px;
            line-height: 1.6;
            box-shadow: inset 0 1px 3px rgba(0,0,0,0.06);
        }
        .result-section {
            margin-top: 30px;
            padding: 30px;
            background: white;
            border-radius: 15px;
            display: none;
            border: 1px solid #e9ecef;
            box-shadow: 0 2px 15px rgba(0,0,0,0.08);
        }
        .result-section.show {
            display: block;
            animation: fadeIn 0.3s ease;
        }
        .status {
            padding: 18px 20px;
            border-radius: 10px;
            margin: 15px 0;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .status.success { 
            background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
            color: #2e7d32;
            border: 1px solid #a5d6a7;
        }
        .status.error { 
            background: linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%);
            color: #c62828;
            border: 1px solid #ef9a9a;
        }
        .status.info { 
            background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
            color: #1565c0;
            border: 1px solid #90caf9;
        }
        audio {
            width: 100%;
            margin: 20px 0;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        #debugInfo {
            margin-top: 15px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 13px;
            color: #666;
            white-space: pre-wrap;
            border: 1px solid #e9ecef;
        }
        .help-text {
            font-size: 12px;
            color: #6c757d;
            margin-top: 5px;
            font-style: italic;
        }
        .save-button {
            background: linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%);
            font-size: 14px;
            padding: 10px 20px;
            margin-top: 15px;
            box-shadow: 0 2px 8px rgba(156, 39, 176, 0.3);
        }
        .save-button:hover {
            box-shadow: 0 4px 15px rgba(156, 39, 176, 0.4);
        }
        .button-group {
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
            margin: 30px 0;
        }
        .feature-tag {
            display: inline-block;
            background: #e3f2fd;
            color: #1565c0;
            padding: 4px 12px;
            border-radius: 15px;
            font-size: 12px;
            margin: 0 5px;
        }
        @media (max-width: 768px) {
            body {
                padding: 10px;
            }
            .container {
                padding: 25px;
            }
            h1 {
                font-size: 2rem;
            }
            .test-grid {
                grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            }
            .button-group {
                flex-direction: column;
            }
            .main-button {
                width: 100%;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🌐 16语言 TTS 语音合成服务</h1>
        <p class="subtitle">支持全球16种主流语言的高质量语音合成 <span class="feature-tag">AI翻译</span> <span class="feature-tag">可自定义API</span></p>
        
        <div class="language-badges">
            ${Object.entries(LANGUAGES).map(([code, info]) => 
                `<span class="lang-badge">${info.displayName}</span>`
            ).join('')}
        </div>
        
        <div class="input-group">
            <div class="input-header">
                <label>📋 输入文字：</label>
                <button class="copy-button" onclick="copyText('textInput')">
                    <span>📋</span>
                    <span id="copyBtnText1">复制</span>
                </button>
            </div>
            <textarea id="textInput" placeholder="输入要转换的文字...">你好，欢迎使用16语言AI语音合成服务。</textarea>
        </div>
        
        <div class="input-group">
            <label>🌍 选择目标语言：</label>
            <select id="langSelect">
                ${languageOptions}
            </select>
        </div>
        
        <div class="collapsible">
            <div class="collapsible-header" onclick="toggleCollapse('translateOptions')">
                <h3>🔧 翻译选项</h3>
                <span class="collapsible-arrow" id="translateOptionsArrow">▼</span>
            </div>
            <div class="collapsible-content" id="translateOptions">
                <div class="collapsible-inner">
                    <label>
                        <input type="checkbox" id="autoTranslate">
                        启用自动翻译（将中文翻译为目标语言）
                    </label>
                    <br><br>
                    <label>
                        <input type="checkbox" id="useAI" onchange="toggleAIConfig()">
                        使用自定义AI翻译（提供更准确的翻译）
                    </label>
                    
                    <div id="aiConfig" class="ai-config">
                        <label>API地址：</label>
                        <input type="text" id="apiUrl" placeholder="例如：https://api.openai.com/v1/chat/completions">
                        <div class="help-text">支持OpenAI兼容的API接口</div>
                        
                        <label>模型名称：</label>
                        <input type="text" id="modelName" placeholder="例如：gpt-3.5-turbo">
                        
                        <label>API密钥：</label>
                        <input type="password" id="apiKey" placeholder="输入您的API密钥">
                        
                        <button class="save-button" onclick="saveAIConfig()">💾 保存配置</button>
                        <div class="help-text">配置将保存在浏览器本地存储中</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="button-group">
            <button class="main-button" onclick="convertToSpeech()">
                🔊 生成语音
            </button>
            <button class="main-button" style="background: linear-gradient(135deg, #00bcd4 0%, #0097a7 100%);" onclick="translateOnly()">
                🌐 只翻译
            </button>
        </div>
        
        <div id="translationOutput" class="translation-output">
            <div class="input-header">
                <label>🌐 翻译后的文字：</label>
                <button class="copy-button" onclick="copyTranslation()">
                    <span>📋</span>
                    <span id="copyBtnText2">复制</span>
                </button>
            </div>
            <div id="translationText" class="translation-text"></div>
        </div>
        
        <h3 style="margin-top: 40px; text-align: center; color: #495057;">🚀 快速测试各语言：</h3>
        <div class="test-grid">
            ${Object.entries(LANGUAGES).map(([code, info]) => `
                <button class="test-btn" onclick="quickTest('${code}')">
                    <span class="original-lang">${info.displayName}</span>
                    <span class="chinese-name">${info.chineseName}</span>
                </button>
            `).join('')}
        </div>
        
        <div id="resultSection" class="result-section">
            <h3 style="margin-bottom: 20px; color: #333;">🎵 生成结果</h3>
            <div id="status"></div>
            <audio id="audioPlayer" controls></audio>
            <div id="debugInfo"></div>
        </div>
    </div>

    <script>
        const LANGUAGES = ${JSON.stringify(LANGUAGES)};
        
        // 复制文本功能
        function copyText(elementId) {
            const element = document.getElementById(elementId);
            const text = element.value || element.textContent;
            
            navigator.clipboard.writeText(text).then(() => {
                const btnId = elementId === 'textInput' ? 'copyBtnText1' : 'copyBtnText2';
                const btn = document.getElementById(btnId);
                const originalText = btn.textContent;
                btn.textContent = '✓ 已复制';
                btn.parentElement.classList.add('copied');
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.parentElement.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('复制失败:', err);
                alert('复制失败，请手动选择复制');
            });
        }
        
        // 复制翻译文本
        function copyTranslation() {
            copyText('translationText');
        }
        
        // 切换折叠区域
        function toggleCollapse(id) {
            const content = document.getElementById(id);
            const arrow = document.getElementById(id + 'Arrow');
            
            if (content.classList.contains('open')) {
                content.classList.remove('open');
                arrow.classList.remove('open');
            } else {
                content.classList.add('open');
                arrow.classList.add('open');
            }
        }
        
        // 加载保存的AI配置
        function loadAIConfig() {
            const config = localStorage.getItem('aiConfig');
            if (config) {
                const { apiUrl, modelName, apiKey } = JSON.parse(config);
                document.getElementById('apiUrl').value = apiUrl || '';
                document.getElementById('modelName').value = modelName || '';
                document.getElementById('apiKey').value = apiKey || '';
            }
        }
        
        // 保存AI配置
        function saveAIConfig() {
            const config = {
                apiUrl: document.getElementById('apiUrl').value,
                modelName: document.getElementById('modelName').value,
                apiKey: document.getElementById('apiKey').value
            };
            localStorage.setItem('aiConfig', JSON.stringify(config));
            alert('配置已保存！');
        }
        
        // 切换AI配置显示
        function toggleAIConfig() {
            const aiConfig = document.getElementById('aiConfig');
            const useAI = document.getElementById('useAI').checked;
            if (useAI) {
                aiConfig.classList.add('show');
            } else {
                aiConfig.classList.remove('show');
            }
        }
        
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
        
        // 只翻译功能
        async function translateOnly() {
            const text = document.getElementById('textInput').value;
            const lang = document.getElementById('langSelect').value;
            const useAI = document.getElementById('useAI').checked;
            const translationOutput = document.getElementById('translationOutput');
            const translationText = document.getElementById('translationText');
            
            if (!text) {
                showStatus('请输入要翻译的文字', 'error');
                return;
            }
            
            if (lang === 'zh') {
                showStatus('请选择目标语言（非中文）', 'error');
                return;
            }
            
            showStatus('正在翻译，请稍候...', 'info');
            
            // 准备请求数据
            const requestData = {
                text,
                lang,
                translate: true,
                sourceLang: 'zh',
                onlyTranslate: true // 标记只需要翻译
            };
            
            // 如果使用AI翻译，添加AI配置
            if (useAI) {
                requestData.aiConfig = {
                    apiUrl: document.getElementById('apiUrl').value,
                    apiKey: document.getElementById('apiKey').value,
                    model: document.getElementById('modelName').value
                };
            }
            
            try {
                const response = await fetch(location.origin + '/translate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestData)
                });
                
                if (!response.ok) {
                    const error = await response.json();
                    showStatus('错误: ' + (error.message || error.error), 'error');
                    return;
                }
                
                const result = await response.json();
                const langName = LANGUAGES[lang]?.displayName || lang;
                
                // 显示翻译结果
                translationText.textContent = result.translatedText;
                translationOutput.classList.add('show');
                
                let message = '✅ 翻译成功 - ' + langName;
                if (result.method === 'AI') {
                    message += '（AI翻译）';
                } else {
                    message += '（Google翻译）';
                }
                
                showStatus(message, 'success');
                
                // 隐藏音频播放器和调试信息
                document.getElementById('audioPlayer').style.display = 'none';
                document.getElementById('debugInfo').style.display = 'none';
                
            } catch (error) {
                showStatus('网络错误: ' + error.message, 'error');
                console.error(error);
            }
        }
        
        async function convertToSpeech() {
            const text = document.getElementById('textInput').value;
            const lang = document.getElementById('langSelect').value;
            const translate = document.getElementById('autoTranslate').checked;
            const useAI = document.getElementById('useAI').checked;
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
            
            // 显示音频播放器和调试信息
            audioPlayer.style.display = 'block';
            document.getElementById('debugInfo').style.display = 'block';
            
            // 准备请求数据
            const requestData = {
                text,
                lang,
                translate,
                sourceLang: 'zh'
            };
            
            // 如果使用AI翻译，添加AI配置
            if (useAI && translate) {
                requestData.aiConfig = {
                    apiUrl: document.getElementById('apiUrl').value,
                    apiKey: document.getElementById('apiKey').value,
                    model: document.getElementById('modelName').value
                };
            }
            
            try {
                const response = await fetch(location.origin, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestData)
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
                const translationMethod = response.headers.get('x-translation-method');
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
                    message += '（已从中文翻译';
                    if (translationMethod === 'AI') {
                        message += '，使用AI翻译';
                    } else {
                        message += '，使用Google翻译';
                    }
                    message += '）';
                }
                
                showStatus(message, 'success');
                
                // 显示调试信息
                const debugInfo = {
                    '文件大小': (audioBlob.size / 1024).toFixed(2) + ' KB',
                    '文件类型': audioBlob.type,
                    '目标语言': lang + ' (' + langName + ')',
                    '是否翻译': wasTranslated ? '是' : '否',
                    '翻译方式': translationMethod || '无',
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
        
        // 页面加载时，加载保存的配置
        window.onload = function() {
            loadAIConfig();
        };
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

  // 处理独立翻译请求
  if (request.method === "POST" && url.pathname === "/translate") {
    try {
      const body = await request.json();
      let { text, lang = "en", sourceLang = "zh", aiConfig } = body;

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
      
      let translatedText = "";
      let translationMethod = null;

      // 如果目标语言不是中文
      if (lang !== "zh" && sourceLang === "zh") {
        console.log(`Translating from Chinese to ${lang}...`);
        
        // 判断是否使用AI翻译
        if (aiConfig && aiConfig.apiUrl && aiConfig.apiKey && aiConfig.model) {
          translatedText = await translateWithCustomAI(text, lang, aiConfig);
          translationMethod = "AI";
        } else {
          translatedText = await translateWithGoogle(text, lang);
          translationMethod = "Google";
        }
        
        console.log(`Translation result (${translationMethod}): ${translatedText.substring(0, 50)}...`);
      } else {
        translatedText = text;
      }

      return new Response(JSON.stringify({
        originalText: text,
        translatedText: translatedText,
        targetLang: lang,
        method: translationMethod
      }), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json"
        }
      });

    } catch (error) {
      console.error("Translation error:", error);
      return new Response(JSON.stringify({ 
        error: "Translation service error",
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
      service: "TTS Proxy with Optional AI Translation",
      version: "5.0",
      languages: 16,
      features: [
        "text-to-speech", 
        "google-translation",
        "custom-ai-translation",
        "multi-language-support"
      ],
      endpoints: {
        tts: "POST /",
        translate: "POST /translate",
        languages: "GET /languages"
      },
      supported_languages: Object.keys(LANGUAGES)
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
    let { text, lang = "zh", translate = false, sourceLang = "zh", aiConfig } = body;

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
    let translationMethod = null;

    // 如果需要翻译且目标语言不是中文
    if (translate && lang !== "zh" && sourceLang === "zh") {
      console.log(`Translating from Chinese to ${lang}...`);
      
      // 判断是否使用AI翻译
      if (aiConfig && aiConfig.apiUrl && aiConfig.apiKey && aiConfig.model) {
        translatedText = await translateWithCustomAI(text, lang, aiConfig);
        translationMethod = "AI";
      } else {
        translatedText = await translateWithGoogle(text, lang);
        translationMethod = "Google";
      }
      
      finalText = translatedText;
      console.log(`Translation result (${translationMethod}): ${translatedText.substring(0, 50)}...`);
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
        "X-Language-Name": LANGUAGES[lang]?.name || lang,
        "X-Was-Translated": String(translate && translatedText !== null),
        "X-Translated-Text": translatedText ? encodeURIComponent(translatedText) : "",
        "X-Translation-Method": translationMethod || "none"
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