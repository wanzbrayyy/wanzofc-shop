class TelegramApi {
  constructor(botToken) {
    if (!botToken) {
      throw new Error('Bot token is required for Telegram API.');
    }
    this.botToken = botToken;
    this.baseUrl = `https://api.telegram.org/bot${this.botToken}`;
  }

  async _callApi(method, payload = {}) {
    try {
      const response = await fetch(`${this.baseUrl}/${method}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!data.ok) {
        throw new Error(`Telegram API error: ${data.description}`);
      }
      return data.result;
    } catch (error) {
      console.error(`Failed to call API method ${method}:`, error);
      throw error;
    }
  }

  async getBotInfo() {
    return this._callApi('getMe');
  }

  async sendMessage(chatId, text, options = {}) {
    const payload = { chat_id: chatId, text, ...options };
    return this._callApi('sendMessage', payload);
  }

  async answerCallbackQuery(callbackQueryId, text = '', showAlert = false) {
    const payload = { callback_query_id: callbackQueryId, text, show_alert: showAlert };
    return this._callApi('answerCallbackQuery', payload);
  }

  createInlineKeyboard(buttons) {
    return { reply_markup: { inline_keyboard: buttons } };
  }

  createReplyKeyboard(buttons, options = {}) {
    return {
      reply_markup: {
        keyboard: buttons,
        resize_keyboard: true,
        one_time_keyboard: false,
        ...options,
      },
    };
  }
}

export default TelegramApi;