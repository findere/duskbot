module.exports = {
  name: "clientReady",
  once: true,
  async execute(client) {
    console.log(`${client.user.tag} olarak giriş yapıldı.`);

    // --- BUMP HATIRLATICI SİSTEMİ ---
    // Eğer index.js'de config nesnesi global client içine yüklenmişse veya process.env kullanıyorsak kontrol edelim
    const bumpChannelId = client.config?.bumpChannel || "1486346475402170440";
    
    // 1 Saat 50 Dakika = 110 dakika = 110 * 60 * 1000 = 6600000 milisaniye
    const BUMP_INTERVAL = 110 * 60 * 1000; 

    setInterval(async () => {
      try {
        const channel = await client.channels.fetch(bumpChannelId);
        if (channel) {
          channel.send("@iandrexcb sunucuya bump zamanı geldi! :clock2: Lütfen `/bump` komutunu kullanın.");
        }
      } catch (error) {
        console.error("Bump kanalı bulunamadı veya mesaj gönderilemedi:", error);
      }
    }, BUMP_INTERVAL);
    // -------------------------------
  },
};
