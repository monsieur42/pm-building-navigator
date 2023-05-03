<template>
	<div class="pmbn-info-container">
		<el-table 
			:data="properties"
			style="min-width: 100%;"
			table-layout="auto"
			@row-click="openPopup"
		>
			<el-table-column 
				:prop="groupField" 
				:label="($store.getters['groupFieldNames']($i18n)[groupField])? $store.getters['groupFieldNames']($i18n)[groupField] : groupField"
				v-for="(groupField, findex) in $store.getters['infoTableColumns']" 
				:key="findex"
				:fit="true"
				sortable
			>
				<template #default="scope">
					<div class="pmbn-table-cell" :class="cellClasses(scope.row, groupField, findex)">
						<el-icon v-if="findex === 0"><Search /></el-icon>
						<span v-if="['living_area','garden','terrace','balcony'].includes(groupField)">{{ scope.row[groupField] }} m<sup>2</sup></span>
						<span v-else-if="['sale_price','rent_price','rent_overheads'].includes(groupField)">{{formatPrice(scope.row[groupField])}}</span>
						<span v-else-if="groupField === 'available_from'">{{formatDate(scope.row[groupField])}}</span>
						<span v-else-if="groupField === 'registration_url'">
							<el-button 
								plain
								tag="a"
								:href="scope.row[groupField]"
								target="_blank"
								rel="noopener noreferrer"
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
						<span v-else-if="groupField === 'images'" class="pmbn-table-thumbnails">
							<div class="pmbn-table-thumbnail" :style="{'background-image': 'url(\''+((image.sizes.thumbnail && image.sizes.thumbnail.url)? image.sizes.thumbnail.url : image.url)+'\')'}" v-for="(image, imgindex) in scope.row[groupField]" :key="imgindex"></div>
						</span>
						<span v-else>{{ scope.row[groupField] }}</span>
					</div>
				</template>
			</el-table-column>
		</el-table>

		<el-dialog
			v-for="(property, pindex) in properties"
			:key="pindex"
			:model-value="openedDialog === property.propIndex"
			:title="property.name"
		>
			<el-scrollbar height="calc(100vh - 370px)">
				<el-table 
					:data="detailsTableData(property)"
					style="min-width: 100%;"
					table-layout="auto"
					:show-header="false"
				>
					<el-table-column prop="key" :fit="true">
						<template #default="scope">
							<div class="pmbn-table-cell">
								{{($store.getters['groupFieldNames']($i18n)[scope.row.key])? $store.getters['groupFieldNames']($i18n)[scope.row.key] : scope.row.key}}
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="value" :fit="true">
						<template #default="scope">
							<div class="pmbn-table-cell">
								<span v-if="['living_area','garden','terrace','balcony'].includes(scope.row.key)">{{ scope.row.value }} m<sup>2</sup></span>
								<span v-else-if="['sale_price','rent_price','rent_overheads'].includes(scope.row.key)">{{formatPrice(scope.row.value)}}</span>
								<span v-else-if="scope.row.key === 'available_from'">{{formatDate(scope.row.value)}}</span>
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
			</el-scrollbar>
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
		};
	},
	computed: {
		properties(){
			return this.$store.getters['properties'];
		},
		
	},
	methods: {
		openPopup(row, column, event){
			if(event.target.tagName === 'A' || event.target.closest('a')){
				return;
			}
			this.openedDialog = row.propIndex;
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
			const exludeProps = ['svg', 'selected', 'isApartment','factsheet', 'registration_url', 'images'];
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
	},
	mounted(){
		moment.locale(this.$i18nData.langCode);
	}
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
</style>
<style>
	.pmbn-info-container .el-table .cell {
		white-space: nowrap;
	}
	.pmbn-info-container .el-table__row {
		cursor: pointer;
	}
</style>
