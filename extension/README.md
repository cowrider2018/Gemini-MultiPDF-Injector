# Gemini Injector (Chrome 擴充)

此擴充在 Gemini 頁面注入一個 content script，並提供擴充介面（popup）可直接插入範例圖片 `example.png` 並送出。

功能：
- Popup：從擴充功能圖示打開 popup，預覽 `example.png`，按「插入 example.png」按鈕會嘗試透過拖放/貼上事件把該圖片插入 Gemini 的輸入框，並可選擇是否同時送出。
- Page events：仍保留原先的 page-level custom events：`gemini_inject_text`（只插入文字）與 `gemini_inject_text_and_send`（插入文字並嘗試送出）。另外新增可由擴充接收的 message：`{ action: 'inject_image', image: 'example.png', send: true }`。

使用方式：
1. 以開發者模式載入 unpacked extension（目錄為本套件的 `extension/`）。
2. 在 Gemini 分頁點選瀏覽器右上方的擴充圖示，點選「插入 example.png」按鈕。

備援：
- 若 content script 未在該分頁運行，popup 會讀取 `example.png` 內容並使用 `chrome.scripting.executeScript` 在頁面內直接注入圖片（需在 manifest 授權 `scripting` 和 `activeTab`）。

若要由 Selenium 使用，請參考 workspace 下的 `selenium/send_to_gemini.py` 腳本，或直接發送 message：
```
chrome.tabs.sendMessage(tabId, { action: 'inject_image', image: 'example.png', send: true })
```