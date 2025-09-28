/**
 * Custom implementation of the EventTarget class, designed to manage
 * event listeners and dispatch custom events.
 */
class EventTarget {
    // Private property to store listeners.
    // The structure is: {eventName: Set<Function>}
    #listeners = new Map();

    /**
     * Registers a callback function to be executed when a specific event is dispatched.
     * Duplicate eventName/callback pairs are ignored.
     *
     * @param {string} eventName The name of the event to listen for.
     * @param {Function} callback The function to call when the event occurs.
     */
    addEventListener(eventName, callback) {
        // 1. Get the set of callbacks for this event, or create a new Set if none exist.
        let callbacks = this.#listeners.get(eventName);
        
        if (!callbacks) {
            callbacks = new Set();
            this.#listeners.set(eventName, callbacks);
        }
        
        // 2. Add the callback to the Set. Sets automatically prevent duplicates.
        callbacks.add(callback);
    }

    /**
     * Removes a specific event listener previously registered with addEventListener.
     * Has no effect if the specified listener was not found.
     *
     * @param {string} eventName The name of the event.
     * @param {Function} callback The specific function to remove.
     */
    removeEventListener(eventName, callback) {
        const callbacks = this.#listeners.get(eventName);

        if (callbacks) {
            // 1. Attempt to delete the callback from the Set.
            callbacks.delete(callback);

            // 2. Clean up: if the Set is now empty, remove the event entry from the Map.
            if (callbacks.size === 0) {
                this.#listeners.delete(eventName);
            }
        }
    }

    /**
     * Dispatches an event by synchronously calling all registered listeners
     * for the given event name.
     *
     * @param {string} eventName The name of the event to dispatch.
     */
    dispatchEvent(eventName) {
        const callbacks = this.#listeners.get(eventName);

        if (callbacks) {
            // Iterate over a copy of the callbacks Set to safely handle
            // potential removal of listeners during dispatch.
            [...callbacks].forEach(callback => {
                // Invoke the function. For simplicity, we call it without event object arguments.
                callback();
            });
        }
    }
}

// --- Sample Usage ---

const target = new EventTarget();

const logHello = () => console.log('hello');
const logWorld = () => console.log('world');

console.log("--- Initial Registration and Dispatch ---");
target.addEventListener('hello', logHello);
target.addEventListener('world', logWorld);
target.addEventListener('world', () => console.log('world again!')); // Add a second world listener
target.addEventListener('hello', logHello); // Attempt to add duplicate (should be ignored)

target.dispatchEvent('hello');
target.dispatchEvent('world');

console.log("\n--- Removing Listener and Re-dispatching ---");
target.removeEventListener('hello', logHello); // Remove the 'hello' listener

target.dispatchEvent('hello'); // Should do nothing
target.dispatchEvent('world'); // The two 'world' listeners should still fire
