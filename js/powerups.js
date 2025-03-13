const PowerUps = (function() {
    // PowerUp types configuration
    const powerUpTypes = {
        health: {
            width: 20,
            height: 20,
            effect: 'restoreHealth',
            value: 25, // Health points to restore
            duration: 0, // Instant effect
            sprite: 'assets/images/powerups/health.png'
        },
        shield: {
            width: 20,
            height: 20,
            effect: 'addShield',
            value: 50, // Shield strength
            duration: 10, // Shield duration in seconds
            sprite: 'assets/images/powerups/shield.png'
        },
        weapon: {
            width: 20,
            height: 20,
            effect: 'upgradeWeapon',
            value: 'laser', // Weapon type to upgrade to
            duration: 15, // Weapon upgrade duration
            sprite: 'assets/images/powerups/weapon.png'
        },
        missile: {
            width: 20,
            height: 20,
            effect: 'upgradeWeapon',
            value: 'missile', // Weapon type to upgrade to
            duration: 10, // Weapon upgrade duration
            sprite: 'assets/images/powerups/missile.png'
        },
        speedBoost: {
            width: 20,
            height: 20,
            effect: 'speedBoost',
            value: 1.5, // Speed multiplier
            duration: 8, // Speed boost duration
            sprite: 'assets/images/powerups/speed.png'
        }
    };
    
    // Global PowerUps state
    let powerUps = [];
    let activePowerUps = [];
    
    function init() {
        powerUps = [];
        activePowerUps = [];
    }
    

    function update(deltaTime) {
        for (let i = powerUps.length - 1; i >= 0; i--) {
            const powerUp = powerUps[i];
            
 
            powerUp.position.x -= 100 * deltaTime; 
            
     
            if (powerUp.position.x < -powerUp.width) {
                removePowerUp(i);
                continue;
            }
            
            updatePowerUpElement(powerUp);
        }
        
  
        for (let i = activePowerUps.length - 1; i >= 0; i--) {
            const activePowerUp = activePowerUps[i];
            
  
            activePowerUp.timeLeft -= deltaTime;
            
  
            if (activePowerUp.timeLeft <= 0) {
                removePowerUpEffect(activePowerUp);
                activePowerUps.splice(i, 1);
            }
        }
    }
    

    function create(type, position) {
        const powerUpConfig = powerUpTypes[type];
        if (!powerUpConfig) return;
        
        const powerUp = {
            id: 'powerup-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
            type: type,
            position: { ...position },
            width: powerUpConfig.width,
            height: powerUpConfig.height,
            effect: powerUpConfig.effect,
            value: powerUpConfig.value,
            duration: powerUpConfig.duration,
            sprite: powerUpConfig.sprite
        };
        
 
        const powerUpElement = $('<div>')
            .addClass('powerup')
            .attr('id', powerUp.id)
            .css({
                width: powerUp.width + 'px',
                height: powerUp.height + 'px',
                left: powerUp.position.x + 'px',
                top: powerUp.position.y + 'px',
                backgroundImage: `url('${powerUp.sprite}')`,
                position: 'absolute',
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat'
            });
        
        $('#game-area').append(powerUpElement);
        powerUps.push(powerUp);
        
        return powerUp;
    }
    

    function spawnRandom(position) {
        const types = Object.keys(powerUpTypes);
        const randomType = types[Math.floor(Math.random() * types.length)];
        
        create(randomType, position);
    }
    

    function collect(powerUpId) {
        const powerUpIndex = powerUps.findIndex(p => p.id === powerUpId);
        if (powerUpIndex === -1) return;
        
        const powerUp = powerUps[powerUpIndex];
        

        applyPowerUpEffect(powerUp);
        

        Utils.showMessage(`${powerUp.type.toUpperCase()} collected!`);
        

        removePowerUp(powerUpIndex);
    }
    

    function applyPowerUpEffect(powerUp) {
        switch (powerUp.effect) {
            case 'restoreHealth':
                Player.restoreHealth(powerUp.value);
                break;
                
            case 'addShield':
                Player.addShield(powerUp.value);
                
 
                if (powerUp.duration > 0) {
                    activePowerUps.push({
                        type: powerUp.type,
                        effect: powerUp.effect,
                        value: powerUp.value,
                        timeLeft: powerUp.duration
                    });
                }
                break;
                
            case 'upgradeWeapon':
                Player.upgradeWeapon(powerUp.value);
                
                if (powerUp.duration > 0) {
                    activePowerUps.push({
                        type: powerUp.type,
                        effect: powerUp.effect,
                        value: powerUp.value,
                        timeLeft: powerUp.duration
                    });
                }
                break;
                
            case 'speedBoost':
                Player.boostSpeed(powerUp.value);
                

                if (powerUp.duration > 0) {
                    activePowerUps.push({
                        type: powerUp.type,
                        effect: powerUp.effect,
                        value: powerUp.value,
                        timeLeft: powerUp.duration
                    });
                }
                break;
        }
    }
    

    function removePowerUpEffect(activePowerUp) {
        switch (activePowerUp.effect) {
            case 'addShield':
                // Remove shield
                Player.removeShield();
                break;
                
            case 'upgradeWeapon':
                // Revert to basic weapon
                Player.revertWeapon();
                break;
                
            case 'speedBoost':
                Player.resetSpeed();
                break;
        }
        

        Utils.showMessage(`${activePowerUp.type.toUpperCase()} expired!`);
    }
    

    function removePowerUp(index) {
        const powerUp = powerUps[index];
        $('#' + powerUp.id).remove();
        powerUps.splice(index, 1);
    }
    

    function updatePowerUpElement(powerUp) {
        $('#' + powerUp.id).css({
            left: powerUp.position.x + 'px',
            top: powerUp.position.y + 'px'
        });
    }
    

    function checkCollisionsWithPlayer(playerBox) {
        for (let i = powerUps.length - 1; i >= 0; i--) {
            const powerUp = powerUps[i];
            const powerUpBox = {
                x: powerUp.position.x,
                y: powerUp.position.y,
                width: powerUp.width,
                height: powerUp.height
            };
            
            if (Utils.rectCollision(playerBox, powerUpBox)) {
                collect(powerUp.id);
            }
        }
    }
    
  
    function clear() {
        for (const powerUp of powerUps) {
            $('#' + powerUp.id).remove();
        }
        

        powerUps = [];
        activePowerUps = [];
    }
    

    return {
        init,
        update,
        create,
        spawnRandom,
        checkCollisionsWithPlayer,
        clear
    };
})();