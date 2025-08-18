// Universal Chat Widget - Works with any OpenAI-compatible API

class UniversalChatWidget {
  constructor(options = {}) {
    this.options = {
      title: options.title || "Course Assistant",
      welcomeMessage:
        options.welcomeMessage || "Hello! How can I help you today?",
      placeholder: options.placeholder || "Type your question...",
      position: options.position || "bottom-right", // bottom-right, bottom-left, top-right, top-left

      // API Configuration with validation
      apiEndpoint:
        this.validateApiEndpoint(options.apiEndpoint) ||
        "https://your-worker.workers.dev",
      model: this.validateModel(options.model) || "gpt-3.5-turbo", // Model to use for API requests

      // Header colors
      titleBackgroundColor: options.titleBackgroundColor || "#2c3532", // Header background
      titleFontColor: options.titleFontColor || "#ffffff", // Text and icons in header

      // Message bubble colors
      assistantColor: options.assistantColor || "#fdcd9a", // Assistant message bubble background
      assistantFontColor: options.assistantFontColor || "#2c3532", // Assistant text, typing dots, message preview
      assistantMessageOpacity: options.assistantMessageOpacity || 1.0, // Opacity for assistant message bubbles (0.0 to 1.0)
      userColor: options.userColor || "#99bfbb", // User message bubble and send button background
      userFontColor: options.userFontColor || "#2c3532", // Text in user message bubbles
      userMessageOpacity: options.userMessageOpacity || 1.0, // Opacity for user message bubbles (0.0 to 1.0)

      // Interface colors
      chatBackground: options.chatBackground || "#ffffff", // Chat window and input background
      stampColor: options.stampColor || "#df7d7d", // Timestamps and unread badge
      codeBackgroundColor: options.codeBackgroundColor || "#f3f4f6", // Code block backgrounds
      codeTextColor: options.codeTextColor || "#df7d7d", // Text color for code content
      borderColor: options.borderColor || "#2c3532", // Borders for bubbles and input
      buttonIconColor: options.buttonIconColor || "#ffffff", // Chat button icons
      scrollbarColor: options.scrollbarColor || "#d1d5db", // Scrollbar color
      inputTextColor: options.inputTextColor || "#1f2937", // Text color in input field

      // Behavior options
      startOpen: options.startOpen || false,
      buttonSize: options.buttonSize || 60,
      windowWidth: options.windowWidth || 450,
      windowHeight: options.windowHeight || 600,
      showModelInfo: options.showModelInfo || false,

      // Debug mode (enable for development)
      debug: options.debug || false,

      ...options,
    };

    this.isOpen = false;
    this.history = [];
    this.unreadCount = 0;
    this.hasInteracted = false;

    this.init();
  }

