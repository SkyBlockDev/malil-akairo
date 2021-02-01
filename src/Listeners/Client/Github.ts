import { Listener } from "discord-akairo";
import { Message } from "discord.js";
import Client from "../../client/Client";
import { MessageEmbed, TextChannel } from "discord.js";
import * as db from "quick.db";
import fetch from "node-fetch";

export default class github extends Listener {
	client: Client;
	public constructor(client: Client) {
		super("github", {
			emitter: "client",
			event: "ready",
			category: "client"
		});
		this.client = client;
	}

	async exec(message: Message) {
		async function refreshData(client) {
			let x = 3200; // 5 Seconds

			let repos = client.releases.get("all");
			for (var i = 0; i < repos.length; i++) {
				/* ----------------------- */
				let split = repos[i].split("|");
				const data = await fetch(`https://api.github.com/repos/${split[0]}/releases`).then((response) =>
					response.json()
				);

				if (data.documentation_url) {
				} else {
					if ((await compare(split, data)) == true) {
					} else {
						/* ----------------------- */
						for (var l = 0; l < repos.length; l++) {
							if (repos[l] == repos[i]) {
								repos.splice(l, 1);
							}
						}
						/* ----------------------- */

						client.releases.set("all", repos);
						client.releases.push("all", split[0] + "|" + data[0].tag_name);

						let url = data[0].html_url.split("/");

						let servers = client.releases.keyArray();
						const fetchs = await fetch(data[0].url).then((response) => response.json());
						/* ----------------------- */
						SendMessage(servers, split, client, url, data, fetchs);
						/* ----------------------- */
					}
					if (!data[0].tag_name) {
					}
				}
			}
			setTimeout(refreshData, x * 1000);
		}

		async function SendMessage(servers, split, client, url, data, fetchs) {
			for (var i = 0; i < servers.length; i++) {
				/* ----------------------- */
				let body = fetchs.body;
				if (servers[i] == "all") return;
				let bodylength = body.length;

				if (!body) body = "no description";
				if (bodylength > 1024) {
					function cutString(s, n) {
						/* ----------------------- */
						var cut = s.indexOf(" ", n);
						if (cut == -1) return s;
						return s.substring(0, cut);
					}
					/* ----------------------- */
					body = cutString(body, 400);
					console.log(body);
					body += "....";
				}
				console.log(body);
				if (!client.releases.get(servers[i], "repos").includes(split[0])) {
				}
				const downloadurl = fetchs.assets[0].browser_download_url
					? fetchs.assets[0].browser_download_url
					: "none";
				let id = client.releases.get(servers[i], "channel");
				let channel = await client.channels.fetch(id);
				const embed = new MessageEmbed()
					.setDescription(data[0].html_url + "\nDownload url: " + downloadurl)
					.setTitle("new release from:  " + data[0].author.login)
					.addField(url[4] + " " + data[0].tag_name, body);
				await (channel as TextChannel).send(embed);
				/* ----------------------- */
			}
		}

		async function compare(split, data) {
			/* ----------------------- */
			if (split[1] == data[0].tag_name) return true;
			else return false;
			/* ----------------------- */
		}
		refreshData(this.client);

		/*

        [
  {
    url: 'https://api.github.com/repos/SkyBlockDev/The-trickster/releases/35188037',
    assets_url: 'https://api.github.com/repos/SkyBlockDev/The-trickster/releases/35188037/assets',
    upload_url: 'https://uploads.github.com/repos/SkyBlockDev/The-trickster/releases/35188037/assets{?name,label}',
    html_url: 'https://github.com/SkyBlockDev/The-trickster/releases/tag/2.31.1',
    id: 35188037,
    author: {
      login: 'SkyBlockDev',
      id: 72335827,
      node_id: 'MDQ6VXNlcjcyMzM1ODI3',
      avatar_url: 'https://avatars.githubusercontent.com/u/72335827?v=4',
      gravatar_id: '',
      url: 'https://api.github.com/users/SkyBlockDev',
      html_url: 'https://github.com/SkyBlockDev',
      followers_url: 'https://api.github.com/users/SkyBlockDev/followers',
      following_url: 'https://api.github.com/users/SkyBlockDev/following{/other_user}',
      gists_url: 'https://api.github.com/users/SkyBlockDev/gists{/gist_id}',
      starred_url: 'https://api.github.com/users/SkyBlockDev/starred{/owner}{/repo}',
      subscriptions_url: 'https://api.github.com/users/SkyBlockDev/subscriptions',
      organizations_url: 'https://api.github.com/users/SkyBlockDev/orgs',
      repos_url: 'https://api.github.com/users/SkyBlockDev/repos',
      events_url: 'https://api.github.com/users/SkyBlockDev/events{/privacy}',
      received_events_url: 'https://api.github.com/users/SkyBlockDev/received_events',
      type: 'User',
      site_admin: false
    },
    node_id: 'MDc6UmVsZWFzZTM1MTg4MDM3',
    tag_name: '2.31.1',
    target_commitish: 'master',

        */
	}
}