const Collision = (function() {
    // Initialize collision system
    function init() {

    }
    
    function checkCollisions() {
        const playerBox = Player.getBoundingBox();
        const enemies = Enemies.getEnemies();
        const projectiles = Projectiles.getProjectiles();
        
  
        for (let i = 0; i < projectiles.length; i++) {
            const projectile = projectiles[i];
            
  
            if (projectile.source !== 'player') continue;
            
            const projectileBox = {
                x: projectile.position.x,
                y: projectile.position.y,
                width: projectile.width,
                height: projectile.height
            };
  
            for (let j = 0; j < enemies.length; j++) {
                const enemy = enemies[j];
                const enemyBox = {
                    x: enemy.position.x,
                    y: enemy.position.y,
                    width: enemy.width,
                    height: enemy.height
                };
                
                if (checkBoxCollision(projectileBox, enemyBox)) {
                    Enemies.takeDamage(enemy.id, projectile.damage);
                    Projectiles.removeProjectile(i);
                    break; 
                }
            }
        }
        

        for (let i = 0; i < projectiles.length; i++) {
            const projectile = projectiles[i];
            
            // Skip player projectiles
            if (projectile.source !== 'enemy') continue;
            
            const projectileBox = {
                x: projectile.position.x,
                y: projectile.position.y,
                width: projectile.width,
                height: projectile.height
            };
            
            if (checkBoxCollision(projectileBox, playerBox)) {
                // Collision between enemy projectile and player
                Player.takeDamage(projectile.damage);
                Projectiles.removeProjectile(i);
            }
        }
        
        // Check direct collisions between player and enemies
        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
            const enemyBox = {
                x: enemy.position.x,
                y: enemy.position.y,
                width: enemy.width,
                height: enemy.height
            };
            
            if (checkBoxCollision(playerBox, enemyBox)) {
                // Direct collision between player and enemy
                Player.takeDamage(20); // Direct hits cause more damage
                Enemies.takeDamage(enemy.id, 30); // Damage to enemy from collision
            }
        }
    }
    
    // Check collision between two boxes
    function checkBoxCollision(box1, box2) {
        return (
            box1.x < box2.x + box2.width &&
            box1.x + box1.width > box2.x &&
            box1.y < box2.y + box2.height &&
            box1.y + box1.height > box2.y
        );
    }
    
    // Expose public methods
    return {
        init,
        checkCollisions
    };
})();