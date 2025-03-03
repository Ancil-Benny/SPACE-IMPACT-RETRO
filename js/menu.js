const Menu = (function() {
    // Initialize menu components
    function init() {
        // Set up button click events
        setupEventListeners();
    }
    
    // Set up event listeners for menu buttons
    function setupEventListeners() {
        // Start button
        $('#start-button').on('click', function() {
            Game.start();
        });
        
        // Options button
        $('#options-button').on('click', function() {
            showOptionsMenu();
        });
        
        // High scores button
        $('#high-scores-button').on('click', function() {
            showHighScores();
        });
        
        // Resume button (in pause menu)
        $('#resume-button').on('click', function() {
            Game.resume();
        });
        
        // Quit button (in pause menu)
        $('#quit-button').on('click', function() {
            quitGame();
        });
        
        // Play again button (in game over screen)
        $('#play-again-button').on('click', function() {
            Game.start();
        });
        
        // Back to menu button (in game over screen)
        $('#back-to-menu-button').on('click', function() {
            showMainMenu();
        });
    }
    
    // Show options menu
    function showOptionsMenu() {
        // This would be implemented with a new screen
        // For now, we'll just show an alert
        alert('Options menu not implemented yet');
    }
    
    // Show high scores
    function showHighScores() {
        // This would be implemented with a new screen
        // For now, we'll just show an alert
        alert('High scores not implemented yet');
    }
    
    // Quit current game and return to main menu
    function quitGame() {
        // Stop game loop
        Game.gameOver(false);
        
        // Show main menu
        showMainMenu();
    }
    
    // Show main menu
    function showMainMenu() {
        // Hide all screens
        $('.screen').addClass('hidden');
        
        // Show start screen
        $('#start-screen').removeClass('hidden');
    }
    
    // Expose public methods
    return {
        init,
        showMainMenu
    };
})();