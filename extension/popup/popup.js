document.addEventListener('DOMContentLoaded', function () {
  const insertBtn = document.getElementById('insertImageBtn');
  const statusEl = document.getElementById('status');
  const doSendEl = document.getElementById('doSend');
  const preview = document.getElementById('preview');

  preview.src = chrome.runtime.getURL('example.png');

  function updateStatus(msg, isError) {
    statusEl.textContent = msg;
    statusEl.style.color = isError ? '#c00' : '#080';
  }

  insertBtn.addEventListener('click', function () {
    const send = !!doSendEl.checked;

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (!tabs || !tabs[0]) {
        updateStatus('找不到作用中分頁', true);
        return;
      }

      chrome.tabs.sendMessage(tabs[0].id, { action: 'inject_image', image: 'example.png', send: send }, function (response) {
        if (chrome.runtime.lastError) {
          chrome.scripting.executeScript(
            {
              target: { tabId: tabs[0].id },
              func: function (doSend) {
                const selector = 'rich-textarea .ql-editor, .text-input-field_textarea .ql-editor, .ql-editor.textarea.new-input-ui, .ql-editor';
                const editor = document.querySelector(selector);
                if (!editor) {
                  console.warn('Gemini editor not found');
                  return;
                }
                editor.focus();
                fetch(chrome.runtime.getURL('example.png'))
                  .then(r => r.blob())
                  .then(blob => {
                    const file = new File([blob], 'example.png', { type: blob.type || 'image/png' });
                    const dt = new DataTransfer();
                    dt.items.add(file);
                    const dragEventInit = { bubbles: true, cancelable: true, dataTransfer: dt };
                    ['dragenter', 'dragover', 'drop'].forEach(type => editor.dispatchEvent(new DragEvent(type, dragEventInit)));
                    if (!editor.querySelector('img')) {
                      try {
                        const clipboardData = new DataTransfer();
                        clipboardData.items.add(file);
                        const pasteEvent = new ClipboardEvent('paste', {
                          bubbles: true,
                          cancelable: true,
                          clipboardData: clipboardData
                        });
                        editor.dispatchEvent(pasteEvent);
                      } catch (err) {
                        console.warn('paste event unsupported', err);
                      }
                    }
                    if (doSend) {
                      setTimeout(() => {
                        const sendBtn = document.querySelector('button.send-button, button[aria-label*="傳送"], button[aria-label*="Send"], .send-button');
                        if (sendBtn && sendBtn.getAttribute('aria-disabled') !== 'true' && !sendBtn.disabled) {
                          sendBtn.click();
                        } else {
                          editor.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true }));
                        }
                      }, 300);
                    }
                  })
                  .catch(err => console.warn('fallback image fetch failed', err));
              },
              args: [send]
            },
            function (results) {
              if (chrome.runtime.lastError) updateStatus('注入失敗: ' + chrome.runtime.lastError.message, true);
              else updateStatus('已注入（fallback）', false);
            }
          );
        } else {
          updateStatus('已發送至擴充', false);
        }
      });
    });
  });
});
