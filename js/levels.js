
const Levels = {
    // Level 1 definition
    Level1: (function() {
        const config = {
            background: 'assets/images/backgrounds/level1_bg.png',
            music: 'assets/audio/music/level1.mp3',
            enemySpawnRate: 2.5,
            totalWaves: 5,
            bossWave: true
        };
        
        // Enemy wave definitions
        const waves = [
            // Wave 1: Basic enemies
            {
                enemies: [
                    { type: 'basic', position: { x: 500, y: 50 }, movementPattern: 'sine-wave' },
                    { type: 'basic', position: { x: 550, y: 150 } },
                    { type: 'basic', position: { x: 600, y: 250 }, movementPattern: 'sine-wave' }
                ],
                delay: 0
            },
            // Wave 2: Basic + Scout
            {
                enemies: [
                    { type: 'basic', position: { x: 500, y: 100 } },
                    { type: 'scout', position: { x: 550, y: 200 }, movementPattern: 'zigzag' },
                    { type: 'scout', position: { x: 600, y: 50 }, movementPattern: 'zigzag' }
                ],
                delay: 5
            },
            // Wave 3: Mixed enemies
            {
                enemies: [
                    { type: 'bomber', position: { x: 500, y: 150 } },
                    { type: 'basic', position: { x: 550, y: 50 } },
                    { type: 'basic', position: { x: 550, y: 250 } },
                    { type: 'scout', position: { x: 600, y: 120 }, movementPattern: 'homing' }
                ],
                delay: 10
            },
            // Wave 4: Heavy wave
            {
                enemies: [
                    { type: 'bomber', position: { x: 500, y: 50 } },
                    { type: 'bomber', position: { x: 500, y: 250 } },
                    { type: 'basic', position: { x: 550, y: 100 }, movementPattern: 'sine-wave' },
                    { type: 'basic', position: { x: 550, y: 200 }, movementPattern: 'sine-wave' },
                    { type: 'scout', position: { x: 600, y: 150 }, movementPattern: 'homing' }
                ],
                delay: 15
            },
            // Wave 5: Boss wave
            {
                enemies: [
                    { type: 'boss1', position: { x: 400, y: 120 }, movementPattern: 'sine-wave' }
                ],
                delay: 20
            }
        ];
        
        let currentWave = 0;
        let waveTimer = null;
        

        function load() {
            $('#game-area').css('background-image', `url('${config.background}')`);
            

            currentWave = 0;
            spawnNextWave();
            
            // Play background music
            // TODO: Add audio system
        }
        

        function spawnNextWave() {
            if (currentWave < waves.length) {
                const wave = waves[currentWave];
                
   
                wave.enemies.forEach(enemyConfig => {
                    Enemies.create(
                        enemyConfig.type,
                        enemyConfig.position,
                        {
                            movementPattern: enemyConfig.movementPattern
                        }
                    );
                });
                
                currentWave++;
                if (currentWave < waves.length) {
                    const nextWaveDelay = waves[currentWave].delay - (wave.delay || 0);
                    waveTimer = setTimeout(spawnNextWave, nextWaveDelay * 1000);
                }
            }
        }
        
    
        return {
            load
        };
    })(),
    
    // Level 2 definition
    Level2: (function() {
        const config = {
            background: 'assets/images/backgrounds/level2_bg.png',
            music: 'assets/audio/music/level2.mp3',
            enemySpawnRate: 2.0,
            totalWaves: 6,
            bossWave: true
        };
        
        // Enemy wave definitions - more challenging than Level 1
        const waves = [
            // Wave 1: Mixed enemies
            {
                enemies: [
                    { type: 'basic', position: { x: 500, y: 50 }, movementPattern: 'zigzag' },
                    { type: 'basic', position: { x: 550, y: 150 }, movementPattern: 'zigzag' },
                    { type: 'scout', position: { x: 600, y: 250 }, movementPattern: 'sine-wave' },
                    { type: 'scout', position: { x: 650, y: 100 }, movementPattern: 'sine-wave' }
                ],
                delay: 0
            },
            // Wave 2: Bomber wave
            {
                enemies: [
                    { type: 'bomber', position: { x: 500, y: 100 } },
                    { type: 'bomber', position: { x: 550, y: 200 } },
                    { type: 'scout', position: { x: 450, y: 150 }, movementPattern: 'homing' }
                ],
                delay: 5
            },
            // Wave 3: Scout swarm
            {
                enemies: [
                    { type: 'scout', position: { x: 500, y: 50 }, movementPattern: 'zigzag' },
                    { type: 'scout', position: { x: 520, y: 100 }, movementPattern: 'zigzag' },
                    { type: 'scout', position: { x: 540, y: 150 }, movementPattern: 'zigzag' },
                    { type: 'scout', position: { x: 560, y: 200 }, movementPattern: 'zigzag' },
                    { type: 'scout', position: { x: 580, y: 250 }, movementPattern: 'zigzag' }
                ],
                delay: 10
            },
            // Wave 4: Heavy bombers
            {
                enemies: [
                    { type: 'bomber', position: { x: 500, y: 50 } },
                    { type: 'bomber', position: { x: 520, y: 150 } },
                    { type: 'bomber', position: { x: 540, y: 250 } },
                    { type: 'basic', position: { x: 600, y: 100 }, movementPattern: 'sine-wave' },
                    { type: 'basic', position: { x: 620, y: 200 }, movementPattern: 'sine-wave' }
                ],
                delay: 15
            },
            // Wave 5: Mixed heavy wave
            {
                enemies: [
                    { type: 'bomber', position: { x: 500, y: 80 } },
                    { type: 'bomber', position: { x: 550, y: 240 } },
                    { type: 'basic', position: { x: 520, y: 160 }, movementPattern: 'homing' },
                    { type: 'scout', position: { x: 600, y: 120 }, movementPattern: 'zigzag' },
                    { type: 'scout', position: { x: 620, y: 200 }, movementPattern: 'zigzag' }
                ],
                delay: 20
            },
            // Wave 6: Boss wave
            {
                enemies: [
                    { type: 'boss2', position: { x: 400, y: 120 }, movementPattern: 'sine-wave' },
                    { type: 'scout', position: { x: 450, y: 80 }, movementPattern: 'homing' },
                    { type: 'scout', position: { x: 450, y: 160 }, movementPattern: 'homing' }
                ],
                delay: 25
            }
        ];
        
        let currentWave = 0;
        let waveTimer = null;
        
        // Load the level
        function load() {
            $('#game-area').css('background-image', `url('${config.background}')`);
            
            currentWave = 0;
            spawnNextWave();
            
            // Play background music
            // TODO: Add audio system
        }
        

        function spawnNextWave() {
            if (currentWave < waves.length) {
                const wave = waves[currentWave];
                

                wave.enemies.forEach(enemyConfig => {
                    Enemies.create(
                        enemyConfig.type,
                        enemyConfig.position,
                        {
                            movementPattern: enemyConfig.movementPattern
                        }
                    );
                });
                
   
                currentWave++;
                if (currentWave < waves.length) {
                    const nextWaveDelay = waves[currentWave].delay - (wave.delay || 0);
                    waveTimer = setTimeout(spawnNextWave, nextWaveDelay * 1000);
                }
            }
        }
        

        return {
            load
        };
    })()
};