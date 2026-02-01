import { Plugin } from 'obsidian';

export default class EmacsNavigationPlugin extends Plugin {
	async onload() {
		// Register a global keydown event listener
		this.registerDomEvent(document, 'keydown', (evt: KeyboardEvent) => {
			// Check if Ctrl (or Cmd on Mac) is pressed along with N or P
			const isCtrl = evt.ctrlKey || evt.metaKey; // Support Cmd+N/P on Mac if desired

			if (!isCtrl) return;
			if (evt.key !== 'n' && evt.key !== 'p') return;
			// Check if a suggestion modal is open
			// The '.suggestion-container' class is present in Command Palette, Quick Switcher, etc.
			const suggestionContainer = document.querySelector('.suggestion-container');

			// If the container doesn't exist or isn't visible, do nothing (let default behavior happen)
			if (!suggestionContainer || !suggestionContainer.isConnected) {
				return;
			}

			// Prevent the default action (e.g., creating a new note)
			evt.preventDefault();
			evt.stopPropagation();

			// Determine which key to simulate
			const keyToSimulate = evt.key === 'n' ? 'ArrowDown' : 'ArrowUp';

			console.log(keyToSimulate);

			// Create a synthetic keyboard event
			const arrowEvent = new KeyboardEvent('keydown', {
				key: keyToSimulate,
				code: keyToSimulate,
				bubbles: true,
				cancelable: true,
				ctrlKey: false,
				metaKey: false,
				shiftKey: false,
				altKey: false
			});

			// Dispatch the event to the currently focused element (usually the input box of the modal)
			document.activeElement?.dispatchEvent(arrowEvent);
		});
	}

	onunload() {
		// cleanup is handled automatically by registerDomEvent
	}
}
