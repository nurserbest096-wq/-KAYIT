const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  PermissionFlagsBits
} = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Botun çalışıp çalışmadığını kontrol eder."),

  new SlashCommandBuilder()
    .setName("yardim")
    .setDescription("Kayıt botu komutlarını gösterir."),

  new SlashCommandBuilder()
    .setName("kayit")
    .setDescription("Bir üyeyi kayıt eder.")
    .addUserOption(option =>
      option
        .setName("uye")
        .setDescription("Kayıt edilecek üye")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("isim")
        .setDescription("Üyenin ismi")
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option
        .setName("yas")
        .setDescription("Üyenin yaşı")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(99)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames),

  new SlashCommandBuilder()
    .setName("kayitsiz")
    .setDescription("Bir üyeyi kayıtsız yapar.")
    .addUserOption(option =>
      option
        .setName("uye")
        .setDescription("Kayıtsız yapılacak üye")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
].map(command => command.toJSON());

client.once("ready", async () => {
  console.log(`${client.user.tag} olarak giriş yapıldı!`);

  try {
    await client.application.commands.set(commands);
    console.log("Slash komutları Discord'a yüklendi!");
  } catch (error) {
    console.error("Komut yükleme hatası:", error);
  }
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply("🏓 Pong! Bot çalışıyor.");
  }

  if (interaction.commandName === "yardim") {
    await interaction.reply(
      "📋 **Kayıt Botu Komutları**\n\n" +
      "🏓 `/ping` → Botu kontrol eder.\n" +
      "📝 `/kayit` → Üye kaydı yapar.\n" +
      "❌ `/kayitsiz` → Üyeyi kayıtsız yapar."
    );
  }

  if (interaction.commandName === "kayit") {
    const uye = interaction.options.getMember("uye");
    const isim = interaction.options.getString("isim");
    const yas = interaction.options.getInteger("yas");

    if (!uye) {
      return interaction.reply({
        content: "❌ Üye bulunamadı.",
        ephemeral: true
      });
    }

    try {
      await uye.setNickname(`${isim} | ${yas}`);

      await interaction.reply(
        `✅ **${uye.user.username}** başarıyla kayıt edildi!\n` +
        `👤 İsim: **${isim}**\n` +
        `🎂 Yaş: **${yas}**`
      );
    } catch (error) {
      console.error(error);

      await interaction.reply({
        content: "❌ Kullanıcının ismini değiştiremedim. Botun yetkilerini kontrol et.",
        ephemeral: true
      });
    }
  }

  if (interaction.commandName === "kayitsiz") {
    const uye = interaction.options.getMember("uye");

    if (!uye) {
      return interaction.reply({
        content: "❌ Üye bulunamadı.",
        ephemeral: true
      });
    }

    try {
      await uye.setNickname(null);

      await interaction.reply(
        `❌ **${uye.user.username}** kayıtsız duruma getirildi.`
      );
    } catch (error) {
      console.error(error);

      await interaction.reply({
        content: "❌ Kullanıcının ismini değiştiremedim. Botun yetkilerini kontrol et.",
        ephemeral: true
      });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
