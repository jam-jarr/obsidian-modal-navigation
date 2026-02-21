import { App, PluginSettingTab as ObsidianSettingTab, Setting } from "obsidian";

export interface PluginSettings {
	blacklist: string[];
}

export const DEFAULT_SETTINGS: PluginSettings = {
	blacklist: ["omnisearch-modal"],
};

export class VimModalNavigationSettingTab extends ObsidianSettingTab {
	plugin: import("./main").default;

	constructor(app: App, plugin: import("./main").default) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Modal Blacklist")
			.setDesc(
				"Comma-separated list of modal class names to disable navigation keys. Example: omnisearch-modal, another-modal. Hint: Use dev tools in obsidian to identify class name of modal",
			)
			.addText((text) => {
				text.setValue(this.plugin.settings.blacklist.join(", "));
				text.setPlaceholder("modal-classname");
				text.onChange(async (value) => {
					const blacklist = value
						.split(",")
						.map((s) => s.trim())
						.filter((s) => s.length > 0);
					this.plugin.settings.blacklist = blacklist;
					await this.plugin.saveSettings();
				});
			});
	}
}

