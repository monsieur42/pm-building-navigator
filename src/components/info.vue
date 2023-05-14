<template>
	<div class="pmbn-info-container">
		<div class="pmbn-info-filters">
			<div class="pmbn-info-filter-wrapper" v-if="$store.getters['infoFilterFields'].includes('name') || $store.getters['infoFilterFields'].includes('floor')">
				<el-input
					v-model="filters.search"
					:placeholder="$i18n('Search')"
					:prefix-icon="SearchIcon"
				/>
			</div>
			<div class="pmbn-info-filter-wrapper -half" v-if="$store.getters['infoFilterFields'].includes('rooms')" style="padding: 0px 10px;">
				<label>{{$i18n('Number of rooms')}}</label>
				<el-slider
					v-model="filters.rooms"
					range
					:step="0.5"
					:min="this.$store.getters['groupFieldMinMax']('rooms')[0]"
					:max="this.$store.getters['groupFieldMinMax']('rooms')[1]"
				/>
			</div>
			<div class="pmbn-info-filter-wrapper -half" v-if="$store.getters['infoFilterFields'].includes('living_area')" style="padding: 0px 10px;">
				<label>{{$i18n('Living area')}}</label>
				<el-slider
					v-model="filters.living_area"
					range
					:min="this.$store.getters['groupFieldMinMax']('living_area')[0]"
					:max="this.$store.getters['groupFieldMinMax']('living_area')[1]"
					:format-tooltip="(v) => v+'m²'"
				/>
			</div>
			<div class="pmbn-info-filter-wrapper -half" v-if="$store.getters['infoFilterFields'].includes('outdoor_types')">
				<label>{{$i18n('Outdoor types')}}</label>
				<el-select
					v-model="filters.outdoor_types"
					filterable
					clearable
					multiple
					:reserve-keyword="false"
				>
					<el-option
						v-for="(outdoorType, otindex) in $store.getters['groupOutdoorTypes']"
						:key="otindex"
						:label="outdoorType"
						:value="outdoorType"
					/>
				</el-select>
			</div>
			<div class="pmbn-info-filter-wrapper -half" v-if="$store.getters['infoFilterFields'].includes('garden')" style="padding: 0px 10px;">
				<label>{{$i18n('Garden')}}</label>
				<el-slider
					v-model="filters.garden"
					range
					:min="this.$store.getters['groupFieldMinMax']('garden')[0]"
					:max="this.$store.getters['groupFieldMinMax']('garden')[1]"
					:format-tooltip="(v) => v+'m²'"
				/>
			</div>
			<div class="pmbn-info-filter-wrapper -half" v-if="$store.getters['infoFilterFields'].includes('terrace')" style="padding: 0px 10px;">
				<label>{{$i18n('Terrace')}}</label>
				<el-slider
					v-model="filters.terrace"
					range
					:min="this.$store.getters['groupFieldMinMax']('terrace')[0]"
					:max="this.$store.getters['groupFieldMinMax']('terrace')[1]"
					:format-tooltip="(v) => v+'m²'"
				/>
			</div>
			<div class="pmbn-info-filter-wrapper -half" v-if="$store.getters['infoFilterFields'].includes('balcony')" style="padding: 0px 10px;">
				<label>{{$i18n('Balcony')}}</label>
				<el-slider
					v-model="filters.balcony"
					range
					:min="this.$store.getters['groupFieldMinMax']('balcony')[0]"
					:max="this.$store.getters['groupFieldMinMax']('balcony')[1]"
					:format-tooltip="(v) => v+'m²'"
				/>
			</div>
			<div class="pmbn-info-filter-wrapper -half" v-if="$store.getters['infoFilterFields'].includes('sale_price')" style="padding: 0px 10px;">
				<label>{{$i18n('Sale price')}}</label>
				<el-slider
					v-model="filters.sale_price"
					range
					:step="calcSteps(this.$store.getters['groupFieldMinMax']('sale_price'))"
					:min="this.$store.getters['groupFieldMinMax']('sale_price')[0]"
					:max="this.$store.getters['groupFieldMinMax']('sale_price')[1]"
					:format-tooltip="formatPrice"
				/>
			</div>
			<div class="pmbn-info-filter-wrapper -half" v-if="$store.getters['infoFilterFields'].includes('rent_price')" style="padding: 0px 10px;">
				<label>{{$i18n('Rent price')}}</label>
				<el-slider
					v-model="filters.rent_price"
					range
					:step="calcSteps(this.$store.getters['groupFieldMinMax']('rent_price'))"
					:min="this.$store.getters['groupFieldMinMax']('rent_price')[0]"
					:max="this.$store.getters['groupFieldMinMax']('rent_price')[1]"
					:format-tooltip="formatPrice"
				/>
			</div>
			<div class="pmbn-info-filter-wrapper -half" v-if="$store.getters['infoFilterFields'].includes('rent_overheads')" style="padding: 0px 10px;">
				<label>{{$i18n('Overheads')}}</label>
				<el-slider
					v-model="filters.rent_overheads"
					range
					:step="calcSteps(this.$store.getters['groupFieldMinMax']('rent_overheads'))"
					:min="this.$store.getters['groupFieldMinMax']('rent_overheads')[0]"
					:max="this.$store.getters['groupFieldMinMax']('rent_overheads')[1]"
					:format-tooltip="formatPrice"
				/>
			</div>
			<div class="pmbn-info-filter-wrapper" v-if="$store.getters['infoFilterFields'].includes('available_from')">
				<label>{{$i18n('Availability')}}</label>
				<el-date-picker
					v-model="filters.available_from"
					type="daterange"
					:range-separator="$i18n('to', 'date range')"
					:start-placeholder="$i18n('Start date')"
					:end-placeholder="$i18n('End date')"
				/>
			</div>
			<div class="pmbn-info-filter-wrapper -half" v-if="$store.getters['infoFilterFields'].includes('status')">
				<label>{{$i18n('Status')}}</label>
				<el-select
					v-model="filters.status"
					filterable
					clearable
					:reserve-keyword="false"
				>
					<el-option
						v-for="(status, statusKey) in $store.getters['groupStatuses']($i18n, true)"
						:key="statusKey"
						:label="status"
						:value="statusKey"
					/>
				</el-select>
			</div>
			<div class="pmbn-info-filter-wrapper -half" v-if="$store.getters['infoFilterFields'].includes('floorIndex')">
				<label>{{$i18n('Floor')}}</label>
				<el-select
					v-model="filters.floor"
					filterable
					clearable
					multiple
					:reserve-keyword="false"
				>
					<el-option
						v-for="floorOption in floorOptions"
						:key="floorOption.value"
						:label="floorOption.label"
						:value="floorOption.value"
					/>
				</el-select>
			</div>
		</div>
		<el-table 
			ref="infotable"
			:data="properties"
			style="min-width: 100%;"
			table-layout="auto"
			@row-click="openPopup"
			@cell-mouse-enter="highlightApartment"
			:row-class-name="getRowClasses"
			class="pmbn-info-table"
		>
			<el-table-column 
				:prop="groupField" 
				:label="getColumnNames(groupField)"
				v-for="(groupField, findex) in $store.getters['infoTableColumns']" 
				:key="findex"
				:fit="true"
				sortable
			>
				<template #default="scope">
					<div class="pmbn-table-cell" :class="cellClasses(scope.row, groupField, findex)">
						<span class="pmbn-resp-cell-label" v-if="findex > 0">{{getColumnNames(groupField)}}: </span>
						<el-icon v-if="findex === 0"><Search /></el-icon>
						<span v-if="['living_area','garden','terrace','balcony'].includes(groupField)">{{ scope.row[groupField] }} m<sup>2</sup></span>
						<span v-else-if="['sale_price','rent_price','rent_overheads'].includes(groupField)">{{formatPrice(scope.row[groupField])}}</span>
						<span v-else-if="groupField === 'available_from'">{{formatDate(scope.row[groupField])}}</span>
						<span v-else-if="groupField === 'status'">{{(($store.getters['groupStatuses']($i18n)[scope.row[groupField]])? $store.getters['groupStatuses']($i18n)[scope.row[groupField]] : '-')}}</span>
						<span v-else-if="groupField === 'registration_url'">
							<el-button 
								plain
								tag="a"
								:href="scope.row[groupField]"
								target="_blank"
								rel="noopener noreferrer"
								:disabled="scope.row.status !== 'available'"
							><el-icon style="margin-right: 5px;"><EditPen /></el-icon> {{$i18n('Online Registration')}}</el-button>
						</span>
						<span v-else-if="groupField === 'factsheet'">
							<el-button 
								plain
								tag="a"
								:href="scope.row[groupField].url"
								v-if="scope.row[groupField] && scope.row[groupField].url"
								target="_blank"
							><el-icon style="margin-right: 5px;"><Document /></el-icon> {{$i18n('Fact sheet')}}</el-button>
						</span>
						<span v-else-if="['images','blueprints'].includes(groupField)" class="pmbn-table-thumbnails">
							<div class="pmbn-table-thumbnail" :style="{'background-image': 'url(\''+((image.sizes.thumbnail && image.sizes.thumbnail.url)? image.sizes.thumbnail.url : image.url)+'\')'}" v-for="(image, imgindex) in scope.row[groupField]" :key="imgindex"></div>
						</span>
						<span v-else-if="groupField === 'outdoor_types'">{{scope.row[groupField].join(', ')}}</span>
						<span v-else>{{ scope.row[groupField] }}</span>
						<span class="pmbn-resp-cell-coma" v-if="findex > 0 && findex < $store.getters['infoTableColumns'].length - 1">,</span>
					</div>
				</template>
			</el-table-column>
		</el-table>

		<el-dialog
			v-for="(property, pindex) in properties"
			:key="pindex"
			:model-value="openedDialog === property.propIndex"
			:title="property.name"
			@closed="handleDialogClose"
			@open="handleDialogOpen"
			align-center
			width="100%"
		>
			<el-table 
				:data="detailsTableData(property)"
				style="min-width: 100%;"
				table-layout="auto"
				:show-header="false"
			>
				<el-table-column prop="key" :fit="true">
					<template #default="scope">
						<div class="pmbn-table-cell">
							{{($store.getters['groupFieldNames'][scope.row.key])? $store.getters['groupFieldNames'][scope.row.key] : scope.row.key}}
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="value" :fit="true">
					<template #default="scope">
						<div class="pmbn-table-cell">
							<span v-if="['living_area','garden','terrace','balcony'].includes(scope.row.key)">{{ scope.row.value }} m<sup>2</sup></span>
							<span v-else-if="['sale_price','rent_price','rent_overheads'].includes(scope.row.key)">{{formatPrice(scope.row.value)}}</span>
							<span v-else-if="scope.row.key === 'available_from'">{{formatDate(scope.row.value)}}</span>
							<span v-else-if="scope.row.key === 'status'">{{(($store.getters['groupStatuses']($i18n)[scope.row.value])? $store.getters['groupStatuses']($i18n)[scope.row.value] : '-')}}</span>
							<span v-else-if="scope.row.key === 'outdoor_types'">{{scope.row.value.join(', ')}}</span>
							<span v-else>{{ scope.row.value }}</span>
						</div>
					</template>
				</el-table-column>
			</el-table>
			<div class="pmbn-popup-details-buttons">
				<el-button 
					plain
					tag="a"
					:href="property.registration_url"
					target="_blank"
					rel="noopener noreferrer"
					:disabled="property.status !== 'available'"
					v-if="$store.getters['infoDetailsFields'].includes('registration_url')"
				><el-icon style="margin-right: 5px;"><EditPen /></el-icon> {{$i18n('Online Registration')}}</el-button>
				<el-button 
					plain
					tag="a"
					:href="property.factsheet.url"
					target="_blank"
					v-if="$store.getters['infoDetailsFields'].includes('factsheet') && property.factsheet && property.factsheet.url"
				><el-icon style="margin-right: 5px;"><Document /></el-icon> {{$i18n('Fact sheet')}}</el-button>
			</div>
			<div class="pmbn-popup-details-image-slider" v-if="$store.getters['infoDetailsFields'].includes('blueprints') && property.blueprints && property.blueprints.length > 0">
				<swiper
					:modules="swiperModules"
					navigation
					:pagination="{ clickable: true, dynamicBullets: true, }"
					:autoHeight="true"
				>
					<swiper-slide v-for="(image, bpindex) in property.blueprints" :key="bpindex" class="pmbn-image-slide">
						<a :href="property.factsheet?.url ?? '#'" target="_blank"><img :src="((image.sizes.large && image.sizes.large.url)? image.sizes.large.url : image.url)" :alt="((image.alt)? image.alt : '')" /></a>
					</swiper-slide>
				</swiper>
			</div>
			<div class="pmbn-popup-details-image-slider" v-if="$store.getters['infoDetailsFields'].includes('images') && property.images && property.images.length > 0">
				<swiper
					:modules="swiperModules"
					navigation
					:pagination="{ clickable: true, dynamicBullets: true, }"
					:autoHeight="true"
				>
					<swiper-slide v-for="(image, imgindex) in property.images" :key="imgindex" class="pmbn-image-slide">
						<img :src="((image.sizes.large && image.sizes.large.url)? image.sizes.large.url : image.url)" :alt="((image.alt)? image.alt : '')" />
					</swiper-slide>
				</swiper>
			</div>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="openedDialog = null">Close</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>
