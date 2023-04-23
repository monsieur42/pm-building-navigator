import { createStore } from 'vuex';
import _ from 'lodash';
import $ from 'jquery';

export default function createAppStore() {
  return createStore({
	state: {
		mode: 'editor',
		building: null,
	},
	mutations: {
		loadBuilding(state, building){
			state.building = building;
		},
	},
	actions: {
		loadConfig(context, config){
			let $svg = $(config.config.svg).filter('svg').first();

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
						};

						//loop apartments
						$(el).children().each((ai, apartment_element) => {
							let group = {
								name: (typeof $(apartment_element).attr('id') !== 'undefined')? $(apartment_element).attr('id') : 'Apartment ' + ai +' / '+ fi,
								svg: $(apartment_element).prop('outerHTML'),
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
		setOpen(context, index){
			_.forEach(context.getters['floors'], (floor, fi) => {
				floor.opened = (fi > index);
			});
		},
	},
	getters: {
		building(state){
			return state.building;
		},
		floors(state){
			return (state.building)? state.building.floors : [];
		},
		floor(state){
			return (index) => {
				return (state.building)? _.find(state.building.floors, (f, i) => i === index) : null;
			};
		},
		group(state, getters){
			return (floor_index, index) => {
				const floor =  getters['floor'](floor_index);
				return (floor)? _.find(floor.groups, (g, i) => i === index) :  null;
			};
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
	}
  });
}