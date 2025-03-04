const Enemies = (function() {
    // Enemy types configuration
    const enemyTypes = {
        basic: {
            width: 32,
            height: 24,
            health: 10,
            speed: 100,
            points: 10,
            shootInterval: 2, 
            projectileType: 'enemy-basic',
            sprite: 'assets/images/enemies/enemy_drone.png'
        },
        bomber: {
            width: 40,
            height: 32,
            health: 20,
            speed: 80,
            points: 20,
            shootInterval: 3,
            projectileType: 'enemy-bomber',
            sprite: 'assets/images/enemies/enemy_bomber.png'
        },
        scout: {
            width: 28,
            height: 20,
            health: 5,
            speed: 150,
            points: 15,
            shootInterval: 1.5,
            projectileType: 'enemy-scout',
            sprite: 'assets/images/enemies/enemy_scout.png'
        },
        boss1: {
            width: 96,
            height: 64,
            health: 200,
            speed: 50,
            points: 500,
            shootInterval: 1,
            projectileType: 'enemy-boss',
            sprite: 'assets/images/enemies/bosses/boss_battlestation.png'
        },
        boss2: {
            width: 128,
            height: 80,
            health: 300,
            speed: 60,
            points: 1000,
            shootInterval: 0.8,
            projectileType: 'enemy-boss',
            sprite: 'assets/images/enemies/bosses/boss_dreadnought.png'
        }
    };
    
    // Global enemies state
    let enemies = [];
    let totalEnemiesInLevel = 0;
    let defeatedEnemies = 0;
    let bossDefeated = false;
    
    //  enemies system
    function init() {
        enemies = [];
        totalEnemiesInLevel = 0;
        defeatedEnemies = 0;
        bossDefeated = false;
    }
    
   
    function update(deltaTime) {
        const gameArea = $('#game-area');
        const areaWidth = gameArea.width();
        
        // Update each enemy
        for (let i = enemies.length - 1; i >= 0; i--) {
            const enemy = enemies[i];
            
         
            if (enemy.isBoss) {
                if (enemy.position.x > areaWidth * 0.7) {
                    enemy.position.x -= enemy.speed * deltaTime;
                }
                
         
                if (enemy.movementPattern) {
                    applyMovementPattern(enemy, deltaTime);
                }
                
    
                const healthPercent = enemy.health / enemy.maxHealth * 100;
                
   
                if (healthPercent < 30) {
             
                    enemy.shootCooldown -= deltaTime * 1.5;
                    
       
                    if (enemy.shootCooldown <= 0) {
                        bossFuryAttack(enemy);
                        enemy.shootCooldown = enemy.shootInterval * 0.6; 
                    }
                } else if (healthPercent < 70) {
             
                    enemy.shootCooldown -= deltaTime * 1.2;
                    
                    if (enemy.shootCooldown <= 0) {
                        bossSpreadAttack(enemy);
                        enemy.shootCooldown = enemy.shootInterval * 0.8;
                    }
                } else {
             
                    enemy.shootCooldown -= deltaTime;
                    
                    if (enemy.shootCooldown <= 0 && enemy.position.x < areaWidth) {
                        enemyShoot(enemy);
                        enemy.shootCooldown = enemy.shootInterval;
                    }
                }
            } else {
               
                enemy.position.x -= enemy.speed * deltaTime;
                
             
                if (enemy.movementPattern) {
                    applyMovementPattern(enemy, deltaTime);
                }
                
        
                if (enemy.position.x < -enemy.width) {
                    removeEnemy(i);
                    continue;
                }
                

                enemy.shootCooldown -= deltaTime;
                if (enemy.shootCooldown <= 0 && enemy.position.x < areaWidth) {
                    enemyShoot(enemy);
                    enemy.shootCooldown = enemy.shootInterval;
                }
            }
            

            updateEnemyElement(enemy);
        }
    }
    

    function applyMovementPattern(enemy, deltaTime) {
        switch (enemy.movementPattern) {
            case 'sine-wave':
                // Sine wave movement
                enemy.patternTime += deltaTime;
                enemy.position.y = enemy.baseY + Math.sin(enemy.patternTime * 2) * 50;
                break;
            case 'zigzag':
                // Zigzag movement
                enemy.patternTime += deltaTime;
                if (enemy.patternTime > 1) {
                    enemy.patternDirection = -enemy.patternDirection;
                    enemy.patternTime = 0;
                }
                enemy.position.y += enemy.patternDirection * enemy.speed * 0.5 * deltaTime;
                break;
            case 'homing':
                // Homing movement (follows player)
                const playerY = Player.getBoundingBox().y + Player.getBoundingBox().height / 2;
                const diff = playerY - (enemy.position.y + enemy.height / 2);
                enemy.position.y += Math.sign(diff) * enemy.speed * 0.3 * deltaTime;
                break;
        }
    }
    
    // Create a new enemy
    function create(type, position, options = {}) {
        const enemyConfig = enemyTypes[type];
        if (!enemyConfig) return;
        
        const enemy = {
            id: 'enemy-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
            type: type,
            position: { ...position },
            baseY: position.y, 
            width: enemyConfig.width,
            height: enemyConfig.height,
            health: enemyConfig.health,
            maxHealth: enemyConfig.health,
            speed: enemyConfig.speed,
            points: enemyConfig.points,
            shootInterval: enemyConfig.shootInterval,
            shootCooldown: Math.random() * enemyConfig.shootInterval, 
            projectileType: enemyConfig.projectileType,
            sprite: enemyConfig.sprite,
            isBoss: type.includes('boss'),
            patternTime: 0,
            patternDirection: 1,
            ...options
        };
        
    
        const enemyElement = $('<div>')
            .addClass('enemy')
            .attr('id', enemy.id)
            .css({
                width: enemy.width + 'px',
                height: enemy.height + 'px',
                left: enemy.position.x + 'px',
                top: enemy.position.y + 'px',
                backgroundImage: `url('${enemy.sprite}')`
            });
        
        $('#game-area').append(enemyElement);
        enemies.push(enemy);
        totalEnemiesInLevel++;
        
        return enemy;
    }
    
  
    function enemyShoot(enemy) {
        const projectilePosition = {
            x: enemy.position.x,
            y: enemy.position.y + enemy.height / 2
        };
        
        Projectiles.create('enemy', projectilePosition, enemy.projectileType);
    }
    

    function bossSpreadAttack(enemy) {
        const angles = [-20, -10, 0, 10, 20]; 
        
        angles.forEach(angle => {
            const radians = angle * (Math.PI / 180);
            const speedX = Math.cos(radians) * -300; 
            const speedY = Math.sin(radians) * 300;
            
            const projectilePosition = {
                x: enemy.position.x,
                y: enemy.position.y + enemy.height / 2
            };
            
            Projectiles.createDirectional('enemy', projectilePosition, enemy.projectileType, speedX, speedY);
        });
    }
    
 
    function bossFuryAttack(enemy) {
        const numBullets = 8;
        
        for (let i = 0; i < numBullets; i++) {
       
            const angle = (Math.random() * 80 - 40) * (Math.PI / 180);
            const speedX = Math.cos(angle) * -350; 
            const speedY = Math.sin(angle) * 350;
            
            const projectilePosition = {
                x: enemy.position.x + Math.random() * 20, 
                y: enemy.position.y + Math.random() * enemy.height
            };
            
            Projectiles.createDirectional('enemy', projectilePosition, enemy.projectileType, speedX, speedY);
        }
    }
    

    function takeDamage(enemyId, damage) {
        const enemyIndex = enemies.findIndex(e => e.id === enemyId);
        if (enemyIndex === -1) return;
        
        const enemy = enemies[enemyIndex];
        enemy.health -= damage;
        
    
        $('#' + enemy.id).css('opacity', '0.7');
        setTimeout(() => {
            const el = $('#' + enemy.id);
            if (el.length) el.css('opacity', '1');
        }, 100);
    
        if (enemy.health <= 0) {
            defeatedEnemies++;
            
          
            Game.config.score += enemy.points;
            
    
            if (enemy.isBoss) {
                bossDefeated = true;
            }
            
        
            removeEnemy(enemyIndex);
            
  
            if (Math.random() < 0.2) {
                // TODO: Add power-up system
            }
        }
    }
    

    function removeEnemy(index) {
        const enemy = enemies[index];
        $('#' + enemy.id).remove();
        enemies.splice(index, 1);
    }
    
 
    function updateEnemyElement(enemy) {
        $('#' + enemy.id).css({
            left: enemy.position.x + 'px',
            top: enemy.position.y + 'px'
        });
    }
    
 
    function isLevelComplete() {
       
        const allEnemiesDefeated = enemies.length === 0 && defeatedEnemies >= totalEnemiesInLevel;
        

        const levelHasBoss = enemies.some(e => e.isBoss) || bossDefeated;
        
        return allEnemiesDefeated && (!levelHasBoss || bossDefeated);
    }
    
  
    function clear() {
        for (const enemy of enemies) {
            $('#' + enemy.id).remove();
        }
        
        // Reset state
        enemies = [];
        totalEnemiesInLevel = 0;
        defeatedEnemies = 0;
        bossDefeated = false;
    }
    

    function getEnemies() {
        return enemies;
    }
    
  
    return {
        init,
        update,
        create,
        takeDamage,
        isLevelComplete,
        clear,
        getEnemies,
        bossSpreadAttack,
        bossFuryAttack
    };
})();