<script>
import {Search, Document, EditPen} from '@element-plus/icons-vue';
import moment from 'moment';
import _ from 'lodash';
import { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide  } from 'swiper/vue/swiper-vue.js';
import 'swiper/swiper.min.css';
import 'swiper/modules/navigation/navigation.min.css';
import 'swiper/modules/pagination/pagination.min.css';

export default {
	name: 'Info',
	components: {Swiper, SwiperSlide, Search, Document, EditPen},
	data: function(){
		return {
			openedDialog: null,
			swiperModules: [Navigation, Pagination],
			filters: {
				search: '',
				rooms: this.$store.getters['groupFieldMinMax']('rooms'),
				living_area: this.$store.getters['groupFieldMinMax']('living_area'),
				garden: this.$store.getters['groupFieldMinMax']('garden'),
				terrace: this.$store.getters['groupFieldMinMax']('terrace'),
				balcony: this.$store.getters['groupFieldMinMax']('balcony'),
				sale_price: this.$store.getters['groupFieldMinMax']('sale_price'),
				rent_price: this.$store.getters['groupFieldMinMax']('rent_price'),
				rent_overheads: this.$store.getters['groupFieldMinMax']('rent_overheads'),
				available_from: null,
				status: null,
				floor: null,
				outdoor_types: [],
			},
			isTableScrolling: false,
		};
	},
	computed: {
		properties(){
			return _.filter(this.$store.getters['properties'], (property) => {

				//SEARCH
				if(this.filters.search.length > 0 && (this.$store.getters['infoFilterFields'].includes('name') || this.$store.getters['infoFilterFields'].includes('floor'))){
					let searchTerm = _.trim(_.lowerCase(this.filters.search));
					let groupName = _.trim(_.lowerCase(property.name));
					let floorName = _.trim(_.lowerCase(property.floor));
					let searchHit = false;

					if(this.$store.getters['infoFilterFields'].includes('name') && _.includes(groupName, searchTerm)){
						searchHit = true;
					}

					if(!searchHit && this.$store.getters['infoFilterFields'].includes('floor') && _.includes(floorName, searchTerm)){
						searchHit = true;
					}

					if(!searchHit){
						return false;
					}
				}

				//ROOMS
				if(this.$store.getters['infoFilterFields'].includes('rooms')){
					if(property.rooms < this.filters.rooms[0] || property.rooms > this.filters.rooms[1]){
						return false;
					}
				}

				//LIVING AREA
				if(this.$store.getters['infoFilterFields'].includes('living_area')){
					if(property.living_area < this.filters.living_area[0] || property.living_area > this.filters.living_area[1]){
						return false;
					}
				}

				//OUTDOOR TYPES
				if(this.$store.getters['infoFilterFields'].includes('outdoor_types')){
					if(this.filters.outdoor_types && this.filters.outdoor_types.length > 0){
						if(_.isEmpty(_.intersection(property.outdoor_types, this.filters.outdoor_types))){
							return false;
						}
					}
				}

				//GARDEN
				if(this.$store.getters['infoFilterFields'].includes('garden')){
					if(property.garden < this.filters.garden[0] || property.garden > this.filters.garden[1]){
						return false;
					}
				}

				//TERRACE
				if(this.$store.getters['infoFilterFields'].includes('terrace')){
					if(property.terrace < this.filters.terrace[0] || property.terrace > this.filters.terrace[1]){
						return false;
					}
				}

				//BALCONY
				if(this.$store.getters['infoFilterFields'].includes('balcony')){
					if(property.balcony < this.filters.balcony[0] || property.balcony > this.filters.balcony[1]){
						return false;
					}
				}

				//SALE PRICE
				if(this.$store.getters['infoFilterFields'].includes('sale_price')){
					if(property.sale_price < this.filters.sale_price[0] || property.sale_price > this.filters.sale_price[1]){
						return false;
					}
				}

				//RENT PRICE
				if(this.$store.getters['infoFilterFields'].includes('rent_price')){
					if(property.rent_price < this.filters.rent_price[0] || property.rent_price > this.filters.rent_price[1]){
						return false;
					}
				}

				//RENT OVERHEADS
				if(this.$store.getters['infoFilterFields'].includes('rent_overheads')){
					if(property.rent_overheads < this.filters.rent_overheads[0] || property.rent_overheads > this.filters.rent_overheads[1]){
						return false;
					}
				}	

				//AVAILABLE FROM
				if(this.$store.getters['infoFilterFields'].includes('available_from')){
					let available_from = new Date(property.available_from);
					if(this.filters.available_from){
						if(available_from < this.filters.available_from[0] || available_from > this.filters.available_from[1]){
							return false;
						}
					}
				}

				//STATUS
				if(this.$store.getters['infoFilterFields'].includes('status')){
					if(this.filters.status){
						if(property.status !== this.filters.status){
							return false;
						}
					}
				}

				//FLOOR
				if(this.$store.getters['infoFilterFields'].includes('floorIndex')){
					if(this.filters.floor && this.filters.floor.length > 0){
						if(!this.filters.floor.includes(property.floorIndex)){
							return false;
						}
					}
				}

				return true;
			});
		},
		SearchIcon(){
			return Search;
		},
		floorOptions(){
			let options = [];
			_.forEach(this.$store.getters['floors'], (floor, fi) => {
				if(typeof (_.find(floor.groups, (g) => g.isApartment)) !== 'undefined'){
					options.push({
						value: fi,
						label: floor.name,
					});
				}
			});
			return options;
		},
	},
	methods: {
		openPopup(row, column, event){
			if(row.status != 'available' || event.target.tagName === 'A' || event.target.closest('a')){
				return;
			}
			this.openedDialog = row.propIndex;
		},
		highlightApartment(row){
			this.$store.dispatch('setActiveFloor', row.floorIndex);
			this.$store.dispatch('selectGroup', {floor: row.floorIndex, group: row.groupIndex});
		},
		cellClasses(row, groupField, findex){
			var classes = [];
			if(findex === 0){
				classes.push('-first');
			}
			classes.push('-cell-'+groupField);
			return classes;
		},
		formatPrice(price){
			var options = { 
				style: 'currency',
				currency: (this.$store.state.info.currency && this.$store.state.info.currency.length > 0)? this.$store.state.info.currency : 'USD',
			};
			return price.toLocaleString(this.$i18nData.locale.replace('_', '-'), options);
		},
		formatDate(date){
			return moment(date).format('LL');
		},
		detailsTableData(property){
			const exludeProps = ['svg', 'selected', 'isApartment','factsheet', 'registration_url', 'images', 'blueprints'];
			let infoDetailsFields = this.$store.getters['infoDetailsFields'];
			return _(property)
				.map((value, key) => ({ key, value }))
				.filter(({ key }) => !exludeProps.includes(key) && infoDetailsFields.includes(key)) 
				.sortBy(({ key }) => _.indexOf(this.$store.getters['fieldOrder'], key))
				.value();
		},
		reInitImagesSlick() {
			this.$nextTick(() => {
				this.$refs.imagesSlick.reSlick();
			});
		},
		getRowClasses(payload){
			let classes = [];

			if(
				this.$store.state.editor.selectedGroup && 
				this.$store.state.editor.selectedGroup.floor === payload.row.floorIndex && 
				this.$store.state.editor.selectedGroup.group === payload.row.groupIndex
			){
				classes.push('-highlight');
			}

			if(payload.row.status !== 'available'){
				classes.push('-unavailable');
			}

			return classes;
		},
		calcSteps(range){
			const dif = range[1] - range[0];
			const numDigits = Math.floor(Math.log10(dif)) + 1;
			const base = Math.pow(10, numDigits - 1);
			return base / 100;
		},
		getColumnNames(fieldName){
			let columnName = (this.$store.getters['groupFieldNames'][fieldName])? this.$store.getters['groupFieldNames'][fieldName] : fieldName;
			return columnName;
		},
		checkTableOverflow() {
			const tableScrollbarWrapper = this.$refs.infotable.$el.querySelector('.el-scrollbar__wrap');
			if (tableScrollbarWrapper.scrollWidth > tableScrollbarWrapper.clientWidth) {
				this.isTableScrolling = true;
			}
			else {
				this.isTableScrolling = false;
			}
		},
		handleDialogOpen(){
			const body = document.querySelector('body');
			const html = document.querySelector('html');

			body.classList.add('el-popup-parent--hidden')
			html.classList.add('el-popup-parent--hidden')
		},
		handleDialogClose(){
			this.openedDialog = null;

			const body = document.querySelector('body');
			const html = document.querySelector('html');

			body.classList.remove('el-popup-parent--hidden')
			html.classList.remove('el-popup-parent--hidden')
		},
	},
	mounted(){
		moment.locale(this.$i18nData.langCode);

		this.$nextTick(() => {
			setTimeout(() => {this.checkTableOverflow();}, 0)
		});
		window.addEventListener('resize', this.checkTableOverflow);
	},
}
</script>

