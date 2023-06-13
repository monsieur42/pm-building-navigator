import { createStore } from 'vuex';
import { toRaw } from 'vue';
import _ from 'lodash';
import $ from 'jquery';
import {i18n} from '@/services/i18n.js';

export default function createAppStore() {
	return createStore({
		state: {
			loaded: false,
			mode: 'editor',
			clipboard: null,
			building: {
				floors: [],
				additionalSVG: [],
				levelSpacing: 38,
				spaceAbove: 0,
				viewbox: [0,0,100,100],
				mainColor: '#409eff',
			},
			editor: {
				activeTab: 'general',
				activeFloor: 0,
				selectedGroup: null,
				activeGeneralAccordion: 'graphic',
			},
			info: {
				tableColumns: ['name', 'floor'],
				detailsFields: ['name', 'floor'],
				groupFieldNames: {},
				filterFields: [],
				fieldOrder: [],
				currency: '',
				rentPricePeriod: '',
				soldStatusRowOpacity: 50,
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
			loadInfo(state, infoState){
				state.info = infoState;
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
			copyToClipboard(state, clipboardData){
				state.clipboard = toRaw(clipboardData);
			},

			toggleInfoTableColumn(state, fieldName){
				state.info.tableColumns = _.xor(state.info.tableColumns,[fieldName]);
			},
			toggleInfoDetailsField(state, fieldName){
				state.info.detailsFields = _.xor(state.info.detailsFields,[fieldName]);
			},
			toggleInfoFilterField(state, fieldName){
				state.info.filterFields = _.xor(state.info.filterFields,[fieldName]);
			},
			setFieldOrder(state, fieldOrder){
				state.info.fieldOrder = fieldOrder;
			},
		},
		actions: {
			setLoaded(context){
				context.commit('setLoaded');
			},
			loadConfig(context, config){
				context.dispatch('loadBuilding', (config.building ?? {}));
				context.dispatch('loadEditor', (config.editor ?? {}));
				context.dispatch('loadInfo', (config.info ?? {}));
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
			loadInfo(context, infoState){
				context.commit('loadInfo', _.merge(context.state.info, infoState));

				let defaultFieldOrder = context.getters['groupFields']();
				context.state.info.fieldOrder = _.uniq(_.concat(context.state.info.fieldOrder, defaultFieldOrder));
				if(_.isEmpty(context.state.info.groupFieldNames)){
					context.state.info.groupFieldNames = {};
				}
			},
			setMode(context, mode){
				context.commit('setMode', mode);
			},


			setActiveFloor(context, index){
				index = (index >= 0)? index : 0;
				index = (index <= context.state.building.floors.length - 1)? index : context.state.building.floors.length - 1; 
				context.commit('setActiveFloor', index);
			},


			selectGroup(context, payload){
				context.commit('selectGroup', payload);
			},


			setActiveTab(context, tabName){
				context.commit('setActiveTab', tabName);
			},
			copyToClipboard(context, clipboardData){
				context.commit('copyToClipboard', clipboardData);
			},
			pasteClipboardToGroup(context, group){
				const protectProps = ['svg', 'selected'];
				if(group && context.getters['clipboard'] && context.getters['clipboard'].type === 'group'){
					group = _.mergeWith(group, context.getters['clipboard'].data, (objValue, srcValue, key) => {
						return (protectProps.includes(key))? objValue : srcValue;
					});
				}
			},

			toggleInfoTableColumn(context, fieldName){
				context.commit('toggleInfoTableColumn', fieldName);
			},
			toggleInfoDetailsField(context, fieldName){
				context.commit('toggleInfoDetailsField', fieldName);
			},
			toggleInfoFilterField(context, fieldName){
				context.commit('toggleInfoFilterField', fieldName);
			},
			setFieldOrder(context, fieldOrder){
				context.commit('setFieldOrder', fieldOrder);
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
					info: toRaw(state.info),
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
						svg: null,
						selected: false,
						isApartment: false,
						name: '',

						rooms: 0,
						living_area: 0,
						outdoor_types: [],
						garden: 0,
						terrace: 0,
						balcony: 0,
						basement: 0,

						sale_price: 0,
						rent_price: 0,
						net_rent: 0,
						rent_overheads: 0,

						available_from: null,
						status: null,
						registration_url: null,
						factsheet: null,
						blueprints: [],
						images: [],
					};
				};
			},
			groupFieldNames(state){
				let defaults = {
					name: i18n('Apartment name'),
					rooms: i18n('Number of rooms'),
					living_area: i18n('Living area'),
					outdoor_types: i18n('Outdoor types'),
					garden: i18n('Garden'),
					terrace: i18n('Terrace'),
					balcony: i18n('Balcony'),
					basement: i18n('Basement'),
					sale_price: i18n('Sale price'),
					rent_price: i18n('Rent price'),
					net_rent: i18n('Net rent'),
					rent_overheads: i18n('Overheads'),
					available_from: i18n('Available from'),
					status: i18n('Status'),
					registration_url: i18n('Registration URL'),
					factsheet: i18n('Fact sheet'),
					blueprints: i18n('Floor plan'),
					images: i18n('Apartment images'),
					floor: i18n('Floor name'),
					floorIndex: i18n('Floor index'),
				};
				return _.merge(defaults, _.pickBy(state.info.groupFieldNames, (gfn) => !_.isEmpty(gfn) ));
			},
			groupFields(state, getters){
				return () => {
					const exludeProps = ['svg', 'selected', 'isApartment'];
					let fields = _.difference(_.keys(getters['defaultGroup']()), exludeProps);
					fields.push('floor');
					fields.push('floorIndex');

					return fields;
				};
			},
			sortedGroupFields(state, getters){
				return _.sortBy(getters['groupFields'](), key => _.indexOf(state.info.fieldOrder, key));
			},
			properties(state, getters){
				let properties = [];
				let propIndex = 0;
				_.forEach(getters['floors'], (floor, fi) => {
					_.forEach(floor.groups, (group, gi) => {
						if(group.isApartment){
							properties.push({
								...group,
								floor: floor.name,
								floorIndex: fi,
								propIndex: propIndex,
								groupIndex: gi,
							});
							propIndex++;
						}
					});
				});

				return properties;
			},
			groupStatuses(state, getters){
				return ($i18n, usedOnly) => {
					let used = getters['groupFieldUsed']('status');
					let statuses = {
						available: $i18n('Available'),
						sold: $i18n('Sold'),
						rented: $i18n('Rented'),
					};

					return (usedOnly)? _.pickBy(statuses, (l, v) => used.includes(v)) : statuses;
				};
				//return _.compact(_.uniq(_.map(getters['properties'], _.property('status'))));
			},
			groupOutdoorTypes(state, getters){
				return _.uniq(_.flatten(getters['groupFieldUsed']('outdoor_types')));
			},

			selectedGroup(state, getters){
				return (state.editor.selectedGroup)? getters['group'](state.editor.selectedGroup.floor, state.editor.selectedGroup.group) : null;
			},

			activeTab(state){
				return (state.editor)? state.editor.activeTab : 'general';
			},
			clipboard(state){
				return state.clipboard;
			},
			infoTableColumns(state){
				return _.sortBy(state.info.tableColumns, key => _.indexOf(state.info.fieldOrder, key));
			},
			infoDetailsFields(state){
				return _.sortBy(state.info.detailsFields, key => _.indexOf(state.info.fieldOrder, key));
			},
			infoFilterFields(state){
				return _.sortBy(state.info.filterFields, key => _.indexOf(state.info.fieldOrder, key));
			},
			fieldOrder(state){
				return state.info.fieldOrder;
			},
			groupFieldMinMax(state, getters){
				let properties = getters['properties'];
				return (field) => {
					return (_.minBy(properties, field) && _.maxBy(properties, field))? [_.minBy(properties, field)[field], _.maxBy(properties, field)[field]] : [0,0];
				};
			},
			groupFieldUsed(state, getters){
				let properties = getters['properties'];
				return (field) => {
					return _.uniq(_.filter(_.map(properties, field), (v) => !_.isEmpty(v)));
				};
			},
		}
	});
}