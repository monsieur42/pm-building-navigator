import { createApp } from 'vue';
import ElementPlus from 'element-plus';

import 'element-plus/dist/index.css';

import App from './App.vue';
import _ from 'lodash';
var lodash = _.noConflict();

import { v4 as uuidv4 } from 'uuid';
import eventBus  from 'js-event-bus';

import createAppStore from './store/store.js';
import createPluginAPI from './services/pluginAPI.js';
import i18n from './services/i18n.js';

const appContainers = document.getElementsByClassName('pmbn-app');

window.pmbn = {
	apps: [],
	i18n: {
		data: {locale: 'en-US'},
		translations: [],
	},
};
const event_pmbn_before_init = new Event('pmbn_before_init');
window.dispatchEvent(event_pmbn_before_init);

lodash.forEach(appContainers, (appContainer) => {
	const store = createAppStore();
	const pluginAPI = createPluginAPI();

	const appEventBus = eventBus();
	const appID = (appContainer.getAttribute('data-id'))? appContainer.getAttribute('data-id') : uuidv4()
	
	createApp(App)
		.use(store)
		.use(pluginAPI, {
			id: appID,
			eventBus: appEventBus,
		})
		.use(i18n, window.pmbn.i18n)
		.use(ElementPlus)
		.mount(appContainer);

	window.pmbn.apps.push({
		id: appID,
		el: appContainer,
		eventBus: appEventBus,
		loadConfig: (config) => {
			store.dispatch('loadConfig', config);
		},
	});
});

const event_pmbn_init = new Event('pmbn_init');
window.dispatchEvent(event_pmbn_init);