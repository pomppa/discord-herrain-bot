const keyv = require('./keyv');

module.exports = {
    // Generic handler for any word list, create a new key value
    // pair by supplying key as pameter
    async execute(interaction, dataKey) {
        const word = interaction.options.getString('word');

        return new Promise(resolve => {
            keyv.get(dataKey).then(words => {

                // List all words
                if (interaction.options.getSubcommand() === 'list') {
                    const list = words.length !== 0 ? ': \n' + words.join('\n') : ' empty.';
                    resolve(`Current **${dataKey}** list is${list}`);
                }

                // Add a new word if it does not exist
                if (interaction.options.getSubcommand() === 'add' && word) {
                    if (words.indexOf(word) === -1) {
                        words.push(word);
                        keyv.set(dataKey, words).then(() => {
                            const list = words.length !== 0 ? ': \n' + words.join('\n') : ' empty.';
                            resolve(`Added ${word} to **${dataKey}** words list.` + '\n\n' +
                                'Current list is' + list,
                            );
                        });
                    }
                    else {
                        // Send list if word exists
                        const list = words.length !== 0 ? ': \n' + words.join('\n') : ' empty.';
                        resolve(`${word} already exists on **${dataKey}** list.` + '\n\n' +
                            'Current list is' + list,
                        );
                    }
                }

                // Remove a word if it exists
                if (interaction.options.getSubcommand() === 'remove' && word) {
                    const wordIndex = words.indexOf(word);
                    if (wordIndex !== -1) {
                        words.splice(wordIndex, 1);
                        keyv.set(dataKey, words).then(() => {
                            const list = words.length !== 0 ? ': \n' + words.join('\n') : ' empty.';
                            resolve(`Removed ${word} from **${dataKey}** words list.` + '\n\n' +
                                'Current list is' + list,
                            );
                        });
                    }
                    else {
                        // Send message if word does not exist
                        const list = words.length !== 0 ? ': \n' + words.join('\n') : ' empty.';
                        resolve(`${word} does not exist on **${dataKey}** list.` + '\n\n' +
                            'Current list is' + list,
                        );
                    }
                }
                else if (!word) {
                    // If no word was given to remove
                    resolve('Supply a word to remove.');
                }
            });
        });
    },
};