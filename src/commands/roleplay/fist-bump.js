const { fetchMember } = require('../../tools');
const { createEmbed } = require('../../utils/embed');
const { fist_bump: images } = require('../../../assets/responses/links.json');

module.exports.run = async ({ message, args }) => {
	// Get user
	let user;
	if (args[0]) user = fetchMember(message, args.join(' '));
	if (!user && args[0]) user = args.join(' ');
	if (user && typeof user !== 'string') user = user.displayName;

	// Set the sentence
	const title = user
		? `${message.member.displayName} has fist bumped ${user}!`
		: `${message.member.displayName} is fist bumping themself!`;

	// Get Image
	const image = images[Math.floor(Math.random() * images.length)];

	return message.channel.send(
		createEmbed({
			title,
			image,
		}),
	);
};

module.exports.config = {
	name: 'fist-bump',
};
