var WebSocket = require('ws');
var wss = new WebSocket.Server({ port: process.env.PORT || 8080 });

function rand (min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function broadcast(message) {
    wss.clients.forEach(function (client) {
        if (client.readyState == WebSocket.OPEN) {
            client.send(JSON.stringify(message));
        }
    });
}

var players = [], chats = [], CHAT_MAX = 15;

function treeEnter (player_id) {
    if (rand(1, 25) == 1) {
        players[player_id].money += rand(1, 5);
        broadcast({ type: 'player_change', player_id: player_id, money: players[player_id].money });
    }
}

var objects = [
    // Logo
    { x: 0, y: 250, width: 400, height: 130, url: 'logo.png' },

    // Doors
    { x: 0, y: 0, width: 100, height: 200, url: 'door.jpg', enter: function (player_id) {
        players[player_id].x = 100;
        players[player_id].y = 2000;
        players[player_id].health -= rand(1, 5);
        broadcast({ type: 'player_change', player_id: player_id, x: players[player_id].x, y: players[player_id].y, health: players[player_id].health });
    } },
    { x: 0, y: 2000, width: 100, height: 200, url: 'door.jpg', enter: function (player_id) {
        players[player_id].x = -100;
        players[player_id].y = 0;
        players[player_id].health -= rand(1, 5);
        broadcast({ type: 'player_change', player_id: player_id, x: players[player_id].x, y: players[player_id].y, health: players[player_id].health });
    } },
    { x: -500, y: 100, width: 100, height: 200, url: 'door.jpg', enter: function (player_id) {
        players[player_id].x = 0;
        players[player_id].y = -2000;
        players[player_id].health -= rand(1, 5);
        broadcast({ type: 'player_change', player_id: player_id, x: players[player_id].x, y: players[player_id].y, health: players[player_id].health });
    } },
    { x: -100, y: -2000, width: 100, height: 200, url: 'door.jpg', enter: function (player_id) {
        players[player_id].x = -600;
        players[player_id].y = 100;
        players[player_id].health -= rand(1, 5);
        broadcast({ type: 'player_change', player_id: player_id, x: players[player_id].x, y: players[player_id].y, health: players[player_id].health });
    } },

    // Hospital
    { x: 500, y: -400, width: 500, height: 500, url: 'hospital.png', enter: function (player_id) {
        if (players[player_id].health < players[player_id].max_health && players[player_id].money >= 1) {
            players[player_id].health += rand(0, 1);
            players[player_id].money -= 1;
            broadcast({ type: 'player_change', player_id: player_id, health: players[player_id].health, money: players[player_id].money });
        }
    } },

    // Shop
    { x: -400, y: 600, width: 500, height: 500, url: 'shop.png', enter: function (player_id) {
        players[player_id].x = 9800;
        players[player_id].y = 10000;
        broadcast({ type: 'player_change', player_id: player_id, x: players[player_id].x, y: players[player_id].y });
    } },
    { x: 10000, y: 10000, width: 1000, height: 800, url: 'wood.jpg' },
    { x: 9700, y: 10000, width: 100, height: 200, url: 'door.jpg', enter: function (player_id) {
        players[player_id].x = -400;
        players[player_id].y = 300;
        broadcast({ type: 'player_change', player_id: player_id, x: players[player_id].x, y: players[player_id].y });
    } },
    { x: 10250, y: 9800, width: 150, height: 150, url: 'swords.jpg', enter: function (player_id) {
        if (players[player_id].money >= 10) {
            players[player_id].max_attack += rand(1, 3);
            players[player_id].money -= 10;
            broadcast({ type: 'player_change', player_id: player_id, max_attack: players[player_id].max_attack, money: players[player_id].money });
        }
    } },
    { x: 10350, y: 10150, width: 100, height: 200, url: 'armor.jpg', enter: function (player_id) {
        if (players[player_id].money >= 10) {
            players[player_id].max_health += rand(1, 10);
            players[player_id].money -= 10;
            broadcast({ type: 'player_change', player_id: player_id, max_health: players[player_id].max_health, money: players[player_id].money });
        }
    } },
    { x: 10100, y: 10250, width: 200, height: 150, url: 'shoes.jpg', enter: function (player_id) {
        if (players[player_id].money >= 50) {
            players[player_id].speed += 1;
            players[player_id].money -= 50;
            broadcast({ type: 'player_change', player_id: player_id, speed: players[player_id].speed, money: players[player_id].money });
        }
    } },

    // Trees
    { x: -800, y: 50, width: 300, height: 300, url: 'tree.png', enter: treeEnter },
    { x: 300, y: 850, width: 300, height: 300, url: 'tree.png', enter: treeEnter },
    { x: 100, y: 2400, width: 300, height: 300, url: 'tree.png', enter: treeEnter },
    { x: -100, y: -1600, width: 300, height: 300, url: 'tree.png', enter: treeEnter },

    // Banks
    { x: -500, y: -500, width: 500, height: 500, url: 'bank.jpg', enter: function (player_id) {
        players[player_id].money += rand(0, 1);
        broadcast({ type: 'player_change', player_id: player_id, money: players[player_id].money });
    } },
    { x: 600, y: 400, width: 500, height: 500, url: 'bank.jpg', enter: function (player_id) {
        players[player_id].money += rand(0, 1);
        broadcast({ type: 'player_change', player_id: player_id, money: players[player_id].money });
    } },
    { x: 500, y: 2000, width: 500, height: 500, url: 'bank.jpg', enter: function (player_id) {
        players[player_id].money += rand(0, 2);
        broadcast({ type: 'player_change', player_id: player_id, money: players[player_id].money });
    } },
    { x: 400, y: -2000, width: 500, height: 500, url: 'bank.jpg', enter: function (player_id) {
        players[player_id].money += rand(0, 2);
        broadcast({ type: 'player_change', player_id: player_id, money: players[player_id].money });
    } },

    // Treasure
    { x: 165892, y: 165892, width: 300, height: 300, url: 'treasure.jpg', enter: function (player_id) {
        players[player_id].money += rand(5000, 10000);
        broadcast({ type: 'player_change', player_id: player_id, money: players[player_id].money });
    } }
];

function serverChat(text) {
    chats.push({ player_id: -1, text: text });
    if (chats.length > CHAT_MAX) chats.shift();
    broadcast({ type: 'player_chat', player_id: -1, text: text });
}

wss.on('connection', function (ws) {
    ws.on('message', function (data) {
        var message = JSON.parse(data);
        if (message.type == 'player_new') {
            var player_id = 0;
            while (players[player_id]) player_id++;
            ws.send(JSON.stringify({ type: 'player_id', player_id: player_id }));
            players[player_id] = { player_id: player_id, name: message.name, x: message.x, y: message.y, facing: message.facing, health: message.health, max_health: message.max_health, money: message.money, max_attack: message.max_attack, speed: message.speed, ws: ws };
            message.player_id = player_id;
            serverChat(message.name + ' joined');
            broadcast(message);
        }
        if (message.type == 'player_change' && players[message.player_id]) {
            if (message.name != undefined) players[message.player_id].name = message.name;
            if (message.x != undefined) players[message.player_id].x = message.x;
            if (message.y != undefined) players[message.player_id].y = message.y;
            if (message.facing != undefined) players[message.player_id].facing = message.facing;
            if (message.health != undefined) players[message.player_id].health = message.health;
            if (message.max_health != undefined) players[message.player_id].max_health = message.max_health;
            if (message.money != undefined) players[message.player_id].money = message.money;
            if (message.max_attack != undefined) players[message.player_id].max_attack = message.max_attack;
            if (message.speed != undefined) players[message.player_id].speed = message.speed;
            wss.clients.forEach(function (client) {
                if (client != ws && client.readyState == WebSocket.OPEN) {
                    client.send(JSON.stringify(message));
                }
            });
        }
        if (message.type == 'player_chat' && players[message.player_id]) {
            chats.push({ player_id: message.player_id, text: message.text });
            if (chats.length > CHAT_MAX) chats.shift();
            wss.clients.forEach(function (client) {
                if (client != ws && client.readyState == WebSocket.OPEN) {
                    client.send(JSON.stringify(message));
                }
            });
        }
    });
    ws.on('close', function () {
        for (var i = 0; i < players.length; i++) {
            if (players[i] && players[i].ws == ws) {
                broadcast({ type: 'player_remove', player_id: i });
                serverChat(players[i].name + ' leaved');
                players[i] = undefined;
                break;
            }
        }
    });
    for (var i = 0; i < players.length; i++) {
        if (players[i]) {
            ws.send(JSON.stringify({ type: 'player_new', player_id: i, name: players[i].name, x: players[i].x, y: players[i].y, facing: players[i].facing, health: players[i].health, max_health: players[i].max_health, money: players[i].money, max_attack: players[i].max_attack, speed: players[i].speed }));
        }
    }
    for (var i = 0; i < objects.length; i++) {
        ws.send(JSON.stringify({ type: 'object_new', x: objects[i].x, y: objects[i].y, width: objects[i].width, height: objects[i].height, url: objects[i].url }));
    }
    for (var i = 0; i < chats.length; i++) {
        ws.send(JSON.stringify({ type: 'player_chat', player_id: chats[i].player_id, text: chats[i].text }));
    }
});

setInterval(function () {
    for (var i = 0; i < players.length; i++) {
        if (players[i]) {
            if (players[i].health <= 0) {
                broadcast({ type: 'player_remove', player_id: i });
                serverChat(players[i].name + ' died');
                players[i].ws.close();
                players[i] = undefined;
                continue;
            }

            for (var j = 0; j < objects.length; j++) {
                if (
                    objects[j].enter &&
                    players[i].x > objects[j].x - objects[j].width / 2 &&
                    players[i].y > objects[j].y - objects[j].height / 2 &&
                    players[i].x < objects[j].x + objects[j].width / 2 &&
                    players[i].y < objects[j].y + objects[j].height / 2
                ) {
                    objects[j].enter(i);
                }
            }
        }
    }
}, 1000 / 5);