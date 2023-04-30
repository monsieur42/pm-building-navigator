export default function createPluginAPI() {
	return {
		install: (app, options) => {
			app.config.globalProperties.$eventBus = options.eventBus;
			app.config.globalProperties.$appID = options.id;
		}
	};
}