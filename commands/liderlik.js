module.exports = {
  name: "liderlik",
  async execute(message, args, client) {
    try {
      const leaderboard = await client.levelUtils.getLeaderboard();

      if (!leaderboard.length) {
        await message.reply("Henüz liderlik tablosunda gösterilecek veri yok.");
        return;
      }

      const rows = await Promise.all(
        leaderboard.map(async (entry, index) => {
          const user =
            client.users.cache.get(entry.userId) ||
            (await client.users.fetch(entry.userId).catch(() => null));

          const username = user ? user.username : `Bilinmeyen Kullanıcı (${entry.userId})`;
          return `**${index + 1}.** ${username} • Level: **${entry.level}** • XP: **${entry.xp}**`;
        })
      );

      const embed = client.levelUtils
        .createBaseEmbed("#3498DB")
        .setTitle("Liderlik Tablosu")
        .setDescription(rows.join("\n"));

      await message.reply({ embeds: [embed] });
    } catch (error) {
      console.error("liderlik komutunda hata oluştu:", error);
      await message.reply("Liderlik tablosu oluşturulurken bir hata oluştu.");
    }
  },
};
