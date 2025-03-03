const Player = (function() {
    // Player configuration
    const config = {
        speed: 200,
        health: 100,
        maxHealth: 100,
        lives: 3,
        currentWeapon: 'basic',
        shootCooldown: 0.3, 
        invulnerableTime: 1.5
    };
    
    // Player state
    let position = { x: 50, y: 150 };
    let size = { width: 32, height: 16 };
    let lastShootTime = 0;
    let isInvulnerable = false;
    let invulnerableTimer = 0;
    

    function init() {
        position = { x: 50, y: 150 };
        config.health = config.maxHealth;
        config.lives = 3;
        config.currentWeapon = 'basic';
        lastShootTime = 0;
        isInvulnerable = false;
        invulnerableTimer = 0;
        
 
        updatePlayerElement();
    }
    
 
    function update(deltaTime) {
        if (isInvulnerable) {
            invulnerableTimer -= deltaTime;
            

            if (Math.floor(invulnerableTimer * 10) % 2 === 0) {
                $('#player').css('opacity', '0.5');
            } else {
                $('#player').css('opacity', '1');
            }
            
            if (invulnerableTimer <= 0) {
                isInvulnerable = false;
                $('#player').css('opacity', '1');
            }
        }
        
 
        updatePlayerElement();
    }
    

    function move(direction) {
        const containerWidth = $('#game-area').width();
        const containerHeight = $('#game-area').height();
        const moveSpeed = config.speed / Game.config.fps;
        
  
        switch(direction) {
            case 'up':
                position.y = Math.max(0, position.y - moveSpeed);
                break;
            case 'down':
                position.y = Math.min(containerHeight - size.height, position.y + moveSpeed);
                break;
            case 'left':
                position.x = Math.max(0, position.x - moveSpeed);
                break;
            case 'right':
                position.x = Math.min(containerWidth - size.width, position.x + moveSpeed);
                break;
        }
        

        updatePlayerElement();
    }
    

    function shoot() {
        const currentTime = performance.now() / 1000; 
        

        if (currentTime - lastShootTime < config.shootCooldown) {
            return;
        }
        
   
        lastShootTime = currentTime;
        

        const projectilePosition = {
            x: position.x + size.width,
            y: position.y + size.height / 2 - 4
        };
        
        Projectiles.create('player', projectilePosition, config.currentWeapon);
        
        // Play shoot sound
        // TODO: Add sound effect
    }
    

    function takeDamage(amount) {
        if (isInvulnerable) return;
        
        config.health -= amount;
        
 
        isInvulnerable = true;
        invulnerableTimer = config.invulnerableTime;
        
        // Play damage sound
        // TODO: Add sound effect
        
  
        HUD.updateHealth(config.health);
        
   
        if (config.health <= 0) {
            loseLife();
        }
    }
    
    // Lose a life
    function loseLife() {
        config.lives--;
        
        if (config.lives > 0) {
            config.health = config.maxHealth;
            position = { x: 50, y: 150 };
            updatePlayerElement();
            
            // Update HUD
            HUD.updateHealth(config.health);
        }
    }
    

    function isDead() {
        return config.lives <= 0;
    }
    

    function updatePlayerElement() {
        $('#player').css({
            left: position.x + 'px',
            top: position.y + 'px'
        });
    }
    

    function getBoundingBox() {
        return {
            x: position.x,
            y: position.y,
            width: size.width,
            height: size.height
        };
    }
    

    return {
        init,
        update,
        move,
        shoot,
        takeDamage,
        isDead,
        getBoundingBox,
        config
    };
})();