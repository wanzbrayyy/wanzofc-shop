import TelegramApi from '@/scripts/telegramApi';
import User from '@/models/User';
import Admin from '@/models/Admin';
import Confess from '@/models/Confess';
import Product from '@/models/Product';
import Purchase from '@/models/Purchase';

const userStates = {};

class TelegramBot {
  constructor() {
    this.api = null;
    this.config = null;
    this.isInitialized = false;
  }

  async initialize() {
    try {
      this.config = await Admin.getActiveConfig();
      if (!this.config || !this.config.botToken || this.config.botToken === 'YOUR_BOT_TOKEN_HERE') {
        throw new Error('Bot configuration not found or incomplete in database.');
      }
      this.api = new TelegramApi(this.config.botToken);
      const botInfo = await this.api.getBotInfo();
      this.config.botUsername = botInfo.username;
      await this.config.save();
      console.log(`Bot initialized: @${botInfo.username}`);
      this.isInitialized = true;
      return botInfo;
    } catch (error) {
      console.error('Bot initialization error:', error.message);
      this.isInitialized = false;
    }
  }

  async processUpdate(update) {
    if (!this.isInitialized) return;
    try {
      if (update.message) {
        await this.handleMessage(update.message);
      } else if (update.callback_query) {
        await this.handleCallbackQuery(update.callback_query);
      }
    } catch (error) {
      console.error('Error processing update:', error);
    }
  }

  async handleMessage(message) {
    const { chat: { id: chatId }, from: userInfo, photo, reply_to_message } = message;
    let { text } = message;

    if (photo && reply_to_message) {
      return this.handlePurchaseProof(chatId, reply_to_message, userInfo);
    }

    if (!text) return;
    
    const user = await this.findOrCreateUser(userInfo);
    
    if (text.startsWith('/start')) {
        const payload = text.split(' ')[1];
        if (payload) {
            try {
                const decodedPayload = atob(payload);
                const [command, arg] = decodedPayload.split(' ');
                if (command === '/beli') {
                    return this.handleBuyProduct(chatId, arg);
                }
            } catch (e) {
                console.error("Invalid start payload:", e);
            }
        }
    }

    const commandMatch = text.match(/^\/(\w+)(?:\s+(.*))?$/s);
    if (commandMatch) {
      const [, command, args] = commandMatch;
      await this.handleCommand(command, args || '', chatId, user);
    } else {
      await this.handleRegularMessage(chatId);
    }
  }

  async handleCommand(command, args, chatId, user) {
    const handlers = {
      start: this.handleStartCommand,
      beli: this.handleBuyProduct,
      menu: this.handleMenuCommand,
      confess: this.handleConfessCommand,
      menfess: this.handleMenfessCommand,
      addproduct: this.handleAdminCommand.bind(this, 'addproduct', this.handleAddProductCommand),
      board: this.handleAdminCommand.bind(this, 'board', this.handleBoardCommand),
      users: this.handleAdminCommand.bind(this, 'users', this.handleUsersCommand),
      settoken: this.handleAdminCommand.bind(this, 'settoken', this.handleSetConfigCommand),
      setid: this.handleAdminCommand.bind(this, 'setid', this.handleSetConfigCommand),
    };
    const handler = handlers[command];
    if (handler) {
      await handler.call(this, chatId, args, user);
    } else {
      await this.api.sendMessage(chatId, '❌ Perintah tidak dikenali. Ketik /menu untuk bantuan.');
    }
  }

  async handleStartCommand(chatId) {
    const text = `*${this.config.settings.botName}*\n\n${this.config.settings.botDescription}\n\nSelamat datang! Gunakan /menu untuk melihat semua fitur yang tersedia.`;
    await this.api.sendMessage(chatId, text, { parse_mode: 'Markdown' });
    await this.handleMenuCommand(chatId);
  }