  addCopyButtonsToCodeBlocks(messageElement) {
    const codeBlocks = messageElement.querySelectorAll("pre");
    codeBlocks.forEach((codeBlock) => {
      const copyBtn = document.createElement("button");
      copyBtn.className = "code-copy-btn";
      copyBtn.textContent = "Copy";
      copyBtn.setAttribute("aria-label", "Copy code");

      copyBtn.addEventListener("click", async () => {
        const codeContent = codeBlock.querySelector("code") || codeBlock;
        const textToCopy = codeContent.textContent;

        try {
          await navigator.clipboard.writeText(textToCopy);
          copyBtn.textContent = "Copied!";
          copyBtn.classList.add("copied");

          setTimeout(() => {
            copyBtn.textContent = "Copy";
            copyBtn.classList.remove("copied");
          }, 2000);
        } catch (err) {
          // Fallback for older browsers
          const textArea = document.createElement("textarea");
          textArea.value = textToCopy;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);

          copyBtn.textContent = "Copied!";
          copyBtn.classList.add("copied");

          setTimeout(() => {
            copyBtn.textContent = "Copy";
            copyBtn.classList.remove("copied");
          }, 2000);
        }
      });

      codeBlock.appendChild(copyBtn);
    });
  }

  loadKaTeX() {
    return new Promise((resolve) => {
      if (window.katex) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src =
        "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js";
      script.onload = () => {
        const autoRenderScript = document.createElement("script");
        autoRenderScript.src =
          "https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js";
        autoRenderScript.onload = () => resolve();
        document.head.appendChild(autoRenderScript);
      };
      document.head.appendChild(script);
    });
  }

  async renderLatex(messageElement) {
    await this.loadKaTeX();

    if (window.renderMathInElement) {
      window.renderMathInElement(messageElement, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
          { left: "\\[", right: "\\]", display: true },
          { left: "\\(", right: "\\)", display: false },
        ],
        throwOnError: false,
        errorColor: this.options.stampColor,
      });
    }
  }

  renderCitations(messageElement, sources = []) {
    const messageBubble = messageElement.querySelector(".message-bubble");
    if (!messageBubble) return;

    let content = messageBubble.innerHTML;
    const citations = {};

    // First extract citation numbers that actually appear in the content
    const citationMatches = content.match(/\[(\d+)\]/g);
    const citationNumbers = citationMatches
      ? citationMatches.map((match) => parseInt(match.slice(1, -1)))
      : [];

    // First try to use structured sources if provided
    if (sources && sources.length > 0 && citationNumbers.length > 0) {
      // Extract citations from sources data only for numbers that appear in content
      sources.forEach((sourceData, sourceIndex) => {
        const source = sourceData.source;
        const document = sourceData.document;
        const metadata = sourceData.metadata;

        if (document) {
          // Only process document fragments for citation numbers that appear in the text
          citationNumbers.forEach((citationNum) => {
            // Convert 1-based citation number to 0-based array index
            const docIndex = citationNum - 1;
            if (docIndex >= 0 && docIndex < document.length) {
              const docContent = document[docIndex];
              const docKey = docIndex.toString();

              // Create reference text from source metadata and document content
              let referenceText = `<strong>${source.name}</strong>`;
              if (source.description) {
                referenceText += ` - ${source.description}`;
              }

              // Add metadata info if available
              if (metadata && metadata[docKey]) {
                const metaInfo = metadata[docKey];
                if (metaInfo.headings && metaInfo.headings !== "[]") {
                  try {
                    let headings = [];

                    // Parse Python-style list format with regex
                    if (
                      metaInfo.headings.startsWith("[") &&
                      metaInfo.headings.endsWith("]")
                    ) {
                      // Extract content between quotes using regex
                      const matches = metaInfo.headings.match(/'([^']*)'/g);
                      if (matches) {
                        headings = matches.map((match) => match.slice(1, -1)); // Remove surrounding quotes
                      }
                    }

                    if (headings.length > 0) {
                      referenceText += `<br><strong>Section:</strong> ${headings.join(" > ")}`;
                    }
                  } catch (parseError) {
                    console.warn(
                      "Failed to parse headings:",
                      metaInfo.headings,
                      parseError,
                    );
                    // Fallback: just show the raw headings string if it's reasonable
                    if (metaInfo.headings.length < 100) {
                      referenceText += `<br><strong>Section:</strong> ${metaInfo.headings}`;
                    }
                  }
                }
              }

              // Add document snippet
              const snippet = docContent
                .substring(0, 200)
                .replace(/[#*-]/g, "")
                .replace(/\s+/g, " ")
                .trim();
              if (snippet) {
                referenceText += `<br><em>${snippet}...</em>`;
              }

              citations[citationNum] = referenceText;
            }
          });
        }
      });
    } else if (citationNumbers.length === 0 && sources && sources.length > 0) {
      // Fallback: Parse citations from text content
      const citationPattern = /\[(\d+)\]\s*([\s\S]*?)(?=\s*\[\d+\]|$)/g;
      let match;

      while ((match = citationPattern.exec(content)) !== null) {
        const citationNum = parseInt(match[1]);
        const referenceText = match[2].trim();

        // Clean and check if it's substantial content
        const cleanText = referenceText
          .replace(/<[^>]*>/g, "")
          .replace(/\s+/g, " ")
          .trim();

        if (cleanText.length > 15) {
          citations[citationNum] = referenceText;

          // Replace this citation with a clickable link
          const replacement = `<span class="citation-link" data-citation="${citationNum}" title="Click to see reference">[${citationNum}]</span>`;
          content = content.replace(match[0], replacement);

          // Reset regex position since we modified the string
          citationPattern.lastIndex = 0;
        }
      }
    }

    // Replace citation numbers with clickable links (for structured sources or remaining citations)
    content = content.replace(/\[(\d+)\]/g, (match, num) => {
      const citationNum = parseInt(num);
      if (citations[citationNum]) {
        return `<span class="citation-link" data-citation="${citationNum}" title="Click to see reference">[${citationNum}]</span>`;
      }
      return match;
    });

    // If we have citations, create references section

    if (Object.keys(citations).length > 0) {
      let referencesHtml =
        '<div class="references-section"><h4>References:</h4><ol class="references-list">';

      const sortedNums = Object.keys(citations).sort(
        (a, b) => parseInt(a) - parseInt(b),
      );
      sortedNums.forEach((num) => {
        referencesHtml += `<li id="ref-${num}" class="reference-item">${citations[num]}</li>`;
      });

      referencesHtml += "</ol></div>";
      content += referencesHtml;

      messageBubble.innerHTML = content;

      // Add click handlers for citation links
      messageElement.querySelectorAll(".citation-link").forEach((link) => {
        link.addEventListener("click", (e) => {
          const citationNum = e.target.dataset.citation;
          const referenceElement = messageElement.querySelector(
            `#ref-${citationNum}`,
          );
          if (referenceElement) {
            referenceElement.scrollIntoView({
              behavior: "smooth",
              block: "nearest",
            });
            referenceElement.classList.add("highlighted");
            setTimeout(() => {
              referenceElement.classList.remove("highlighted");
            }, 2000);
          }
        });
      });
    }
  }

  validateApiEndpoint(endpoint) {
    if (!endpoint) return null;
    try {
      const url = new URL(endpoint);
      if (!["https:", "http:"].includes(url.protocol)) {
        console.warn("Chat Widget: Only HTTP/HTTPS endpoints allowed");
        return null;
      }
      return endpoint;
    } catch (e) {
      console.warn("Chat Widget: Invalid API endpoint provided");
      return null;
    }
  }

  validateModel(model) {
    if (!model || typeof model !== "string") return null;
    // Allow alphanumeric, hyphens, underscores, and dots only
    if (!/^[a-zA-Z0-9\-_.]+$/.test(model)) {
      console.warn("Chat Widget: Invalid model name provided");
      return null;
    }
    return model.substring(0, 50); // Limit length
  }

  init() {
    this.injectStyles();
    this.createWidget();
    this.bindEvents();
    this.restoreState();

    if (this.options.startOpen && !this.hasInteracted) {
      setTimeout(() => this.open(), 1000);
    }
  }

  injectStyles() {
    if (document.getElementById("universal-chat-styles")) return;

    // Use solid color only - no gradients
    const backgroundStyle = this.options.userColor;
    const headerBackgroundStyle = this.options.titleBackgroundColor;

    const styles = document.createElement("style");
    styles.id = "universal-chat-styles";
    styles.textContent = `

      /* Import Google Fonts and KaTeX */
      @import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@300;400;500&display=swap');
      @import url('https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css');


      /* Chat Button */
      .universal-chat-button {
        position: fixed;
        ${this.options.position.includes("right") ? "right: 20px" : "left: 20px"};
        ${this.options.position.includes("bottom") ? "bottom: 20px" : "top: 20px"};
        width: ${this.options.buttonSize}px;
        height: ${this.options.buttonSize}px;
        border-radius: 2px;
        background: ${this.options.assistantColor};
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        z-index: 9998;
        border: none;
        color: ${this.options.buttonIconColor};
        font-size: 28px;
      }

      .universal-chat-button:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      }

      .universal-chat-button.chat-open {
        transform: rotate(90deg);
        background: ${this.options.userColor};
      }

      .universal-chat-button.chat-open:hover {
        transform: rotate(90deg) scale(0.9);
      }

      /* Unread Badge */
      .chat-unread-badge {
        position: absolute;
        top: -5px;
        right: -5px;
        background: ${this.options.assistantColor};
        color: ${this.options.stampColor};
        border-radius: 2px;
        padding: 2px 6px;
        font-size: 12px;
        font-weight: bold;
        min-width: 20px;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      }

      /* Typing Indicator in Button */
      .button-typing-indicator {
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        background: ${this.options.chatBackground};
        padding: 4px 8px;
        border-radius: 2px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 2px;
        animation: slideUp 0.3s ease;
      }

      .button-typing-indicator span {
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: ${this.options.assistantFontColor};
        animation: typingDot 1.4s infinite;
      }

      .button-typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
      .button-typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

      @keyframes typingDot {
        0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
        30% { opacity: 1; transform: scale(1.2); }
      }

      /* Message Preview */
      .button-message-preview {
        position: absolute;
        bottom: -35px;
        ${this.options.position.includes("right") ? "right: 0" : "left: 0"};
        background: ${this.options.chatBackground};
        padding: 8px 12px;
        border-radius: 2px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        max-width: 250px;
        font-size: 14px;
        color: ${this.options.assistantFontColor};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        animation: slideIn 0.3s ease;
      }

      /* Chat Window */
      .universal-chat-window {
        position: fixed;
        ${this.options.position.includes("right") ? "right: 20px" : "left: 20px"};
        ${this.options.position.includes("bottom") ? "bottom: 100px" : "top: 100px"};
        width: ${this.options.windowWidth}px;
        height: ${this.options.windowHeight}px;
        max-height: calc(100vh - 120px);
        background: ${this.options.chatBackground};
        border-radius: 2px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
        display: flex;
        flex-direction: column;
        z-index: 9999;
        opacity: 0;
        transform: translateY(20px) scale(0.95);
        pointer-events: none;
        transition: all 0.3s ease;
        font-family: inherit;

      }

      .universal-chat-window.open {
        opacity: 1;
        transform: translateY(0) scale(1);
        pointer-events: all;
      }

      /* Header */
      .chat-header {
        background: ${headerBackgroundStyle};
        color: ${this.options.titleFontColor};
        padding: 0.5rem 1.25rem;
        border-radius: 2px 2px 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .chat-header-info h3 {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 600;
        color: ${this.options.titleFontColor};
      }

      .chat-header-actions {
        display: flex;
        gap: 0.5rem;
      }

      .chat-header-btn {
        background: transparent;
        border: none;
        color: ${this.options.titleFontColor};
        width: 44px;
        height: 44px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.2s;
        font-size: 28px;
      }

      .chat-header-btn:hover {
        opacity: 0.7;
      }

      /* Messages */
      .chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 1rem;
        padding-bottom: 100px;
        background: ${this.options.chatBackground};
        scroll-behavior: smooth;
      }

      .chat-messages::-webkit-scrollbar {
        width: 6px;
      }

      .chat-messages::-webkit-scrollbar-thumb {
        background: ${this.options.scrollbarColor};
        border-radius: 2px;
      }

      .message {
        margin-bottom: 1rem;
        animation: messageSlide 0.3s ease;
      }

      @keyframes messageSlide {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      .message.user { text-align: right; }

      .message-bubble {
        display: inline-block;
        max-width: 90%;
        padding: 0.75rem 1rem;
        border-radius: 2px;
        word-wrap: break-word;
        line-height: 1.5;
      }

      .message-bubble h1,
      .message-bubble h2,
      .message-bubble h3 {
        margin: 1rem 0 0.5rem 0;
        font-weight: 600;
        color: ${this.options.assistantFontColor};
      }

      .message-bubble h1 { font-size: 1.4em; }
      .message-bubble h2 { font-size: 1.25em; }
      .message-bubble h3 { font-size: 1.1em; }

      .message-bubble h1:first-child,
      .message-bubble h2:first-child,
      .message-bubble h3:first-child {
        margin-top: 0;
      }

      .message.user .message-bubble {
        background: color-mix(in srgb, ${this.options.userColor}, transparent ${(1 - this.options.userMessageOpacity) * 100}%);
        border: 1px solid ${this.options.borderColor};
        color: ${this.options.userFontColor};
        border-radius: 2px;
        text-align: left;
      }


      .message.assistant .message-bubble {
        background: color-mix(in srgb, ${this.options.assistantColor}, transparent ${(1 - this.options.assistantMessageOpacity) * 100}%);
        border: 1px solid ${this.options.borderColor};
        border-radius: 2px;
        color: ${this.options.assistantFontColor};
      }

      .message-time {
        font-size: 0.7rem;
        color: ${this.options.stampColor};
        margin-top: 0.25rem;
      }

      .typing-indicator {
        display: inline-block;
        padding: 0.75rem 1rem;
        background: color-mix(in srgb, ${this.options.assistantColor}, transparent ${(1 - this.options.assistantMessageOpacity) * 100}%);
        border: 1px solid ${this.options.borderColor};
        border-radius: 2px;
      }

      .typing-indicator span {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: ${this.options.assistantFontColor};
        margin: 0 2px;
        animation: typingBounce 1.4s infinite;
      }

      .typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
      .typing-indicator span:nth-child(3) { animation-delay: 0.4s; }

      @keyframes typingBounce {
        0%, 60%, 100% { transform: translateY(0); }
        30% { transform: translateY(-10px); }
      }

      /* Input Area */
      .chat-input-area {
        position: absolute;
        bottom: 1rem;
        left: 1rem;
        right: 1rem;
        background: ${this.options.chatBackground};
        border-radius: 2px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 10;
      }

      .chat-input-container {
        display: flex;
        border: 1px solid ${this.options.borderColor};
        border-radius: 2px;
        overflow: hidden;
        background: ${this.options.chatBackground};
        padding: 0;
      }

      .chat-input {
        flex: 1;
        padding: 0.75rem;
        border: none;
        resize: none;
        font-family: inherit;
        font-size: 0.95rem;
        line-height: 1.4;
        max-height: 100px;
        background: transparent;
        color: ${this.options.inputTextColor};
      }

      .chat-input:focus {
        outline: none;
      }

      .chat-input-container:focus-within {
        box-shadow: 0 0 0 6px ${this.options.secondaryColor}20;
      }

      .chat-send-btn {
        padding: 0.75rem 1rem;
        background: ${backgroundStyle};
        color: ${this.options.userFontColor};
        border: none;
        border-left: 1px solid ${this.options.borderColor};
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        font-size: inherit;
        font-family: inherit;
        font-weight: 500;
        white-space: nowrap;
      }

      .chat-send-btn:hover:not(:disabled) {
        transform: scale(1.05);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        background: ${this.options.userColor};
      }

      .chat-send-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      /* Model info badge */
      .model-info {
        font-size: 0.7rem;
        color: ${this.options.stampColor};
        text-align: center;
        padding: 0.25rem;
        background: ${this.options.codeBackgroundColor};
        margin: 0 1rem;
        border-radius: 2px;
      }

      /* Mobile */
      @media (max-width: 480px) {
        .universal-chat-window {
          width: calc(100vw - 40px);
          height: calc(100vh - 120px);
        }
      }

      /* Markdown support */
      .message-bubble code {
        background: ${this.options.codeBackgroundColor};
        padding: 0.125rem 0.25rem;
        border-radius: 2px;
        font-family: 'Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        font-size: 0.9em;
        color: ${this.options.codeTextColor};
        word-break: break-all;
        white-space: pre-wrap;
      }

      .message.user .message-bubble code {
        background: ${this.options.codeBackgroundColor};
        color: ${this.options.codeTextColor};
      }

      .message-bubble pre {
        background: ${this.options.codeBackgroundColor};
        color: ${this.options.codeTextColor};
        padding: 0.75rem;
        border-radius: 2px;
        overflow-x: auto;
        overflow-y: hidden;
        margin: 0.5rem 0;
        max-width: 100%;
        white-space: pre-wrap;
        word-break: break-word;
        line-height: 1.4;
        position: relative;
        font-family: 'Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
        border: 1px solid ${this.options.borderColor};
      }

      .message-bubble pre code {
        background: transparent;
        padding: 0;
        color: inherit;
        word-break: inherit;
        white-space: inherit;
      }

      /* Copy button for code blocks */
      .code-copy-btn {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background: ${this.options.borderColor};
        color: ${this.options.titleFontColor};
        border: none;
        border-radius: 4px;
        padding: 0.25rem 0.5rem;
        font-size: 0.75rem;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.2s ease;
        z-index: 1;
      }

      .code-copy-btn:hover {
        background: ${this.options.stampColor};
      }

      .message-bubble pre:hover .code-copy-btn {
        opacity: 1;
      }

      .code-copy-btn.copied {
        background: ${this.options.assistantColor};
        color: ${this.options.assistantFontColor};
      }

      /* KaTeX styling */
      .katex {
        font-size: 1.1em;
      }

      .katex-display {
        margin: 1em 0;
        text-align: center;
      }

      .katex-error {
        color: ${this.options.stampColor};
        border: 1px solid ${this.options.stampColor};
        padding: 0.25rem;
        border-radius: 3px;
        background: ${this.options.codeBackgroundColor};
      }

      /* Citation styling */
      .citation-link {
        color: ${this.options.codeTextColor};
        cursor: pointer;
        text-decoration: none;
        font-weight: 500;
        padding: 1px 3px;
        border-radius: 2px;
        transition: all 0.2s ease;
        font-size: 0.85em;
      }

      .citation-link:hover {
        background: ${this.options.codeBackgroundColor};
        color: ${this.options.codeTextColor};
      }

      .references-section {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid ${this.options.borderColor};
      }

      .references-section h4 {
        margin: 0 0 1rem 0;
        font-size: 1rem;
        font-weight: 600;
        color: ${this.options.assistantFontColor};
      }

      .references-list {
        margin: 0;
        padding-left: 1rem;
        font-size: 0.75em;
      }

      .reference-item {
        margin-bottom: 0.5rem;
        color: ${this.options.assistantFontColor};
        transition: background-color 0.3s ease;
        text-align: justify;
      }

      .reference-item.highlighted {
        background: ${this.options.codeBackgroundColor};
        padding: 0.5rem;
        border-radius: 2px;
        border-left: 2px solid ${this.options.userColor};
      }

      /* Animations */
      @keyframes slideUp {
        from { opacity: 0; transform: translateX(-50%) translateY(10px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
      }

      @keyframes slideIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.1); }
      }
    `;

    document.head.appendChild(styles);
  }

  createWidget() {
    // Create button
    this.button = document.createElement("button");
    this.button.className = "universal-chat-button";
    this.button.innerHTML = "💬";
    this.button.setAttribute("aria-label", "Open chat");

    // Add unread badge
    this.unreadBadge = document.createElement("span");
    this.unreadBadge.className = "chat-unread-badge";
    this.unreadBadge.style.display = "none";
    this.button.appendChild(this.unreadBadge);

    // Add typing indicator for button
    this.buttonTypingIndicator = document.createElement("div");
    this.buttonTypingIndicator.className = "button-typing-indicator";
    this.buttonTypingIndicator.innerHTML =
      "<span></span><span></span><span></span>";
    this.buttonTypingIndicator.style.display = "none";
    this.button.appendChild(this.buttonTypingIndicator);

    // Create window
    this.window = document.createElement("div");
    this.window.className = "universal-chat-window";
    this.window.innerHTML = `
      <div class="chat-header">
        <div class="chat-header-info">
          <h3>${this.options.title}</h3>
        </div>
        <div class="chat-header-actions">
          <button class="chat-header-btn chat-clear-btn" title="Clear chat">↻</button>
          <button class="chat-header-btn chat-close-btn" title="Minimize">×</button>
        </div>
      </div>
      ${this.options.showModelInfo ? '<div class="model-info" id="model-info"></div>' : ""}
      <div class="chat-messages">
        <div class="message assistant">
          <div class="message-bubble">${this.options.welcomeMessage}</div>
          <div class="message-time">${this.formatTime(new Date())}</div>
        </div>
      </div>
      <div class="chat-input-area">
        <div class="chat-input-container">
          <textarea
            class="chat-input"
            placeholder="${this.options.placeholder}"
            maxlength="2000"
            rows="1"></textarea>
          <button class="chat-send-btn" disabled>
            Send
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(this.button);
    document.body.appendChild(this.window);

    this.messagesEl = this.window.querySelector(".chat-messages");
    this.inputEl = this.window.querySelector(".chat-input");
    this.sendBtn = this.window.querySelector(".chat-send-btn");
    this.modelInfoEl = this.window.querySelector("#model-info");

    // Add copy buttons to welcome message
    this.addCopyButtonsToCodeBlocks(this.messagesEl);

    // Render LaTeX in welcome message
    this.renderLatex(this.messagesEl);

    // Render citations in welcome message
    this.renderCitations(this.messagesEl.querySelector(".message"), []);
  }

  bindEvents() {
    this.button.addEventListener("click", () => this.toggle());
    this.window
      .querySelector(".chat-close-btn")
      .addEventListener("click", () => this.close());
    this.window
      .querySelector(".chat-clear-btn")
      .addEventListener("click", () => this.clearChat());
    this.sendBtn.addEventListener("click", () => this.sendMessage());

    this.inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        this.sendMessage();
      }
    });

    this.inputEl.addEventListener("input", () => {
      this.sendBtn.disabled = !this.inputEl.value.trim();
      this.autoResizeInput();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen) {
        this.close();
      }
    });
  }

  autoResizeInput() {
    this.inputEl.style.height = "auto";
    this.inputEl.style.height = Math.min(this.inputEl.scrollHeight, 100) + "px";
  }

  toggle() {
    this.isOpen ? this.close() : this.open();
  }

  open() {
    this.isOpen = true;
    this.hasInteracted = true;
    this.window.classList.add("open");
    this.button.classList.add("chat-open");
    this.button.innerHTML = "×";
    this.unreadCount = 0;
    this.updateUnreadBadge();
    this.hideMessagePreview();
    this.buttonTypingIndicator.style.display = "none";
    this.inputEl.focus();
    this.saveState();
  }

  close() {
    this.isOpen = false;
    this.window.classList.remove("open");
    this.button.classList.remove("chat-open");
    this.button.innerHTML = "💬";
    this.saveState();
  }

  async sendMessage() {
    const message = this.inputEl.value.trim();
    if (!message) return;

    this.addMessage("user", message);
    this.inputEl.value = "";
    this.autoResizeInput();
    this.sendBtn.disabled = true;

    this.showTyping();

    try {
      const response = await fetch(this.options.apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: message,
          history: this.history.slice(-10),
          model: this.options.model,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      // Update model info if available
      if (this.modelInfoEl && data.model) {
        this.modelInfoEl.textContent = `Model: ${data.model}`;
      }

      // Extract content and sources from API response
      const assistantContent =
        data.choices?.[0]?.message?.content || data.response;

      // Extract sources from nested API structure - try multiple possible paths
      let sources = [];

      // Try different possible source paths
      if (data.source?.sources) {
        sources = Object.values(data.source.sources);
      } else if (data.sources) {
        sources = Array.isArray(data.sources)
          ? data.sources
          : Object.values(data.sources);
      } else if (data.context?.sources) {
        sources = Object.values(data.context.sources);
      } else if (data.choices?.[0]?.message?.sources) {
        sources = Object.values(data.choices[0].message.sources);
      }

      // Debug logging
      if (this.options.debug) {
        console.log("API Response:", data);
        console.log("Sources found:", sources);
        console.log("Content:", assistantContent);

        // Check for citation numbers in content
        const citationMatches = assistantContent.match(/\[(\d+)\]/g);
        console.log("Citation numbers found in content:", citationMatches);
      }

      this.history.push(
        { role: "user", content: message },
        { role: "assistant", content: assistantContent },
      );

      this.hideTyping();
      this.addMessage("assistant", assistantContent, sources);

      if (!this.isOpen) {
        this.unreadCount++;
        this.updateUnreadBadge();
        this.showMessagePreview(data.response);
        this.button.style.animation = "pulse 0.5s ease 3";
        setTimeout(() => {
          this.button.style.animation = "";
        }, 1500);
      }

      this.saveState();
    } catch (error) {
      console.error("Chat error:", error);
      this.hideTyping();
      this.addMessage(
        "assistant",
        "⚠️ Sorry, I encountered an error. Please try again.",
      );
    }

    this.inputEl.focus();
  }

  showTyping() {
    const typingEl = document.createElement("div");
    typingEl.className = "message assistant";
    typingEl.id = "typing-indicator";
    typingEl.innerHTML =
      '<div class="typing-indicator"><span></span><span></span><span></span></div>';
    this.messagesEl.appendChild(typingEl);
    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;

    if (!this.isOpen) {
      this.buttonTypingIndicator.style.display = "flex";
      this.button.classList.add("has-preview");
    }
  }

  hideTyping() {
    const typingEl = document.getElementById("typing-indicator");
    if (typingEl) typingEl.remove();
    this.buttonTypingIndicator.style.display = "none";
    this.button.classList.remove("has-preview");
  }

  showMessagePreview(message) {
    if (!this.isOpen && message) {
      this.hideMessagePreview();
      const preview = document.createElement("div");
      preview.className = "button-message-preview";
      preview.id = "message-preview";
      const truncated =
        message.length > 60 ? message.substring(0, 60) + "..." : message;
      preview.textContent = truncated;
      this.button.appendChild(preview);
      this.previewTimeout = setTimeout(() => this.hideMessagePreview(), 5000);
    }
  }

  hideMessagePreview() {
    const preview = document.getElementById("message-preview");
    if (preview) preview.remove();
    if (this.previewTimeout) clearTimeout(this.previewTimeout);
  }

  addMessage(type, content, sources = []) {
    const messageEl = document.createElement("div");
    messageEl.className = `message ${type}`;
    const formatted = this.formatMessage(content);
    const time = this.formatTime(new Date());
    messageEl.innerHTML = `
      <div class="message-bubble">${formatted}</div>
      <div class="message-time">${time}</div>
    `;
    this.messagesEl.appendChild(messageEl);

    // Add copy buttons to any code blocks in the message
    this.addCopyButtonsToCodeBlocks(messageEl);

    // Render LaTeX in the message
    this.renderLatex(messageEl);

    // Render citations in the message with sources
    this.renderCitations(messageEl, sources);

    this.messagesEl.scrollTop = this.messagesEl.scrollHeight;
  }

  formatMessage(content) {
    const escaped = content
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    return escaped
      .replace(/^### (.*$)/gm, "<h3>$1</h3>")
      .replace(/^## (.*$)/gm, "<h2>$1</h2>")
      .replace(/^# (.*$)/gm, "<h1>$1</h1>")
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/```([^`]+)```/g, "<pre><code>$1</code></pre>")
      .replace(/\n/g, "<br>");
  }

  formatTime(date) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  updateUnreadBadge() {
    if (this.unreadCount > 0) {
      this.unreadBadge.textContent = this.unreadCount;
      this.unreadBadge.style.display = "block";
    } else {
      this.unreadBadge.style.display = "none";
    }
  }

  clearChat() {
    this.history = [];
    this.messagesEl.innerHTML = `
      <div class="message assistant">
        <div class="message-bubble">${this.options.welcomeMessage}</div>
        <div class="message-time">${this.formatTime(new Date())}</div>
      </div>
    `;

    // Add copy buttons to welcome message
    this.addCopyButtonsToCodeBlocks(this.messagesEl);

    // Render LaTeX in welcome message
    this.renderLatex(this.messagesEl);

    // Render citations in welcome message
    this.renderCitations(this.messagesEl.querySelector(".message"), []);

    this.updateUnreadBadge();
    this.saveState();
  }

  saveState() {
    sessionStorage.setItem(
      "universalChatState",
      JSON.stringify({
        history: this.history,
        hasInteracted: this.hasInteracted,
      }),
    );
  }

  restoreState() {
    const saved = sessionStorage.getItem("universalChatState");
    if (saved) {
      const state = JSON.parse(saved);
      this.history = state.history || [];
      this.hasInteracted = state.hasInteracted || false;

      if (this.history.length > 0) {
        this.messagesEl.innerHTML = "";
        this.history.forEach((msg) => {
          if (msg.role !== "system") {
            this.addMessage(
              msg.role === "user" ? "user" : "assistant",
              msg.content,
            );
          }
        });
      }
    }
  }
}

// Auto-initialize
document.addEventListener("DOMContentLoaded", () => {
  const autoInit = document.querySelector("[data-chat-widget]");
  if (autoInit) {
    const options = autoInit.dataset.chatWidget
      ? JSON.parse(autoInit.dataset.chatWidget)
      : {};
    window.chatWidget = new UniversalChatWidget(options);
  }
});

window.UniversalChatWidget = UniversalChatWidget;
