export default class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    // Add background image covering the whole scene
    this.add.image(400, 300, 'background');

    // Start background music and loop it
    const music = this.sound.add('backgroundMusic', { loop: true, volume: 0.5 });
    music.play();

    // Menu options list with positions
    const menuItems = [
      { label: 'Continue', scene: 'GameScene' },
      { label: 'New Game', scene: 'GameScene' },
      { label: 'Music', action: 'toggleMusic' },
      { label: 'Options', action: 'options' },
      { label: 'About', action: 'about' }
    ];

    // Render menu options as interactive texts
    menuItems.forEach((item, index) => {
      let menuText = this.add.text(400, 200 + index * 50, item.label, {
        font: '24px Arial',
        fill: '#ffffff'
      }).setOrigin(0.5);
      
      menuText.setInteractive({ useHandCursor: true });
      menuText.on('pointerup', () => {
        if (item.scene) {
          this.scene.start(item.scene);
        } else if (item.action === 'toggleMusic') {
          // Toggle music: pause/resume
          if (music.isPlaying) {
            music.pause();
          } else {
            music.resume();
          }
        } else if (item.action === 'options') {
          alert('Options not implemented yet.');
        } else if (item.action === 'about') {
          alert('Space Impact Game - Classic Arcade Remake.');
        }
      });
    });
  }
}