module.exports = {
  name: "clientReady",
  once: true,
  async execute(client) {
    console.log(`${client.user.tag} olarak giriş yapıldı.`);
  },
};
