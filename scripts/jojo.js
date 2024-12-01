/**
 * jojo.js - Main script for the JoJo System
 * Author: Cicciofc
 */

// Hook to initialize the system
Hooks.once('init', () => {
    console.log('JoJo System | Initializing the JoJo System');

    // Define custom settings or sheet classes here
    CONFIG.JojoSystem = {
        attributes: ["hp", "standPower", "resolve", "speed"]
    };

    // Example: Set up custom dice rolling logic
    game.jojo = {
        rollAttribute: (attribute) => {
            const roll = new Roll('1d20 + @value', { value: CONFIG.JojoSystem.attributes[attribute] || 0 });
            roll.roll({ async: false });
            roll.toMessage({
                flavor: `Rolling for ${attribute}!`,
                speaker: ChatMessage.getSpeaker(),
            });
        }
    };
});

// Hook to handle system readiness
Hooks.once('ready', () => {
    console.log('JoJo System | System is ready for use!');
});
