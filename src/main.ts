import { Plugin } from "obsidian";

const blacklist = [
	'omnisearch-modal'
]

function isVisible(el: HTMLElement): boolean {
	if (!el.isConnected) return false;
	const style = window.getComputedStyle(el);
	if (style.display === "none") return false;
	if (style.visibility === "hidden") return false;
	if (Number(style.opacity) === 0) return false;
	const rect = el.getBoundingClientRect();
	return rect.width > 0 && rect.height > 0;
}

function getActiveSuggestionContainer(blacklist: Array<string> = []): HTMLElement | null {
	const container = document.querySelector<HTMLElement>(".prompt");
	if (!container) return null;
	if (!isVisible(container)) return null;
	console.log(blacklist);
	console.log(container.className);
	const classNames = container.className.split(" ");
	for (const className of classNames) {
		if (blacklist.includes(className)) {
			console.log("blacklisted: ", className);
			return null;
		}
	}
	return container;
}

function dispatchArrowKey(key: "ArrowDown" | "ArrowUp"): void {
	const code = key;
	const evt = new KeyboardEvent("keydown", {
		key,
		code,
		bubbles: true,
		cancelable: true,
	});

	window.dispatchEvent(evt);
}

export default class VimEmacsNavigationPlugin extends Plugin {
	async onload() {
		// Use capture phase: built-in modals frequently stop propagation.
		this.registerDomEvent(
			window,
			"keydown",
			(evt: KeyboardEvent) => {
				if (!evt.ctrlKey) return;
				if (evt.altKey || evt.metaKey || evt.shiftKey) return;

				const downKeys = ['n', 'j'];
				const upKeys = ['p', 'k'];

				const container = getActiveSuggestionContainer(blacklist);
				if (!container) return;
				console.log('why am I here?')

				const key = evt.key.toLowerCase();

				if (upKeys.contains(key)) {
					evt.preventDefault();
					evt.stopPropagation();
					if (typeof evt.stopImmediatePropagation === "function") {
						evt.stopImmediatePropagation();
					}
					dispatchArrowKey("ArrowUp");
				} else if (downKeys.contains(key)) {
					evt.preventDefault();
					evt.stopPropagation();
					if (typeof evt.stopImmediatePropagation === "function") {
						evt.stopImmediatePropagation();
					}
					dispatchArrowKey("ArrowDown");
				} else {
					return;
				}
			},
		);
	}
}
