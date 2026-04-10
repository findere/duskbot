module.exports = {
  name: "xp-ekle",
  async execute(message, args, client) {
    try {
      if (
        !message.member.permissions.has(
          client.permissions.Flags.Administrator
        )
      ) {
        await message.reply("Bu komutu kullanmak için yönetici olmalısın.");
        return;
      }

      const targetUser = message.mentions.users.first();
      const amount = Number(args[1]);

      if (!targetUser || !Number.isInteger(amount) || amount <= 0) {
        await message.reply("Kullanım: `!xp-ekle @kullanici miktar`");
        return;
      }

      const updatedData = await client.levelUtils.addXp(targetUser.id, amount);

      await message.reply(
        `${targetUser} kullanıcısına **${amount} XP** eklendi. Yeni seviye: **${updatedData.level}**, mevcut XP: **${updatedData.xp}**`
      );
    } catch (error) {
      console.error("xp-ekle komutunda hata oluştu:", error);
      await message.reply("XP eklenirken bir hata oluştu.");
    }
  },
};
