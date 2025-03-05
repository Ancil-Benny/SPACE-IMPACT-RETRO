const Projectiles = (function() {
    const projectileTypes = {
        'player-basic': {
            width: 16,
            height: 4,
            speed: 400,
            damage: 10,
            color: '#00ffff',
            glow: true
        },
        'player-laser': {
            width: 24,
            height: 4,
            speed: 500,
            damage: 15,
            color: '#ff00ff',
            glow: true
        },
        'player-missile': {
            width: 20,
            height: 8,
            speed: 350,
            damage: 25,
            color: '#ff5500',
            glow: true,
            trailEffect: true
        },
        'enemy-basic': {
            width: 12,
            height: 4,
            speed: -300,
            damage: 5,
            color: '#ff0000' 
        },
        'enemy-bomber': {
            width: 14,
            height: 8,
            speed: -250,
            damage: 10,
            color: '#ff3300', 
            glow: true
        },
        'enemy-scout': {
            width: 10,
            height: 3,
            speed: -350,
            damage: 3,
            color: '#ffff00' 
        },
        'enemy-boss': {
            width: 20,
            height: 10,
            speed: -300,
            damage: 15,
            color: '#ff0000', 
            glow: true,
            pulseEffect: true
        }
    };
    

    let projectiles = [];
    
    function init() {
        projectiles = [];
    }
    

    function update(deltaTime) {
        const gameArea = $('#game-area');
        const areaWidth = gameArea.width();
        const areaHeight = gameArea.height();
        
        for (let i = projectiles.length - 1; i >= 0; i--) {
            const projectile = projectiles[i];
            

            projectile.position.x += projectile.speed * deltaTime;
            

            if (projectile.pulseEffect) {
                projectile.effectTime = (projectile.effectTime || 0) + deltaTime;
                const opacity = 0.7 + 0.3 * Math.sin(projectile.effectTime * 10);
                $('#' + projectile.id).css('opacity', opacity);
            }
            
   
            if (projectile.trailEffect && Math.random() > 0.7) {
                createTrailParticle(projectile);
            }
            
   
            if (projectile.position.x > areaWidth || 
                projectile.position.x < -projectile.width || 
                projectile.position.y < -projectile.height || 
                projectile.position.y > areaHeight) {
                removeProjectile(i);
                continue;
            }
            
     
            updateProjectileElement(projectile);
        }
    }
    

    function create(source, position, type = 'player-basic') {
        const projectileConfig = projectileTypes[type] || projectileTypes['player-basic'];
        
        const projectile = {
            id: 'projectile-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
            source: source, // 'player' or 'enemy'
            position: { ...position },
            width: projectileConfig.width,
            height: projectileConfig.height,
            speed: projectileConfig.speed,
            damage: projectileConfig.damage,
            color: projectileConfig.color,
            glow: projectileConfig.glow || false,
            pulseEffect: projectileConfig.pulseEffect || false,
            trailEffect: projectileConfig.trailEffect || false
        };
        

        const projectileElement = $('<div>')
            .addClass('projectile')
            .attr('id', projectile.id)
            .css({
                width: projectile.width + 'px',
                height: projectile.height + 'px',
                left: projectile.position.x + 'px',
                top: projectile.position.y + 'px',
                backgroundColor: projectile.color,
                borderRadius: projectile.height / 2 + 'px',
                position: 'absolute'
            });
            

        if (projectile.glow) {
            projectileElement.css('box-shadow', `0 0 5px 2px ${projectile.color}`);
        }
        
   
        if (type === 'player-missile') {
            projectileElement.css({
                borderRadius: '50%',
                transform: 'rotate(45deg)'
            });
        }
        
        $('#game-area').append(projectileElement);
        projectiles.push(projectile);
        
        return projectile;
    }
    

    function removeProjectile(index) {
        const projectile = projectiles[index];
        $('#' + projectile.id).remove();
        projectiles.splice(index, 1);
    }
    
  
    function updateProjectileElement(projectile) {
        $('#' + projectile.id).css({
            left: projectile.position.x + 'px',
            top: projectile.position.y + 'px'
        });
    }
    
 
    function clear() {
        for (const projectile of projectiles) {
            $('#' + projectile.id).remove();
        }
 
        projectiles = [];
    }
    

    function getProjectiles() {
        return projectiles;
    }
    

    function createTrailParticle(projectile) {
        const trailParticle = $('<div>')
            .addClass('trail-particle')
            .css({
                width: '4px',
                height: '4px',
                left: projectile.position.x + 'px',
                top: projectile.position.y + projectile.height / 2 + 'px',
                backgroundColor: projectile.color,
                borderRadius: '50%',
                position: 'absolute',
                opacity: 0.5
            });
        
        $('#game-area').append(trailParticle);
    
        trailParticle.animate({ opacity: 0 }, 500, function() {
            $(this).remove();
        });
    }
    

    return {
        init,
        update,
        create,
        clear,
        removeProjectile,
        getProjectiles
    };
})();