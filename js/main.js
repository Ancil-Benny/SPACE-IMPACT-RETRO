import PreloadScene from './scenes/PreloadScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';

// Phaser game configuration object
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: "#000",
    scene: [PreloadScene, MenuScene, GameScene]
};

// Create a new Phaser Game instance with the specified configuration
const game = new Phaser.Game(config);
