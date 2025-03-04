const Game = (function() {
    // Game configuration
    const config = {
        fps: 60,
        gameSpeed: 1,
        currentLevel: 1,
        maxLevel: 2,
        score: 0,
        isRunning: false,
        isPaused: false
    };
    
    // Game state
    let gameLoop;
    let lastFrameTime;
    

    function init() {
        Menu.init();
        HUD.init();
        
        Player.init();
        Enemies.init();
        Projectiles.init();
        PowerUps.init();
        Collision.init();
        

        setupEventListeners();
        

        $('#pause-menu').css('display', 'none').addClass('hidden');
    }
    

    function start() {
        config.isRunning = true;
        config.isPaused = false; 
        config.score = 0;
        config.currentLevel = 1;
        
   
        $('.screen').addClass('hidden');
        $('#game-screen').removeClass('hidden');
        

        $('#pause-menu').css('display', 'none').addClass('hidden');
        
      
        Player.init();
        Enemies.clear();
        Projectiles.clear();
        PowerUps.clear();
        
      
        loadLevel(config.currentLevel);
        

        lastFrameTime = performance.now();
        gameLoop = requestAnimationFrame(update);
    }
    
  
    function update(currentTime) {
        if (config.isPaused) {
            lastFrameTime = currentTime;
            gameLoop = requestAnimationFrame(update);
            return;
        }
        
        const deltaTime = (currentTime - lastFrameTime) / 1000;
        lastFrameTime = currentTime;
        
    
        const cappedDeltaTime = Math.min(deltaTime, 0.05);
        
   
        Player.update(cappedDeltaTime);
        Enemies.update(cappedDeltaTime);
        Projectiles.update(cappedDeltaTime);
        PowerUps.update(cappedDeltaTime);
        
 
        Collision.checkCollisions();
        

        PowerUps.checkCollisionsWithPlayer(Player.getBoundingBox());
        
   
        if (Enemies.isLevelComplete()) {
            Utils.showMessage(`LEVEL ${config.currentLevel} COMPLETE!`, 2000);
            

            setTimeout(() => {
                if (config.currentLevel < config.maxLevel) {
                    config.currentLevel++;
                    loadLevel(config.currentLevel);
                } else {
                    gameOver(true);
                    return;
                }
            }, 2000);
        }
        
 
        if (Player.isDead()) {
            gameOver(false);
            return;
        }
        

        HUD.update();

        gameLoop = requestAnimationFrame(update);
    }
    
   
    function loadLevel(levelNumber) {
        Enemies.clear();
        Projectiles.clear();
        PowerUps.clear();
        
   
        $('#game-area').css('background-image', `url('assets/images/backgrounds/level${levelNumber}_bg.png')`);
        

        if (levelNumber === 1) {
            Levels.Level1.load();
        } else if (levelNumber === 2) {
            Levels.Level2.load();
        }
        

        HUD.updateLevel(levelNumber);
    }
    

    function pause() {
        if (!config.isRunning) return;
        
        config.isPaused = true;
        $('#pause-menu').css('display', 'flex').removeClass('hidden');
    }
    

    function resume() {
        if (!config.isRunning) return;
        
        config.isPaused = false;
        $('#pause-menu').css('display', 'none').addClass('hidden');
    }
    

    function gameOver(isVictory) {
        config.isRunning = false;
        config.isPaused = false;
        cancelAnimationFrame(gameLoop);
        
 
        $('#final-score').text(config.score);
        $('.screen').addClass('hidden');
        $('#game-over-screen').removeClass('hidden');
        

        if (isVictory) {
            $('#game-over-screen h2').text('YOU WIN!').css('color', '#0f0');
        } else {
            $('#game-over-screen h2').text('GAME OVER').css('color', '#f00');
        }
    }
    

    function setupEventListeners() {
        const keyState = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false,
            w: false,
            a: false,
            s: false,
            d: false
        };
        

        $(document).on('keydown', function(e) {
            if (keyState.hasOwnProperty(e.key)) {
                keyState[e.key] = true;
                e.preventDefault();
            }
            

            if ((e.key === ' ' || e.key === 'Enter') && config.isRunning && !config.isPaused) {
                Player.shoot();
                e.preventDefault();
            }
            

            if ((e.key === 'Escape' || e.key === 'p') && config.isRunning) {
                if (config.isPaused) {
                    resume();
                } else {
                    pause();
                }
                e.preventDefault();
            }
        });
        

        $(document).on('keyup', function(e) {
            if (keyState.hasOwnProperty(e.key)) {
                keyState[e.key] = false;
            }
        });
        

        setInterval(function() {
            if (config.isRunning && !config.isPaused) {
                if (keyState.ArrowUp || keyState.w) {
                    Player.move('up');
                }
                if (keyState.ArrowDown || keyState.s) {
                    Player.move('down');
                }
                if (keyState.ArrowLeft || keyState.a) {
                    Player.move('left');
                }
                if (keyState.ArrowRight || keyState.d) {
                    Player.move('right');
                }
            }
        }, 16); 
    }
    

    return {
        init,
        start,
        pause,
        resume,
        gameOver,
        config
    };
})();