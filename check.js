const https = require('https');

const icons = [
    'croissant', 'bread', 'baguette',
    'steak', 'meat', 'beef',
    'cheese', 'cheese-wedge',
    'leaf', 'lettuce', 'cabbage', 'broccoli',
    'snowflake', 'ice', 
    'ketchup', 'sauce', 'bottle', 'mustard',
    'soda-cup', 'drink', 'cola', 'can',
    'sparkling', 'stars', 'magic', 'spice', 'salt',
    'box', 'package', 'cardboard-box', 'take-away-food', 'paper-bag'
];

async function checkUrl(icon) {
    const url = `https://img.icons8.com/3d-fluency/94/${icon}.png`;
    return new Promise((resolve) => {
        https.get(url, (res) => {
            resolve({ icon, status: res.statusCode });
        }).on('error', () => resolve({ icon, status: 500 }));
    });
}

async function run() {
    const results = await Promise.all(icons.map(checkUrl));
    const valid = results.filter(r => r.status === 200).map(r => r.icon);
    console.log("Valid icons:", valid.join(', '));
}

run();
