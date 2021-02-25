import { Command } from "discord-akairo";
import { MessageEmbed, Message } from "discord.js";

export default class MockCommand extends Command {
	public constructor() {
		super("mock", {
			aliases: [
				"mock",
				"itriedmybest",
				"mok"
			],
			category: "Fun",
			quoted: true,
			args: [
				{
					id: "args",
					type: "array",
					match: "rest",
					default: "Me When No Arguments"
				}
			],
			description: {
				content: "Find your 8ball",
				usage: "mock",
				example: [
					"mock"
				]
			},
			ratelimit: 3,
			channel: "guild"
		});
	}

	public async exec(message: Message, { args }) {
		// -- split the args
		const array = args.split("");
		// -- defining text
		let text = "";
		// -- foreach item
		array.forEach((item: any) => {
			text += tried(item);
		});
		// -- send the output
		message.util.send(text.replace(/@/g, "@​"));

		// -- my amazing function
		function tried(item) {
			const num = Math.floor(Math.random() * 2);
			// -- if its a space return
			if (item == " ") return item;
			// -- advanced rng
			if (num == 0) {
				item = item.toLowerCase();
				return item;
			} else {
				item = item.toUpperCase();
				return item;
			}
		}
		// -- end of code tour
	}
}
