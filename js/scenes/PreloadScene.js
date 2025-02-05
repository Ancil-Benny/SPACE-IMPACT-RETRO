export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super('PreloadScene');
  }

  preload() {
    // Create loading text
    const loadingText = this.add.text(400, 300, 'Loading...', {
      font: '20px Arial',
      fill: '#ffffff'
    }).setOrigin(0.5);

    // Create progress bar background
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(240, 270, 320, 50);

    // Create progress bar
    const progressBar = this.add.graphics();

    // Load images and audio assets
    this.load.image('background', 'assets/images/background.png');
    this.load.image('player', 'assets/images/player.png');
    this.load.image('enemy', 'assets/images/enemy.png');
    this.load.image('bullet', 'assets/images/bullet.png');

    this.load.audio('backgroundMusic', 'assets/audio/backgroundMusic.mp3');
    this.load.audio('shoot', 'assets/audio/shoot.wav');
    this.load.audio('explosion', 'assets/audio/explosion.wav');

    // Listen to the 'progress' event to update the progress bar
    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(250, 280, 300 * value, 30);
    });

    // Once loading is complete, remove the progress graphics and start MenuScene
    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
      this.scene.start('MenuScene');
    });
  }

  // Removed create() method to avoid conflicting scene start calls
}