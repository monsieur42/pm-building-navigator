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
							>{{$i18n('Online Registration')}}</el-button>
						</span>
						<span v-else-if="groupField === 'factsheet'">
							<el-button 
								plain
								tag="a"
								:href="scope.row[groupField].url"
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
			v-for="(property, index) in properties"
			:key="index"
			:model-value="openedDialog === property.propIndex"
			:title="property.name"
			width="30%"
		>
			<span>This is a message: {{property.name}}</span>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="openedDialog = null">Close</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script>
import {Search, Document} from '@element-plus/icons-vue';
import moment from 'moment';

export default {
	name: 'Info',
	components: {Search, Document},
	data: function(){
		return {
			openedDialog: null,
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
</style>
<style>
	.pmbn-info-container .el-table .cell {
		white-space: nowrap;
	}
	.pmbn-info-container .el-table__row {
		cursor: pointer;
	}
</style>
