import { Command } from "discord-akairo";
import type { Message, GuildMember, ImageSize, AllowedImageFormat, TextChannel } from "discord.js";
import { MessageEmbed } from "discord.js";

export default class QuoteCommand extends Command {
    public constructor() {
        super("quote", {
            aliases: ["quote", 'qt'],
            category: "Utility",
            quoted: true,
            args: [
                {
                    id: "args",
                    type: "array",
                    match: "rest",
                    default: "Please input some code"
                }
            ],
            description: {
                content: "Quotes someone",
                usage: "quote",
                example: [
                    "quote"
                ]
            },
            ratelimit: 3,
            channel: "guild"
        });
    }

    public async exec(message: Message, { args }) {
        let split = args.split('/')
        let channel = split[5]
        let msgid = split[6]
        let chan = await this.client.channels.fetch(channel)
        let msg = await (chan as TextChannel).messages.fetch(msgid)
        
        if (!message.member.guild.me.hasPermission(["MANAGE_WEBHOOKS"])) { return message.channel.send(
        new MessageEmbed()
                    .setAuthor(msg.author.tag, msg.author.avatarURL())
                    .setDescription(msg.content)
                    .setFooter("didnt have WebhookPermissions so send a embed instead")
        )
        }
        // magic
        let webhook = await (chan as TextChannel).createWebhook(msg.author.tag).then(webhook => webhook.edit({avatar: msg.author.displayAvatarURL({ size: 2048, format: "png" })}))
        //
        await webhook.send(msg.content).then(msg => webhook.delete())
        
    }
}