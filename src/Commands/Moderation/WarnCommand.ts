import { Command } from 'discord-akairo';
import {
	MessageEmbed,
	Message,
	GuildChannel,
	TextChannel,
	GuildMember,
} from 'discord.js';
import { GetMember } from '../../lib/Utils';
import moment from 'moment';
import { utc } from 'moment';

export default class WarnCommand extends Command {
	public constructor() {
		super('warn', {
			aliases: ['warn'],
			category: 'Moderation',
			quoted: true,
			args: [
				{
					id: 'reason',
					type: 'string',
					default: 'No reason provided...',
					match: 'rest',
				},
			],
			description: {
				content: '',
				usage: 'warn',
				example: ['warn'],
			},
			clientPermissions: ['SEND_MESSAGES'],
			userPermissions: ['MANAGE_MESSAGES'],
			ratelimit: 3,
			channel: 'guild',
		});
	}
	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	public async exec(message: Message, { reason }) {
		const split = reason.split(' ');
		reason = split.slice(1).join(' ');

		const user = await GetMember(message, reason);
		if (!user) return message.util.send('please mention a user');

		await user
			.send(
				`You has been Warned in **${message.guild.name}** for : \`${reason}\``
			)
			.catch((e) =>
				message.reply(
					'Couldnt send a message to this usser but he has been warned'
				)
			);
		const usID = (user as GuildMember).id;
		//* ------------------------------------ infraction code */
		this.client.infractions.ensure(message.guild.id, { [usID]: {} });
		const infraction = this.client.infractions.get(message.guild.id, usID);
		const riw = {
			who: message.author.tag,
			reason: reason,
			type: 'warn',
		};
		infraction[Date.now()] = riw;
		this.client.infractions.set(message.guild.id, infraction, usID);
		//* ------------------------------------ infraction code */

		message.util.send(
			new MessageEmbed()
				.setAuthor(message.guild.name)
				.setThumbnail((user as GuildMember).user.avatarURL())
				.setDescription(`User was warned`)
				.setTimestamp()
		);
		if (this.client.logchannel.get(message.guild.id)) {
			if (
				((await this.client.channels.fetch(
					this.client.logchannel.get(message.guild.id)
				)) as GuildChannel).deleted == false
			) {
				const embed = new MessageEmbed()
					.setAuthor(
						`User Warned by ${message.author.tag}`,
						message.author.avatarURL()
					)
					.setDescription(
						`Member: ${(user as GuildMember).user.tag}\nReason ${reason}`
					)
					.setColor(this.client.consts.colors.red)
					.setTimestamp();
				((await this.client.channels.fetch(
					this.client.logchannel.get(message.guild.id)
				)) as TextChannel).send(embed);
			}
		}
	}
}
