const HUD = (function() {
    // Initialize HUD
    function init() {
        // Set initial values
        updateScore(0);
        updateHealth(100);
        updateWeapon('Basic');
        updateLevel(1);
    }
    
    // Update all HUD elements
    function update() {
        updateScore(Game.config.score);
        updateHealth(Player.config.health);
        updateWeapon(Player.config.currentWeapon);
        updateLevel(Game.config.currentLevel);
    }
    
    // Update score display
    function updateScore(score) {
        $('#score span').text(score);
    }
    
    // Update health display
    function updateHealth(health) {
        $('#health span').text(health);
        
        // Change color based on health
        if (health <= 25) {
            $('#health').css('color', '#f00'); // Red for low health
        } else if (health <= 50) {
            $('#health').css('color', '#ff0'); // Yellow for medium health
        } else {
            $('#health').css('color', '#0f0'); // Green for good health
        }
    }
    
    // Update weapon display
    function updateWeapon(weapon) {
        // Capitalize first letter
        const displayWeapon = weapon.charAt(0).toUpperCase() + weapon.slice(1);
        $('#weapon span').text(displayWeapon);
    }
    
    // Update level display
    function updateLevel(level) {
        $('#level span').text(level);
    }
    
    // Expose public methods
    return {
        init,
        update,
        updateScore,
        updateHealth,
        updateWeapon,
        updateLevel
    };
})();