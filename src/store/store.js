import { createStore } from 'vuex';
import { toRaw } from 'vue';
import _ from 'lodash';
import $ from 'jquery';

export default function createAppStore() {
	return createStore({
		state: {
			loaded: false,
			mode: 'editor',
			building: {
				floors: [],
				additionalSVG: [],
				levelSpacing: 38,
				spaceAbove: 0,
				viewbox: [0,0,100,100],
			},
			editor: {
				activeTab: 'general',
				activeFloor: 0,
				selectedGroup: null,
			},
		},
		mutations: {
			setLoaded(state){
				state.loaded = true;
			},
			loadBuilding(state, building){
				state.building = building;
			},
			loadEditor(state, editorState){
				state.editor = editorState;
			},
			setMode(state, mode){
				state.mode = mode;
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
			setLoaded(context){
				context.commit('setLoaded');
			},
			loadConfig(context, config){
				context.dispatch('loadBuilding', (config.building ?? {}));
				context.dispatch('loadEditor', (config.editor ?? {}));
				context.dispatch('setMode', (config.mode ?? 'view'));

				context.dispatch('setLoaded');
			},
			loadSVG(context, svg){
				let $svg = $(svg).filter('svg').first();

				let viewbox = (typeof $svg.attr('viewBox') !== 'undefined')? $svg.attr('viewBox').split(' ') : [0,0,100,100];
				viewbox = _.map(viewbox, parseFloat);

				let building = {
					floors: [],
					additionalSVG: [],
					levelSpacing: (context.state.building && context.state.building.levelSpacing)? context.state.building.levelSpacing : 38,
					viewbox: viewbox,
				};

				if($svg.length > 0){
					//loop floors
					var floor_counter = 0;
					$svg.children().each((fi, el) => {
						if($(el).is('g')){
							let floor = context.getters['defaultFloor']();
							floor.name = (typeof $(el).attr('id') !== 'undefined')? $(el).attr('id') : 'Floor ' + fi;

							if(context.state.building.floors && context.state.building.floors[floor_counter]){
								floor = _.merge(floor, context.state.building.floors[floor_counter]);
							}

							let floorGroups = [];

							//loop apartments
							$(el).children().each((ai, apartment_element) => {
								let group = context.getters['defaultGroup']();
								group.name = (typeof $(apartment_element).attr('id') !== 'undefined')? $(apartment_element).attr('id') : 'Apartment ' + ai +' / '+ fi;
								
								if(
									context.state.building.floors && 
									context.state.building.floors[floor_counter] &&
									context.state.building.floors[floor_counter].groups[ai]
								){
									group = _.merge(group, context.state.building.floors[floor_counter].groups[ai]);
								}

								group.svg = $(apartment_element).prop('outerHTML');

								floorGroups.push(group);
							});

							floor.groups = floorGroups;
							building.floors.push(floor);

							floor_counter++;
						}
						else {
							building.additionalSVG.push($(el).prop('outerHTML'));
						}
						
					});
				}

				//if previous svg was loaded
				if(context.state.building.floors){
					context.state.building.floors = _.slice(context.state.building.floors, 0, building.floors.length - 1);
				}
				
				if(context.state.building.additionalSVG){
					context.state.building.additionalSVG = [];
				}

				context.dispatch('loadBuilding', building);
				context.dispatch('loadEditor', {
					activeFloor: context.state.building.floors.length - 1,
				});
				context.dispatch('setLoaded');
			},
			loadBuilding(context, buildingState){
				_.forEach(buildingState.floors, (floor, fi) => {
					floor = _.merge(context.getters['defaultFloor'](), floor);

					_.forEach(floor.groups, (group, gi) => {
						floor.groups[gi] = _.merge(context.getters['defaultGroup'](), group);
					});
					buildingState.floors[fi] = floor;
				});

				context.commit('loadBuilding', _.merge(context.state.building, buildingState));
			},
			loadEditor(context, editorState){
				context.commit('loadEditor', _.merge(context.state.editor, editorState));
			},
			setMode(context, mode){
				context.commit('setMode', mode);
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
			loaded(state){
				return state.loaded;
			},
			config(state){
				return {
					building: toRaw(state.building),
					editor: toRaw(state.editor),
				};
			},
			mode(state){
				return state.mode;
			},
			building(state){
				return state.building;
			},
			additionalSVG(state){
				return (state.building)? state.building.additionalSVG : [];
			},
			levelSpacing(state){
				return (state.building)? state.building.levelSpacing : 0;
			},
			spaceAbove(state){
				return (state.building)? state.building.spaceAbove : 0;
			},
			viewbox(state){
				return (state.building)? state.building.viewbox : [0,0,100,100];
			},
			svgLoaded(state){
				let loaded = false;
				_.forEach(state.building.floors, (floor) => {
					if(floor.groups.length > 0){
						loaded = true;
						return false;
					}
				});

				return loaded;
			},

			floors(state){
				return (state.building)? state.building.floors : [];
			},
			floor(state){
				return (index) => {
					return (state.building)? _.find(state.building.floors, (f, i) => i === index) : null;
				};
			},
			defaultFloor(){
				return () => {
					return {
						name: '',
						groups: [],
						opened: false,
						active: false,
						passive: false,
					};
				};
			},
			isOpenedFloor(state, getters){
				return (index) => {
					let activeFloor = getters['activeFloor'];
					let floor = getters['floor'](index);

					if(activeFloor.passive || floor.passive){
						return false
					}

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
			defaultGroup(){
				return () => {
					return {
						name: '',
						svg: null,
						images: [],
						selected: false,
						isApartment: false,
					};
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