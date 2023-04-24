import { createStore } from 'vuex';
import _ from 'lodash';
import $ from 'jquery';

export default function createAppStore() {
  return createStore({
	state: {
		mode: 'editor',
		building: {
			floors: [],
			additionalSVG: [],
			levelSpacing: 38,
			viewbox: [0,0,100,100],
		},
		editor: {
			activeTab: 'general',
			activeFloor: 0,
			selectedGroup: null,
		},
	},
	mutations: {
		loadBuilding(state, building){
			state.building = building;
		},
		loadEditor(state, editorState){
			state.editor = editorState;
		},


		setActiveFloor(state, index){
			state.editor.activeFloor = index;
		},


		selectGroup(state, payload){
			state.editor.selectedGroup = payload;
		},


		setActiveTab(state, tabName){
			state.editor.activeTab = tabName;
		},
	},
	actions: {
		loadConfig(context, config){
			context.dispatch('loadSVG', config.config.svg);
			context.dispatch('loadEditor', {
				activeFloor: context.state.building.floors.length - 1,
			});
		},
		loadSVG(context, svg){
			let $svg = $(svg).filter('svg').first();

			let viewbox = (typeof $svg.attr('viewBox') !== 'undefined')? $svg.attr('viewBox').split(' ') : [0,0,100,100];
			viewbox = _.map(viewbox, parseFloat);

			let building = {
				floors: [],
				additionalSVG: [],
				levelSpacing: 38,
				viewbox: viewbox,
			};

			if($svg.length > 0){
				//loop floors
				$svg.children().each((fi, el) => {
					if($(el).is('g')){
						let floor = {
							name: (typeof $(el).attr('id') !== 'undefined')? $(el).attr('id') : 'Floor ' + fi,
							apartments: [],
							groups: [],
							opened: false,
							active: false,
						};

						//loop apartments
						$(el).children().each((ai, apartment_element) => {
							let group = {
								name: (typeof $(apartment_element).attr('id') !== 'undefined')? $(apartment_element).attr('id') : 'Apartment ' + ai +' / '+ fi,
								svg: $(apartment_element).prop('outerHTML'),
								selected: false,
							};

							floor.groups.push(group);
						});

						building.floors.push(floor);
					}
					else {
						building.additionalSVG.push($(el).prop('outerHTML'));
					}
					
				});
			}

			context.commit('loadBuilding', building);
		},
		loadEditor(context, editorState){
			context.commit('loadEditor', _.merge(context.state.editor, editorState));
		},


		setActiveFloor(context, index){
			context.commit('setActiveFloor', index);
		},


		selectGroup(context, payload){
			context.commit('selectGroup', payload);
		},


		setActiveTab(context, tabName){
			context.commit('setActiveTab', tabName);
		},
	},
	getters: {
		building(state){
			return state.building;
		},
		additionalSVG(state){
			return (state.building)? state.building.additionalSVG : [];
		},
		levelSpacing(state){
			return (state.building)? state.building.levelSpacing : 0;
		},
		viewbox(state){
			return (state.building)? state.building.viewbox : [0,0,100,100];
		},


		floors(state){
			return (state.building)? state.building.floors : [];
		},
		floor(state){
			return (index) => {
				return (state.building)? _.find(state.building.floors, (f, i) => i === index) : null;
			};
		},
		isOpenedFloor(state){
			return (index) => {
				return index > state.editor.activeFloor;
			};
		},
		activeFloor(state){
			return (state.building)? _.find(state.building.floors, (f, i) => i === state.editor.activeFloor) : null;
		},


		group(state, getters){
			return (floor_index, index) => {
				const floor =  getters['floor'](floor_index);
				return (floor)? _.find(floor.groups, (g, i) => i === index) :  null;
			};
		},
		selectedGroup(state, getters){
			return (state.editor.selectedGroup)? getters['group'](state.editor.selectedGroup.floor, state.editor.selectedGroup.group) : null;
		},

		activeTab(state){
			return (state.editor)? state.editor.activeTab : 'general';
		},
	}
  });
}