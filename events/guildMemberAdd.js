module.exports = {
  name: "guildMemberAdd",
  async execute(member, client) {
    try {
      const channel = await member.guild.channels.fetch(client.config.channelId);

      if (!channel || !channel.isTextBased()) {
        return;
      }

      const count = member.guild.memberCount;
      const getOrdinal = (n) => {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
      };

      const embed = client.levelUtils
        .createBaseEmbed("#57F287")
        .setDescription(
          `**✣ Dusk Requiem'e hoş geldin!**\nSen bizim **${getOrdinal(
            count
          )}** üyemizsin 🔥\nKuralları oku, sonra ağlama 😎`
        )
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }));

      await channel.send({
        content: `Yo ${member}! 👀`,
        embeds: [embed],
      });
    } catch (error) {
      console.error("Üye giriş mesajı gönderilemedi:", error);
    }
  },
};
