module.exports = {
  name: "seviye",
  async execute(message, args, client) {
    try {
      const targetUser = message.mentions.users.first() || message.author;
      const userData = await client.levelUtils.getUserData(targetUser.id);
      const requiredXp = client.levelUtils.getRequiredXp(userData.level);

      const embed = client.levelUtils
        .createBaseEmbed("#5865F2")
        .setAuthor({
          name: `${targetUser.username} kullanıcısının seviye bilgisi`,
          iconURL: targetUser.displayAvatarURL({ dynamic: true }),
        })
        .setThumbnail(targetUser.displayAvatarURL({ dynamic: true, size: 256 }))
        .addFields(
          { name: "Level", value: `${userData.level}`, inline: true },
          { name: "XP", value: `${userData.xp} / ${requiredXp}`, inline: true }
        );

      await message.reply({ embeds: [embed] });
    } catch (error) {
      console.error("seviye komutunda hata oluştu:", error);
      await message.reply("Seviye bilgisi alınırken bir hata oluştu.");
    }
  },
};
