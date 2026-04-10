module.exports = {
  name: "guildMemberRemove",
  async execute(member, client) {
    try {
      const welcomeChannels = client.config.welcomeChannels || [];
      const channel = member.guild.channels.cache.find((c) =>
        welcomeChannels.includes(c.id)
      );

      if (!channel || !channel.isTextBased()) {
        return;
      }

      const count = member.guild.memberCount;

      const embed = client.levelUtils
        .createBaseEmbed("#ED4245")
        .setDescription(
          `**✣ Dusk Requiem'de artık ${count} kişi kaldı.**\nHadi bakalım, bir gün geri gelirsin belki 🤞`
        )
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }));

      await channel.send({
        content: `👋 ${member} gitti...`,
        embeds: [embed],
      });
    } catch (error) {
      console.error("Üye çıkış mesajı gönderilemedi:", error);
    }
  },
};
