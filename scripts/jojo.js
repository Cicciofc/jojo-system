/**
 * jojo.js - Main JavaScript file for the JoJo System
 * Author: Cicciofc
 */

// Define the custom actor class
class JoJoActor extends Actor {
    /**
     * Prepare the actor's data.
     * This runs automatically and ensures the actor has the expected attributes.
     */
    prepareData() {
        super.prepareData();

        const data = this.system;

        // Initialize attributes if they don't exist
        data.attributes = data.attributes || {};
        data.attributes.standPower = data.attributes.standPower ?? 5;
        data.attributes.resolve = data.attributes.resolve ?? 3;
        data.attributes.speed = data.attributes.speed ?? 2;

        // Initialize resources (health, power) if they don't exist
        data.health = data.health || { value: 20, max: 20 };
        data.power = data.power || { value: 10, max: 10 };
    }
}

// Define the custom actor sheet class
class JoJoActorSheet extends ActorSheet {
    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["jojo", "sheet", "actor"],
            template: "systems/jojo-system/templates/actor-sheet.html",
            width: 600,
            height: 400,
            tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
        });
    }

    /** @override */
    getData() {
        const data = super.getData();

        // Additional processing can be added here if needed
        return data;
    }

    /** @override */
    activateListeners(html) {
        super.activateListeners(html);

        // Handle roll buttons
        html.find(".roll-button").click((event) => {
            const attribute = event.currentTarget.dataset.attribute;
            game.jojo.rollAttribute(attribute, this.actor.id);
        });

        // Handle inventory actions (create, edit, delete)
        html.find(".item-create").click(this._onItemCreate.bind(this));
        html.find(".item-control").click((event) => {
            const action = event.currentTarget.dataset.action;
            const itemId = event.currentTarget.closest(".item").dataset.itemId;
            if (action === "edit") this._onItemEdit(itemId);
            if (action === "delete") this._onItemDelete(itemId);
        });
    }

    /** Create a new item */
    async _onItemCreate(event) {
        event.preventDefault();
        const itemData = {
            name: "New Item",
            type: "item",
            data: {}
        };
        await this.actor.createEmbeddedDocuments("Item", [itemData]);
    }

    /** Edit an existing item */
    _onItemEdit(itemId) {
        const item = this.actor.items.get(itemId);
        item.sheet.render(true);
    }

    /** Delete an existing item */
    async _onItemDelete(itemId) {
        await this.actor.deleteEmbeddedDocuments("Item", [itemId]);
    }
}

// Register the custom actor sheet
Actors.registerSheet("jojo-system", JoJoActorSheet, { makeDefault: true });
CONFIG.Actor.documentClass = JoJoActor;

// Add global game-level functions for rolls
Hooks.once("init", () => {
    console.log("JoJo System | Initializing the JoJo System");

    // Add a global object for utility functions
    game.jojo = {
        /**
         * Roll an attribute for a given actor.
         * @param {string} attribute - The attribute to roll (e.g., "standPower").
         * @param {string} actorId - The ID of the actor performing the roll.
         */
        rollAttribute: (attribute, actorId) => {
            const actor = game.actors.get(actorId);
            if (!actor) {
                ui.notifications.error("Actor not found!");
                return;
            }

            const value = actor.system.attributes[attribute] || 0;
            const roll = new Roll("1d20 + @value", { value });
            roll.roll({ async: false });
            roll.toMessage({
                flavor: `Rolling for ${attribute}!`,
                speaker: ChatMessage.getSpeaker({ actor }),
            });
        }
    };
});

// Log when the system is ready
Hooks.once("ready", () => {
    console.log("JoJo System | System is ready for use!");
});
