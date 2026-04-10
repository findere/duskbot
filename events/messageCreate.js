module.exports = {
  name: "messageCreate",
  async execute(message, client) {
    try {
      if (!message.guild || message.author.bot) {
        return;
      }

      const prefix = "!";

      if (message.content.startsWith(prefix)) {
        const args = message.content.slice(prefix.length).trim().split(/\s+/);
        const commandName = args.shift()?.toLowerCase();
        const command = client.commands.get(commandName);

        if (command) {
          await command.execute(message, args, client);
        }
      }

      const cooldownKey = `${message.guild.id}-${message.author.id}`;
      const lastMessageTime = client.cooldowns.get(cooldownKey);
      const now = Date.now();

      if (lastMessageTime && now - lastMessageTime < 60_000) {
        return;
      }

      client.cooldowns.set(cooldownKey, now);

      const earnedXp = Math.floor(Math.random() * 11) + 5;
      const userData = await client.levelUtils.addXp(message.author.id, earnedXp);

      if (userData.leveledUp) {
        const levelChannels = client.config.levelChannels || [];
        const targetChannel =
          message.guild.channels.cache.find((c) =>
            levelChannels.includes(c.id)
          ) || message.channel;

        const embed = client.levelUtils
          .createBaseEmbed("#2F3136")
          .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
          .setDescription(
            `**Level-up!**\n**${userData.oldLevel} • ${userData.level}**`
          );

        await targetChannel.send({
          content: `${message.author} **${userData.level}.** seviyeye ulaştı helal olsun!`,
          embeds: [embed],
        });
      }
    } catch (error) {
      console.error("messageCreate olayında hata oluştu:", error);
    }
  },
};
