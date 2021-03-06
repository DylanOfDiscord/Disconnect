const { post } = require('superagent');
const agent = require('superagent');
const { promisifyAll } = require('tsubaki');
const { parseStringAsync } = promisifyAll(require('xml2js'));
const { createEmbed } = require('../../utils/embed');

async function getFromReddit() {
	const { body } = await agent
		.get('https://www.reddit.com/r/rule34.json?sort=top&t=week')
		.query({ limit: 800 });

	const post =
		body.data.children[
			Math.floor(Math.random() * body.data.children.length)
		];

	if (
		!post.data.url.endsWith('.png') &&
		!post.data.url.endsWith('.jpg') &&
		!post.data.url.endsWith('.jpeg')
	)
		return await getFromReddit();
	else return post;
}

async function getFromR34(search) {
	const { text } = await agent.get('https://rule34.xxx/index.php').query({
		page: 'dapi',
		s: 'post',
		q: 'index',
		tags: search,
		limit: 100,
	});

	const { posts } = await parseStringAsync(text);

	if (posts === '0') return null;

	const post = posts.post[Math.floor(Math.random() * posts.post.length)];

	if (
		!post.$.file_url.endsWith('.png') &&
		!post.$.file_url.endsWith('.jpg') &&
		!post.$.file_url.endsWith('.jpeg')
	)
		return await getFromR34(search);
	else return post;
}

module.exports.run = async ({ message, args }) => {
	const search = args.join('_');
	const result =
		args.length < 1 ? await getFromReddit() : await getFromR34(search);

	if (result === null) {
		const res = await getFromReddit();

		const e = await createEmbed({
			title: res.data.title,
			body: `No posts could be found for: ${search}`,
			image: res.data.url,
		});

		return message.channel.send(e);
	}

	const title = args.length < 1 ? result.data.title : `Result from ${search}`;
	const image = args.length < 1 ? result.data.url : result.$.file_url;

	return message.channel.send(
		createEmbed({
			title,
			image,
		}),
	);
};

module.exports.config = {
	isNSFW: true,
	name: 'rule-34',
	aliases: ['r-34'],
};