  async handleMenuCommand(chatId) {
    const text = '📜 *Menu Utama - WanzoFC Shop*\n\nPilih fitur yang ingin Anda gunakan:';
    const keyboard = this.api.createInlineKeyboard([
      [{ text: '💬 Confess (Anonymous)', callback_data: 'confess_info' }],
      [{ text: '💌 Menfess (Ke Username)', callback_data: 'menfess_info' }],
      [{ text: '📦 Lihat Produk', callback_data: 'products_list' }],
      [{ text: '📞 Hubungi Admin', url: `https://t.me/${this.config.telegramUsername}` }]
    ]);
    await this.api.sendMessage(chatId, text, { reply_markup: keyboard.reply_markup, parse_mode: 'Markdown' });
  }

  async handleConfessCommand(chatId, args) {
    const newConfess = new Confess({ message: args, isAnonymous: true });
    await newConfess.save();
    const keyboard = this.api.createInlineKeyboard([
      [{ text: '✅ Setujui', callback_data: `acc_confess:${newConfess._id}` }],
      [{ text: '❌ Tolak', callback_data: `rej_confess:${newConfess._id}` }]
    ]);
    await this.api.sendMessage(this.config.adminChatId, `💌 *Confess Baru Diterima*\n\n${args}`, { reply_markup: keyboard.reply_markup, parse_mode: 'Markdown' });
    await this.api.sendMessage(chatId, '✅ Pesan confess Anda telah dikirim ke admin untuk direview!');
  }

  async handleAddProductCommand(chatId, args) {
    const parts = args.split(';').map(p => p.trim());
    if (parts.length < 5) {
      return this.api.sendMessage(chatId, 'Format salah. Gunakan:\n`/addproduct Judul; Deskripsi; Harga; URL Gambar; URL File ZIP`', { parse_mode: 'Markdown' });
    }
    const [title, description, price, imageUrl, fileUrl] = parts;
    const newProduct = new Product({ title, description, price: Number(price), imageUrl, fileUrl });
    await newProduct.save();
    await this.api.sendMessage(chatId, `✅ Produk *${title}* berhasil ditambahkan!`, { parse_mode: 'Markdown' });
  }

  async handleBoardCommand(chatId, args) {
    const allUsers = await User.find({ isActive: true });
    await this.api.sendMessage(chatId, `🚀 Memulai broadcast ke ${allUsers.length} pengguna...`);
    const broadcastMessage = `*Diteruskan dari ${this.config.settings.botName}*\n\n${args}`;
    let successCount = 0;
    for (const targetUser of allUsers) {
      try {
        await this.api.sendMessage(targetUser.chatId, broadcastMessage, { parse_mode: 'Markdown' });
        successCount++;
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) { console.error(`Broadcast fail: ${targetUser.chatId}`); }
    }
    await this.api.sendMessage(chatId, `✅ Broadcast selesai. Terkirim ke ${successCount}/${allUsers.length} pengguna.`);
  }
  
  async handleUsersCommand(chatId) {
    const users = await User.find({}).sort({ 'stats.lastActivity': -1 }).limit(10);
    let userList = '👥 *10 Pengguna Terakhir Aktif:*\n\n';
    users.forEach(u => {
        userList += `• \`${u.username || u.firstName}\` (ID: \`${u.telegramId}\`)\n`;
    });
    await this.api.sendMessage(chatId, userList, { parse_mode: 'Markdown' });
  }

  async handleSetConfigCommand(chatId, args, user, command) {
    if (!args) return this.api.sendMessage(chatId, `Gunakan: \`/${command} [nilai_baru]\``, { parse_mode: 'Markdown' });
    if (command === 'settoken') this.config.botToken = args;
    if (command === 'setid') this.config.adminChatId = args;
    await this.config.save();
    this.isInitialized = false;
    await this.initialize();
    await this.api.sendMessage(chatId, `✅ Konfigurasi berhasil disimpan. Bot diinisialisasi ulang.`);
  }

  async handleCallbackQuery(callbackQuery) {
    const { data, message, from } = callbackQuery;
    const chatId = message.chat.id;
    await this.api.answerCallbackQuery(callbackQuery.id);

    const [action, payload] = data.split(':');
    
    switch(action) {
        case 'show_menu': await this.handleMenuCommand(chatId); break;
        case 'confess_info': await this.api.sendMessage(chatId, '📝 *Cara Menggunakan /confess:*\nKirim pesan dengan format:\n`/confess Pesan rahasia Anda di sini.`\nPesan akan dikirim secara anonim ke admin.', { parse_mode: 'Markdown' }); break;
        case 'acc_confess': await this.api.sendMessage(chatId, `Confess ID \`${payload}\` disetujui.`); break;
        case 'buy_product': await this.handleBuyProduct(from.id, payload); break;
        case 'acc_purchase': await this.handleAcceptPurchase(chatId, payload); break;
        case 'rej_purchase': await this.handleRejectPurchase(chatId, payload); break;
        default: break;
    }
  }