<style scoped>
	.pmbn-info-container {
		width: 100%;
	}
	.pmbn-table-cell {
		display: flex; 
		align-items: center;
	}
	.pmbn-table-cell.-first span {
		margin-left: 10px;
	}
	.pmbn-table-cell.-cell-rooms,
	.pmbn-table-cell.-cell-floorIndex {
		justify-content: center;
	}
	.pmbn-table-cell.-cell-living_area,
	.pmbn-table-cell.-cell-garden,
	.pmbn-table-cell.-cell-terrace,
	.pmbn-table-cell.-cell-balcony {
		justify-content: flex-end;
		padding-right: 10px;
	}
	.pmbn-table-thumbnails {
		display: flex;
		justify-content: center;
		align-items: center;
		align-content: center;
		flex-wrap: wrap;
		gap: 5px;
	}
	.pmbn-table-thumbnail {
		width: 30px;
		height: 30px;
		background-size: cover;
		background-position: 50% 50%;
	}
	.pmbn-popup-details-buttons {
		padding: 25px 0px;
	}
	.pmbn-image-slide img {
		max-width: 100%;
		width: auto;
		height: auto;
	}
	.pmbn-info-filters {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		align-content: center;
		flex-wrap: wrap;
		gap: 20px;
	}
	.pmbn-info-filter-wrapper {
		width: 100%;
		box-sizing: border-box;
	}
	.pmbn-info-filter-wrapper.-half {
		width: calc(50% - 10px);
	}
	.pmbn-info-filter-wrapper label {
		color: var(--el-text-color-regular);
		font-size: 14px;
		font-weight: bold;
	}
	.pmbn-info-filters {
		margin-bottom: 25px;
	}
