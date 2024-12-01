class JoJoActor extends Actor {
    /** @override */
    prepareData() {
        super.prepareData();

        // Initialize default data for the actor
        const data = this.system; // System data is stored here
        data.attributes = data.attributes || {};

        // Add default values if they don't exist
        data.attributes.standPower = data.attributes.standPower ?? 5;
        data.attributes.resolve = data.attributes.resolve ?? 3;
        data.attributes.speed = data.attributes.speed ?? 2;
    }
}

// Register the custom actor class
CONFIG.Actor.documentClass = JoJoActor;
