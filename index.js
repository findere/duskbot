const fs = require("fs");
const path = require("path");
const http = require("http");
const {
  Client,
  Collection,
  GatewayIntentBits,
  Partials,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const db = require("croxydb");
let config = {};
try {
  config = require("./config.json");
} catch (e) {
  // config.json dosyası bulunamadı (Render gibi ortamlarda bu normaldir)
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

client.commands = new Collection();

// Render/Environment desteği için kanalları ayarla
const parseChannels = (channels) => {
  if (!channels) return [];
  if (Array.isArray(channels)) return channels;
  return channels.split(",").map((id) => id.trim());
};

client.config = {
  ...config,
  welcomeChannels: parseChannels(
    process.env.WELCOME_CHANNELS || config.welcomeChannels
  ),
  levelChannels: parseChannels(
    process.env.LEVEL_CHANNELS || config.levelChannels
  ),
};

client.db = db;
client.cooldowns = new Map();
client.permissions = PermissionsBitField;

client.levelUtils = {
  getRequiredXp(level) {
    return 5 * level ** 2 + 50 * level + 100;
  },

  getUserKey(userId) {
    return `levels.${userId}`;
  },

  async getUserData(userId) {
    const key = this.getUserKey(userId);
    const userData = await client.db.get(key);

    if (userData) {
      return userData;
    }

    const defaultData = { xp: 0, level: 0 };
    await client.db.set(key, defaultData);
    return defaultData;
  },

  async setUserData(userId, data) {
    const key = this.getUserKey(userId);
    await client.db.set(key, data);
  },

  async addXp(userId, amount) {
    const userData = await this.getUserData(userId);
    userData.xp += amount;

    const oldLevel = userData.level;
    let leveledUp = false;
    while (userData.xp >= this.getRequiredXp(userData.level)) {
      userData.xp -= this.getRequiredXp(userData.level);
      userData.level += 1;
      leveledUp = true;
    }

    await this.setUserData(userId, userData);

    return {
      ...userData,
      oldLevel,
      leveledUp,
    };
  },

  async getLeaderboard() {
    const allEntries = client.db.all();

    // croxydb.all() returns an object: { "key": value, ... }
    return Object.entries(allEntries)
      .filter(([key]) => key.startsWith("levels."))
      .map(([key, value]) => ({
        userId: key.replace("levels.", ""),
        xp: value?.xp ?? 0,
        level: value?.level ?? 0,
      }))
      .sort((a, b) => {
        if (b.level !== a.level) {
          return b.level - a.level;
        }

        return b.xp - a.xp;
      })
      .slice(0, 10);
  },

  createBaseEmbed(color) {
    return new EmbedBuilder()
      .setColor(color)
      .setTimestamp()
      .setFooter({ text: "Dusk Requiem Bot" });
  },
};

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(path.join(commandsPath, file));
  client.commands.set(command.name, command);
}

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
  .readdirSync(eventsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
  const event = require(path.join(eventsPath, file));

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

client.on("error", (error) => {
  console.error("Discord istemcisi hatası:", error);
});

process.on("unhandledRejection", (error) => {
  console.error("Yakalanmayan Promise hatası:", error);
});

process.on("uncaughtException", (error) => {
  console.error("Yakalanmayan istisna:", error);
});

// Web Sunucusu (Render/UptimeRobot için)
http.createServer((req, res) => {
  res.write("Bot is online!");
  res.end();
}).listen(process.env.PORT || 3000);

const token = process.env.TOKEN || config.token;

client.login(token).catch((error) => {
  console.error("Bot giriş yapamadı:", error);
});