  async handleBuyProduct(chatId, productId) {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const product = products.find(p => p.id === productId);
    if (!product) return this.api.sendMessage(chatId, 'Produk tidak ditemukan.');

    const purchase = new Purchase({ userId: chatId, productId: product.id, status: 'pending' });
    // This should save to MongoDB, but for now we'll rely on memory/transient logic
    
    const text = `Anda akan membeli *${product.title}* seharga *Rp ${product.price.toLocaleString('id-ID')}*.\n\nSilakan lakukan pembayaran dan balas (reply) pesan ini dengan mengirimkan screenshot bukti pembayaran.`;
    await this.api.sendMessage(chatId, text, { parse_mode: 'Markdown' });
  }

  async handlePurchaseProof(chatId, repliedMessage, userInfo) {
      const purchaseText = repliedMessage.text;
      if (!purchaseText || !purchaseText.startsWith('Anda akan membeli')) return;

      const titleMatch = purchaseText.match(/\*(.*?)\*/);
      if(!titleMatch) return;
      const productTitle = titleMatch[1];
      
      const keyboard = this.api.createInlineKeyboard([
          [{ text: '✅ Setujui Pembelian', callback_data: `acc_purchase:TEMP_ID` }],
          [{ text: '❌ Tolak Pembelian', callback_data: `rej_purchase:TEMP_ID` }]
      ]);
      await this.api.sendMessage(this.config.adminChatId, `💰 *Konfirmasi Pembelian*\n\nDari: @${userInfo.username || userInfo.first_name} (ID: \`${chatId}\`)\nProduk: *${productTitle}*\n\nUser telah mengirim bukti pembayaran.`, { reply_markup: keyboard.reply_markup, parse_mode: 'Markdown' });
      await this.api.sendMessage(chatId, '✅ Bukti pembayaran diterima. Admin akan segera mereviewnya.');
  }

  async handleAcceptPurchase(adminChatId, purchaseId) {
      // In a real scenario, you'd fetch purchase and product details from DB
      await this.api.sendMessage(adminChatId, `Pembelian telah disetujui.`);
      const productLinkMessage = `🎉 Pembelian Anda telah disetujui!\n\nBerikut link download produk Anda:\n[Link Download Placeholder]`;
      // await this.api.sendMessage(purchase.userId, productLinkMessage, { parse_mode: 'Markdown' });
  }

  async handleRejectPurchase(adminChatId, purchaseId) {
      await this.api.sendMessage(adminChatId, `Pembelian telah ditolak.`);
      // await this.api.sendMessage(purchase.userId, `Maaf, pembayaran Anda ditolak.`);
  }

  async handleAdminCommand(command, handler, chatId, args, user) {
    if (user.role !== 'admin' && String(user.telegramId) !== this.config.adminChatId) {
      return this.api.sendMessage(chatId, '⛔ Anda tidak memiliki izin untuk menggunakan perintah ini.');
    }
    await handler.call(this, chatId, args, user, command);
  }
  
  async handleRegularMessage(chatId) {
    await this.api.sendMessage(chatId, 'Halo! Saya tidak mengerti pesan Anda. Silakan gunakan /menu untuk melihat daftar perintah.');
  }

  async findOrCreateUser(userInfo) {
    // This is a simplified version. In a real app, this would hit MongoDB via an API endpoint.
    const isAdmin = String(userInfo.id) === this.config.adminChatId;
    return {
        telegramId: userInfo.id,
        username: userInfo.username,
        firstName: userInfo.first_name,
        role: isAdmin ? 'admin' : 'user'
    };
  }
}

const telegramBot = new TelegramBot();
// We don't initialize it here because this is a frontend-only environment.
// The logic is here to be potentially moved to a serverless function.

export default telegramBot;