</style>
<style>
	.pmbn-info-container .el-table .cell {
		white-space: nowrap;
	}
	.pmbn-info-container .el-table__row:not(.-unavailable) {
		cursor: pointer;
	}
	.pmbn-info-container .el-table__row.-unavailable {
		opacity: var(--pmbn-sold-status-row-opacity);
	}
	.pmbn-info-container .el-table--enable-row-hover .el-table__body tr.-highlight>td.el-table__cell {
		background-color: var(--el-table-row-hover-bg-color);
	}
	.pmbn-info-container .el-date-editor,
	.pmbn-info-container .el-select {
		width: 100%;
	}

	.pmbn-resp-cell-label,
	.pmbn-resp-cell-coma {
		display: none;
	}
	.pmbn-app-info-container.-responsive .pmbn-resp-cell-label{
		display: inline-block;
		margin-right: 5px;
	}
	.pmbn-app-info-container.-responsive .pmbn-resp-cell-coma {
		display: inline-block;
	}
	.pmbn-app-info-container.-responsive .pmbn-info-table table {
		display: block;
		width: 100% !important;
		max-width: 100%;
	}
	.pmbn-app-info-container.-responsive .pmbn-info-table thead {
		display: none;
	}
	.pmbn-app-info-container.-responsive .pmbn-info-table tbody {
		display: block;
		width: 100%;
		max-width: 100%;
	}
	.pmbn-app-info-container.-responsive .pmbn-info-table tr.el-table__row {
		width: 100%;
		max-width: 100%;
		display: flex;
		justify-content: flex-start;
		align-items: flex-end;
		flex-wrap: wrap;
		border-bottom: var(--el-table-border);
		padding: 8px 0;
	}
	.pmbn-app-info-container.-responsive .pmbn-info-table td.el-table__cell {
		display: block;
		border-bottom: none;
		padding: 3px 0;
	}
	.pmbn-app-info-container.-responsive .pmbn-info-table td.el-table_1_column_1 {
		width: 100%;
		font-size: 18px;
		font-weight: bold;
	}
	.pmbn-app-info-container.-responsive .pmbn-info-table td.el-table__cell > div.cell{
		line-height: 1.2;
		padding: 0 3px;
	}
	.pmbn-app-info-container.-responsive .pmbn-info-table .pmbn-table-cell {
		align-items: flex-end;
	}
	.pmbn-app-info-container.-responsive .el-table--enable-row-hover.pmbn-info-table  .el-table__body tr:hover,
	.pmbn-app-info-container.-responsive .el-table--enable-row-hover.pmbn-info-table  .el-table__body tr.-highlight {
		background-color: var(--el-table-row-hover-bg-color);
		transition: background-color .25s ease;
	}
	.pmbn-app-info-container.-responsive .el-table--enable-row-hover.pmbn-info-table  .el-table__body tr:hover>td.el-table__cell,
	.pmbn-app-info-container.-responsive .el-table--enable-row-hover.pmbn-info-table  .el-table__body tr.-highlight>td.el-table__cell {
		background-color: transparent;
	}



</style>
