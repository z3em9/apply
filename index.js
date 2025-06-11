const {
    Client,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ModalBuilder,
    TextInputStyle,
    TextInputBuilder
} = require('discord.js');
const { PermissionsBitField } = require('discord.js');
const client = new Client({ intents: ['Guilds', 'MessageContent', 'GuildMessages','GuildMembers'] });
const config = require('./config.json');
require('dotenv').config();
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
})

client.on('messageCreate', (message) => {
    if (message.content === '!setup') {
        if(!message.member.permissions.has(PermissionsBitField.Flags.Administrator))return
        const embed = new EmbedBuilder()
        .setTitle(config.title)
        .setDescription('أضـغـط فـي الاسـفـل للتقـديـم')
        .setColor(config.embedcolor)
        const row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
            .setStyle(ButtonStyle.Success)
            .setLabel(config.title)
            .setCustomId('apply')
        )
        const channel = message.guild.channels.cache.get(config.applyroom);
        if (!channel) return;
        channel.send({
            embeds: [embed],
            components: [row]
        })
    }
})

client.on('interactionCreate', async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === 'apply') {
            const modal = new ModalBuilder()
            .setTitle('التـقديـم لللأدارة')
            .setCustomId('staff_apply')
            const nameComponent = new TextInputBuilder()
            .setCustomId('q1')
            .setLabel(`${config.q1}`)
            .setMinLength(2)
            .setMaxLength(25)
            .setRequired(true)
            .setStyle(TextInputStyle.Short)
            const ageComponent = new TextInputBuilder()
            .setCustomId('q2')
            .setLabel(`${config.q2}`)
            .setMinLength(1)
            .setMaxLength(2)
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            const whyYou = new TextInputBuilder()
            .setCustomId(`q3`)
            .setLabel(`${config.q3}`)
            .setMinLength(2)
            .setMaxLength(120)
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            const q4 = new TextInputBuilder()
            .setCustomId('q4')
            .setLabel(`${config.q4}`)
            .setMaxLength(400)
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
            const q5 = new TextInputBuilder()
            .setCustomId('q5')
            .setLabel(`${config.q5}`)
            .setMaxLength(400)
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            const rows = [nameComponent, ageComponent,whyYou,q4,q5].map(
                (component) => new ActionRowBuilder().addComponents(component)
            )
            modal.addComponents(...rows);
            interaction.showModal(modal);
        }
          // Accept and deny buttons
          if (interaction.customId === 'staff_accept') {
            // TODO: save user id in json or sum instead of getting id from embed footer
            const getIdFromFooter = interaction.message.embeds[0].footer.text;
            const getMember = await interaction.guild.members.fetch(getIdFromFooter);
            await getMember.roles.add(config.staffid).catch((err) => {
                console.error(err)
                return interaction.reply({
                    content: ":x: ايرور حصلت مشكلة"
                })
            });
            await interaction.reply({
                content: `${config.yesmessage} ${getMember.user.tag}`
            })
            const newDisabledRow = new ActionRowBuilder()
            .setComponents(
                new ButtonBuilder()
                .setCustomId('staff_accept_ended')
                .setDisabled()
                .setStyle(ButtonStyle.Success)
                .setLabel('قبول')
            )
            .addComponents(
                new ButtonBuilder()
                .setCustomId('staff_deny_ended')
                .setDisabled()
                .setStyle(ButtonStyle.Danger)
                .setLabel('رفض')
            )
            interaction.message.edit({ components: [newDisabledRow] })
        }
        if (interaction.customId === 'staff_deny') {
            // TODO: save user id in json or sum instead of getting id from embed footer
            const getIdFromFooter = interaction.message.embeds[0].footer?.text;
            const getMember = await interaction.guild.members.fetch(getIdFromFooter);
            await interaction.reply({
                content: `${config.nomessage} ${getMember.user}.`
            })
            const newDisabledRow = new ActionRowBuilder()
            .setComponents(
                new ButtonBuilder()
                .setCustomId('staff_accept_ended')
                .setDisabled()
                .setStyle(ButtonStyle.Success)
                .setLabel('قبول')
            )
            .addComponents(
                new ButtonBuilder()
                .setCustomId('staff_deny_ended')
                .setDisabled()
                .setStyle(ButtonStyle.Danger)
                .setLabel('رفض')
            )
            interaction.message.edit({ components: [newDisabledRow] })
        }
    }
    if (interaction.isModalSubmit()) {
        if (interaction.customId === 'staff_apply') {
            const q1 = interaction.fields.getTextInputValue('q1');
            const q2 = interaction.fields.getTextInputValue('q2');
            const q3 = interaction.fields.getTextInputValue('q3');
            const q4 = interaction.fields.getTextInputValue('q4');
            const q5 = interaction.fields.getTextInputValue('q5');
            interaction.reply({
                content: `${config.donesend}`,
                ephemeral: true
            })
            const staffSubmitChannel = interaction.guild.channels.cache.get(config.staffroom);
            if (!staffSubmitChannel) return;
            const embed = new EmbedBuilder()
            .setAuthor({ name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() })
            .setColor(config.embedcolor)
            .setFooter({ text: interaction.user.id })
            .setTimestamp()
            .setThumbnail(interaction.user.displayAvatarURL())
            .addFields(
                {
                    name: `${config.q1}`,
                    value: q1,
                    inline:true
                },
                {
                    name: `${config.q2}`,
                    value: q2,
                    inline:true
                },
                {
                    name: `${config.q3}`,
                    value: q3,
                    inline:true
                },
                {
                    name: `${config.q4}`,
                    value: q4,
                    inline:true
                },
                {
                    name: `${config.q5}`,
                    value: q5,
                    inline:true
                }
            )
            const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                .setCustomId('staff_accept')
                .setLabel('قبول')
                .setStyle(ButtonStyle.Success)
            )
            .addComponents(
                new ButtonBuilder()
                .setCustomId('staff_deny')
                .setLabel('رفض')
                .setStyle(ButtonStyle.Danger)
            )

            staffSubmitChannel.send({
                embeds: [embed],
                components: [row]
            })
        }
    }
})
client.login(process.env.TOKEN)
