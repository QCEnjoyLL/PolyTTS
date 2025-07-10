# PolyTTS - 多语言文字转语音服务

[![Deno Deploy](https://img.shields.io/badge/Deno-Deploy-blue?logo=deno)](https://deno.com/deploy)
[![Languages](https://img.shields.io/badge/Languages-16-green)](README.md#支持语言)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)

PolyTTS 是一个基于 Deno 的高性能文字转语音 (TTS) 服务，支持 16 种语言的语音合成，并提供智能翻译功能。

## ✨ 核心特性

- 🌍 **16 种语言支持** - 覆盖中、英、日、韩、法、德等主流语言
- 🔄 **智能翻译** - 集成 Google 翻译和自定义 AI 翻译接口
- ⚡ **高性能** - 基于 Deno 运行时，部署简单，响应快速
- 🎨 **精美界面** - 内置响应式 Web UI，支持快速测试
- 🔌 **灵活部署** - 支持 Deno Deploy 一键部署
- 🎯 **API 友好** - RESTful API 设计，易于集成

## 🚀 快速开始

### 在线演示

访问部署后的服务地址，即可看到内置的测试界面。

### 本地运行

```bash
# 安装 Deno
curl -fsSL https://deno.land/x/install/install.sh | sh

# 运行简化版（仅 Google 翻译）
deno run --allow-net tts-16langs-simple.ts

# 运行增强版（支持自定义 AI 翻译）
deno run --allow-net tts-16langs-custom-ai.ts
```

## 📋 支持语言

| 语言 | 代码 | 显示名称 | 语言 | 代码 | 显示名称 |
|------|------|----------|------|------|----------|
| 中文 | zh | 中文 | 意大利语 | it | Italiano |
| 英语 | en | English | 葡萄牙语 | pt | Português |
| 日语 | ja | 日本語 | 越南语 | vi | Tiếng Việt |
| 韩语 | ko | 한국어 | 印尼语 | id | Bahasa Indonesia |
| 法语 | fr | Français | 土耳其语 | tr | Türkçe |
| 德语 | de | Deutsch | 波兰语 | pl | Polski |
| 西班牙语 | es | Español | 荷兰语 | nl | Nederlands |
| 瑞典语 | sv | Svenska | 捷克语 | cs | Čeština |

## 🛠 部署指南

### Deno Deploy 部署

1. 访问 [Deno Deploy](https://deno.com/deploy)
2. 创建新项目
3. 选择以下文件之一：
   - `tts-16langs-simple.ts` - 简化版，使用 Google 翻译
   - `tts-16langs-custom-ai.ts` - 增强版，支持自定义 AI 翻译

4. 点击部署，获取服务 URL

### Docker 部署（可选）

```dockerfile
FROM denoland/deno:latest
WORKDIR /app
COPY . .
EXPOSE 8000
CMD ["run", "--allow-net", "tts-16langs-simple.ts"]
```

## 📡 API 文档

### 1. 文字转语音

**端点:** `POST /`

**请求体:**
```json
{
  "text": "你好世界",
  "lang": "zh",
  "translate": false,
  "sourceLang": "zh",
  "aiConfig": {  // 可选，仅增强版支持
    "apiUrl": "https://api.openai.com/v1/chat/completions",
    "apiKey": "your-api-key",
    "model": "gpt-3.5-turbo"
  }
}
```

**参数说明:**
- `text` (必需) - 要转换的文本
- `lang` (可选) - 目标语言代码，默认 "zh"
- `translate` (可选) - 是否自动翻译，默认 false
- `sourceLang` (可选) - 源语言代码，默认 "zh"
- `aiConfig` (可选) - 自定义 AI 配置，仅增强版支持

**响应:** 音频文件 (audio/wav 或 audio/mpeg)

**响应头:**
- `X-Was-Translated` - 是否进行了翻译
- `X-Translated-Text` - 翻译后的文本（URL 编码）
- `X-Translation-Method` - 翻译方式（AI/Google/none）

### 2. 获取语言列表

**端点:** `GET /languages`

**响应示例:**
```json
{
  "zh": {
    "name": "Chinese",
    "displayName": "中文",
    "chineseName": "中文",
    "googleCode": "zh-CN"
  },
  ...
}
```

### 3. 纯翻译功能（仅增强版）

**端点:** `POST /translate`

**请求体:**
```json
{
  "text": "你好世界",
  "lang": "en",
  "sourceLang": "zh",
  "aiConfig": { ... }  // 可选
}
```

**响应:**
```json
{
  "originalText": "你好世界",
  "translatedText": "Hello World",
  "targetLang": "en",
  "method": "Google"  // 或 "AI"
}
```

## 🎯 使用示例

### JavaScript/TypeScript

```javascript
// 基础 TTS
const response = await fetch('https://your-service.deno.dev', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: 'Hello World',
    lang: 'en'
  })
});

const audioBlob = await response.blob();
const audioUrl = URL.createObjectURL(audioBlob);
const audio = new Audio(audioUrl);
audio.play();
```

### 带翻译的 TTS

```javascript
const response = await fetch('https://your-service.deno.dev', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: '你好世界',
    lang: 'en',
    translate: true,
    sourceLang: 'zh'
  })
});
```

### Python 示例

```python
import requests

# 发送请求
response = requests.post('https://your-service.deno.dev', json={
    'text': '你好世界',
    'lang': 'en',
    'translate': True
})

# 保存音频
with open('output.wav', 'wb') as f:
    f.write(response.content)
```

## 🔧 配置选项

### 翻译服务配置

**Google 翻译（默认）**
- 免费使用
- 无需 API Key
- 可能有使用限制

**自定义 AI 翻译（增强版）**
- 支持 OpenAI 兼容接口
- 更准确的翻译质量
- 需要提供 API 配置

### CORS 配置

默认允许所有来源，可在代码中修改 `corsHeaders` 进行限制：

```typescript
const corsHeaders = {
  "Access-Control-Allow-Origin": "https://your-domain.com",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};
```

## 🎨 内置界面功能

访问服务根路径即可使用内置的测试界面，功能包括：

- 文本输入与实时预览
- 语言选择下拉菜单
- 自动翻译开关
- AI 翻译配置（增强版）
- 快速测试按钮
- 音频播放与下载
- 翻译结果显示
- 复制文本功能

## ⚡ 性能优化建议

1. **缓存策略** - 可以添加 Redis 缓存重复请求
2. **文本长度** - 建议单次请求不超过 500 字符
3. **并发限制** - 生产环境建议添加速率限制
4. **错误重试** - 实现指数退避的重试机制

## 🔍 故障排查

### 常见问题

**Q: 翻译失败怎么办？**
- 检查网络连接
- 确认目标语言代码正确
- 尝试切换翻译服务

**Q: 音频生成失败？**
- 确认文本不为空
- 检查语言代码是否支持
- 查看服务日志

**Q: 部署后无法访问？**
- 检查 Deno Deploy 部署状态
- 确认使用正确的 URL
- 查看部署日志

## 📝 开发说明

### 项目结构

```
.
├── tts-16langs-simple.ts      # 简化版本
├── tts-16langs-custom-ai.ts   # AI 增强版本
└── README.md                   # 本文档
```

### 技术栈

- **运行时**: Deno
- **语言**: TypeScript
- **TTS 引擎**: GBase AI TTS API
- **翻译服务**: Google Translate / 自定义 AI
- **部署**: Deno Deploy

### 贡献指南

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

---

<p align="center">
  Made with ❤️ using Deno
</p>