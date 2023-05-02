export default {
	install: (app, options) => {
		app.config.globalProperties.$i18nData = options.data;
		app.config.globalProperties.$i18n = (def, context = null) => {

			let translated = options.translations.find((item) => {
				if(context === null){
					return item.default === def;
				}
				else {
					return item.default === def && item.context === context;
				}
			});

			return (translated)? translated.translation : def;
		};
	}
};