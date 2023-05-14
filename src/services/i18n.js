import _ from 'lodash';
const defaults =  {
	data: {locale: 'en-US'},
	translations: [],
};
let options = {};

export function i18n(def, context = null){
	let translated = options.translations.find((item) => {
		if(context === null){
			return item.default === def;
		}
		else {
			return item.default === def && item.context === context;
		}
	});

	return (translated)? translated.translation : def;
}

export default {
	install: (app) => {
		options = _.merge(defaults, window.pmbn.i18n);
		
		app.config.globalProperties.$i18nData = options.data;
		app.config.globalProperties.$i18n = i18n;
	}
}