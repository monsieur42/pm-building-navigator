import { createApp } from 'vue';
import ElementPlus from 'element-plus';

import 'element-plus/dist/index.css';

import App from './App.vue';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import eventBus  from 'js-event-bus';

import createAppStore from './store/store.js';
import createPluginAPI from './pluginAPI/pluginAPI.js';

const appContainers = document.getElementsByClassName('pmbn-app');

window.pmbn = {
	apps: [],
};

_.forEach(appContainers, (appContainer) => {
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
	
	//store.dispatch('loadSVG', '<?xml version="1.0" encoding="utf-8"?> <!-- Generator: Adobe Illustrator 23.0.2, SVG Export Plug-In . SVG Version: 6.00 Build 0)  --> <svg version="1.1" id="Réteg_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"viewBox="0 0 100 100" style="enable-background:new 0 0 100 100;" xml:space="preserve"> <style type="text/css"> .st0{fill:#F9FAF8;stroke:#645C54;stroke-width:0.1;stroke-miterlimit:10;} .st1{fill:#EAE8E6;stroke:#645C54;stroke-width:0.1;stroke-miterlimit:10;} .st2{fill:#D4D0CC;stroke:#645C54;stroke-width:0.1;stroke-miterlimit:10;} .st3{fill:#CAC5C0;stroke:#645C54;stroke-width:0.1;stroke-miterlimit:10;} .st4{fill:#EAE8E5;stroke:#645C54;stroke-width:0.1;stroke-miterlimit:10;} .st5{fill:#D4D0CB;stroke:#645C54;stroke-width:0.1;stroke-miterlimit:10;} .st6{fill:#CAC5C1;stroke:#645C54;stroke-width:0.1;stroke-miterlimit:10;} </style> <g id="level_g_id_floor_0"> <g> <polygon class="st0" points="76,56.2 57.7,66.8 56.2,65.9 49.9,69.6 43.9,66.1 50.2,62.4 48.7,61.6 67,50.9 		"/> </g> <g id="flat_Wohnung_11"> <polygon class="st1" points="67,50.9 48.7,61.6 50.2,62.4 43.9,66.1 46.9,67.9 33.9,75.4 19.2,66.9 31.4,59.7 22.7,54.6 47.9,39.8 		"/> <polygon class="st2" points="33.9,75.4 33.6,86.2 19,77.8 19.2,66.9 		"/> <polygon class="st2" points="9.8,72.5 10.5,61.9 19.2,66.9 19,77.8 		"/> <polygon class="st1" points="19.2,66.9 10.5,61.9 22.7,54.6 31.4,59.7 		"/> </g> <g id="flat_Wohnung_10"> <polygon class="st2" points="48.9,84 48.9,95 33.6,86.2 33.9,75.4 		"/> <polygon class="st3" points="94.7,67.2 95.3,77.8 69.6,92.7 69.7,81.7 		"/> <polygon class="st1" points="94.7,67.2 69.7,81.7 61.2,76.9 48.9,84 33.9,75.4 46.9,67.9 49.9,69.6 56.2,65.9 57.7,66.8 76,56.2 "/> <polygon class="st2" points="57.3,88.9 57.3,99.9 48.9,95 48.9,84 		"/> <polygon class="st3" points="69.7,81.7 69.6,92.7 57.3,99.9 57.3,88.9 		"/> <polygon class="st1" points="57.3,88.9 48.9,84 61.2,76.9 69.7,81.7 		"/> </g> </g> <g id="level_g_id_floor_1"> <g> <polygon class="st0" points="75.8,45.7 57.7,56.1 56.2,55.3 49.9,59 43.9,55.5 50.2,51.8 48.7,51 66.9,40.4 		"/> </g> <g id="flat_Wohnung_13"> <polygon class="st1" points="66.9,40.4 48.7,51 50.2,51.8 43.9,55.5 46.9,57.2 34.3,64.6 19.4,56 31.4,48.9 23.3,44.2 48.6,29.5 "/> <polygon class="st2" points="34.3,64.6 33.9,75.4 19.2,66.9 19.4,56 		"/> <polygon class="st2" points="19.4,56 19.2,66.9 10.5,61.9 11.2,51.3 		"/> <polygon class="st1" points="11.2,51.3 23.3,44.2 31.4,48.9 19.4,56 		"/> </g> <g id="flat_Wohnung_12"> <polygon class="st2" points="48.9,73 48.9,84 33.9,75.4 34.3,64.6 		"/> <polygon class="st3" points="94.1,56.5 94.7,67.2 69.7,81.7 69.7,70.8 		"/> <polygon class="st1" points="94.1,56.5 69.7,70.8 61.2,65.8 48.9,73 34.3,64.6 46.9,57.2 49.9,59 56.2,55.3 57.7,56.1 75.8,45.7 "/> <polygon class="st2" points="48.9,84 48.9,73 57.4,77.9 57.3,88.9 		"/> <polygon class="st3" points="69.7,81.7 69.7,70.8 57.4,77.9 57.3,88.9 		"/> <polygon class="st1" points="57.4,77.9 48.9,73 61.2,65.8 69.7,70.8 		"/> </g> </g> <g id="level_g_id_floor_2"> <g> <polygon class="st0" points="75.5,35.2 57.8,45.5 56.3,44.7 50,48.4 43.9,44.9 50.3,41.2 48.8,40.3 66.6,30 		"/> </g> <g id="flat_Wohnung_15"> <polygon class="st1" points="66.6,30 48.8,40.3 50.3,41.2 43.9,44.9 46.9,46.6 34.6,53.8 19.6,45.1 31.4,38.1 23.8,33.7 48.6,19.3 		"/> <polygon class="st2" points="34.6,53.8 34.3,64.6 19.4,56 19.6,45.1 		"/> <polygon class="st2" points="19.4,56 11.2,51.3 11.9,40.6 19.6,45.1 		"/> <polygon class="st1" points="11.9,40.6 19.6,45.1 31.4,38.1 23.8,33.7 		"/> </g> <g id="flat_Wohnung_14"> <polygon class="st2" points="48.9,62 48.9,73 34.3,64.6 34.6,53.8 		"/> <polygon class="st3" points="93.5,45.9 94.1,56.5 69.7,70.8 69.7,59.8 		"/> <polygon class="st1" points="93.5,45.9 69.7,59.8 61.2,54.9 48.9,62 34.6,53.8 46.9,46.6 50,48.4 56.3,44.7 57.8,45.5 75.5,35.2 "/> <polygon class="st2" points="48.9,73 48.9,62 57.4,66.9 57.4,77.9 		"/> <polygon class="st3" points="69.7,70.8 69.7,59.8 57.4,66.9 57.4,77.9 		"/> <polygon class="st1" points="57.4,66.9 48.9,62 61.2,54.9 69.7,59.8 		"/> </g> </g> <g id="level_g_id_floor_3"> <g> <polygon class="st0" points="75.2,24.8 57.8,34.9 56.3,34 50,37.7 44,34.3 50.3,30.6 48.8,29.7 66.4,19.5 		"/> </g> <g id="flat_Wohnung_17"> <polygon class="st1" points="66.4,19.5 48.8,29.7 50.3,30.6 44,34.3 47,36 35,43 19.8,34.2 31.4,27.3 24.2,23.2 48.7,9 		"/> <polygon class="st2" points="35,43 34.6,53.8 19.6,45.1 19.8,34.2 		"/> <polygon class="st2" points="11.9,40.6 12.5,30 19.8,34.2 19.6,45.1 		"/> <polygon class="st1" points="12.5,30 19.8,34.2 31.4,27.3 24.2,23.2 		"/> </g> <g id="flat_Wohnung_16"> <polygon class="st2" points="48.9,51 48.9,62 34.6,53.8 35,43 		"/> <polygon class="st3" points="92.9,35.3 93.5,45.9 69.7,59.8 69.7,48.8 		"/> <polygon class="st1" points="92.9,35.3 69.7,48.8 61.1,43.9 48.9,51 35,43 47,36 50,37.7 56.3,34 57.8,34.9 75.2,24.8 		"/> <polygon class="st2" points="48.9,51 48.9,62 57.4,66.9 57.4,55.9 		"/> <polygon class="st3" points="57.4,66.9 69.7,59.8 69.7,48.8 57.4,55.9 		"/> <polygon class="st1" points="57.4,55.9 48.9,51 61.1,43.9 69.7,48.8 		"/> </g> </g> <g id="level_g_id_floor_4"> <g> <polygon class="st0" points="75,14.3 57.8,24.3 56.3,23.4 50,27.1 47,25.4 44,23.6 50.3,20 48.8,19.1 66,9.1 		"/> </g> <g id="flat_Wohnung_19"> <polygon class="st1" points="46.8,5.2 42.1,8 38.8,6.7 43.6,4 		"/> <polygon class="st2" points="42.1,8 42.1,16.6 38.8,14.7 38.8,6.7 		"/> <polygon class="st1" points="35.1,12 30.4,14.8 27.1,13.5 31.8,10.8 		"/> <polygon class="st2" points="30.4,14.8 30.4,23.4 27.1,21.5 27.1,13.5 		"/> <polygon class="st2" points="18.7,21.6 18.6,30.2 15.4,28.4 15.4,20.3 		"/> <polygon class="st1" points="24.4,18.3 18.7,21.6 15.4,20.3 21.1,17 		"/> <polygon class="st1" points="66,9.1 48.8,19.1 50.3,20 44,23.6 47,25.4 35.3,32.5 20,23.7 31.4,16.9 27.4,14.6 51.3,0.6 		"/> <polygon class="st2" points="35.3,32.5 35,43 12.5,30 15.8,21.3 		"/> <polygon class="st2" points="12.5,30 19.8,34.2 20,23.7 15.8,21.3 		"/> <polygon class="st1" points="20,23.7 15.8,21.3 27.4,14.6 31.4,16.9 		"/> </g> <g id="flat_Wohnung_18"> <polygon class="st1" points="89.7,22.8 66.4,36.3 61.1,33.2 48.9,40.3 35.3,32.5 47,25.4 50,27.1 56.3,23.4 57.8,24.3 75,14.3 "/> <polygon class="st2" points="48.9,40.3 48.9,51 35,43 35.3,32.5 		"/> <polygon class="st2" points="48.9,51 48.9,40.3 54.2,43.4 57.4,55.9 		"/> <polygon class="st3" points="69.7,48.8 92.9,35.3 89.7,22.8 66.4,36.3 		"/> <polygon class="st1" points="88.4,29.9 83.7,32.6 81,30.4 85.8,27.7 		"/> <polygon class="st3" points="88.4,29.9 88.4,37.9 83.7,40.7 83.7,32.6 		"/> <polygon class="st2" points="83.7,32.6 83.7,40.7 81,30.4 		"/> <polygon class="st1" points="76.7,36.7 72,39.4 69.3,37.2 74,34.5 		"/> <polygon class="st2" points="72,39.4 72,47.5 69.3,37.2 		"/> <polygon class="st3" points="76.7,36.7 76.7,44.7 72,47.5 72,39.4 		"/> <polygon class="st3" points="54.2,43.4 66.4,36.3 69.7,48.8 57.4,55.9 		"/> <polygon class="st1" points="66,42.9 60.3,46.2 57.6,44.1 63.3,40.7 		"/> <polygon class="st2" points="60.3,46.2 60.3,54.3 57.6,44.1 		"/> <polygon class="st3" points="66,42.9 66,51 60.3,54.3 60.3,46.2 		"/> <polygon class="st1" points="54.2,43.4 48.9,40.3 61.1,33.2 66.4,36.3 		"/> </g> </g> <g id="level_g_id_floor_5"> <polygon class="st4" points="16.1,20.6 51.6,0 89.4,21.9 54,42.5 	"/> <polygon class="st5" points="16.1,20.6 15.8,21.3 54.2,43.4 54,42.5 	"/> <polygon class="st6" points="89.7,22.8 89.4,21.9 54,42.5 54.2,43.4 	"/> </g> </svg>');
});

const event = new Event('pmbn_init');
window.dispatchEvent(event);