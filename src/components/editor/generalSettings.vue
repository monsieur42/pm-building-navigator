<template>
	<template v-if="$store.getters['svgLoaded']">
		<el-collapse v-model="$store.state.editor.activeGeneralAccordion" accordion>
			<el-collapse-item :title="$i18n('Graphic')" name="graphic">
				<el-form-item :label="$i18n('Level spacing')">
					<el-slider v-model="$store.state.building.levelSpacing" :max="levelSpacingMax" @change="levelSpacingChanged" />
				</el-form-item>
				<el-form-item :label="$i18n('Space above')">
					<el-input-number v-model="$store.state.building.spaceAbove" :step="1" />
				</el-form-item>
				<el-form-item :label="$i18n('Main color')">
					<el-color-picker v-model="$store.state.building.mainColor" />
				</el-form-item>
				<el-form-item :label="$i18n('Sold status row opacity')">
					<el-slider v-model="$store.state.info.soldStatusRowOpacity" />
				</el-form-item>
				<el-form-item :label="$i18n('Change SVG')">
					<el-upload
						ref="changeSVG"
						action=""
						:limit="1"
						:before-upload="handleBeforeUpload"
						:on-success="handleSuccess"
						accept=".svg"
					>
						<template #trigger>
							<el-button type="primary">{{$i18n('select file')}}</el-button>
						</template>

						<template #tip>
							<div class="el-upload__tip">
								{{$i18n('Svg files with groups on the top level representing the floors and groups in the floors representing the apartments.')}}
							</div>
						</template>
					</el-upload>
				</el-form-item>
			</el-collapse-item>
			<el-collapse-item :title="$i18n('Apartments')" name="apartments">
				<el-form-item :label="$i18n('Currency')">
					<el-input v-model="$store.state.info.currency" />
				</el-form-item>
				<el-form-item :label="$i18n('Rent price period')">
					<el-input v-model="$store.state.info.rentPricePeriod" />
				</el-form-item>

				<draggable
					:component-data="{
						type: 'transition-group',
						name: !dragGroupField ? 'flip-list' : null
					}"
					v-model="fieldOrder"
					v-bind="dragOptions"
					@start="dragGroupField = true"
					@end="dragGroupField = false"
					item-key="order"
					handle=".el-form-item__label"
					class="pmbn-group-fields-draggable"
				>
					<template #item="{ element }">
						<el-form-item class="pmbn-group-fields-item" :label="($store.getters['groupFieldNames'][element.field])? $store.getters['groupFieldNames'][element.field] : element.field">
							<el-tooltip effect="dark" :content="$i18n('Display in table column')" placement="top" :hide-after="0">
								<el-button 
									:type="($store.getters['infoTableColumns'].includes(element.field))? 'success' : 'default' " 
									circle 
									@click="$store.dispatch('toggleInfoTableColumn', element.field)"
								>
									<el-icon><Grid /></el-icon>
								</el-button>
							</el-tooltip>
							<el-tooltip effect="dark" :content="$i18n('Display apartment details')" placement="top" :hide-after="0">
								<el-button 
									:type="($store.getters['infoDetailsFields'].includes(element.field))? 'success' : 'default' " 
									circle
									@click="$store.dispatch('toggleInfoDetailsField', element.field)"
								>
									<el-icon><Tickets /></el-icon>
								</el-button>
							</el-tooltip>
							<el-tooltip effect="dark" :content="$i18n('Display as filter option')" placement="top" :hide-after="0" v-if="!['registration_url', 'factsheet', 'images', 'blueprints'].includes(element.field)">
								<el-button 
									:type="($store.getters['infoFilterFields'].includes(element.field))? 'success' : 'default' " 
									circle 
									@click="$store.dispatch('toggleInfoFilterField', element.field)"
								>
									<el-icon><Operation /></el-icon>
								</el-button>
							</el-tooltip>
							<el-input v-model="$store.state.info.groupFieldNames[element.field]" class="group-field-name" :placeholder="$store.getters['groupFieldNames'][element.field]"/>
						</el-form-item>
					</template>
				</draggable>
				


			</el-collapse-item>
		</el-collapse>
		
	</template>
	<template v-else>
		<el-form-item :label="$i18n('Load SVG')">
			<el-upload
				ref="loadSVG"
				action=""
				:limit="1"
				:before-upload="handleBeforeUpload"
				:on-success="handleSuccess"
				accept=".svg"
			>
				<template #trigger>
					<el-button type="primary">{{$i18n('select file')}}</el-button>
				</template>

				<template #tip>
					<div class="el-upload__tip">
						{{$i18n('Svg files with groups on the top level representing the floors and groups in the floors representing the apartments.')}}
					</div>
				</template>
			</el-upload>
		</el-form-item>
	</template>
</template>

<script>
import _ from 'lodash';
import { Grid, Tickets, Operation } from '@element-plus/icons-vue';
import draggable from "vuedraggable";

export default {
	name: 'Editor',
	components: {draggable, Grid, Tickets, Operation},
	data: function(){
		return {
			svgInput: null,
			levelSpacingMax: this.$store.getters['levelSpacing'] * 2,
			dragGroupField: false,
			loadSortedGroupFields: false,
			fieldOrder: this.$store.getters['fieldOrder'].map((field, index) => {
				return { field, order: index + 1 };
			}),
		};
	},
	computed: {
		dragOptions() {
			return {
				animation: 200,
				group: "description",
				disabled: false,
				ghostClass: "ghost"
			};
		},
	},
	methods: {
		levelSpacingChanged(){
			this.levelSpacingMax = this.$store.getters['levelSpacing'] * 2;
		},

		handleBeforeUpload(file) {
			const isSvg = file.type === 'image/svg+xml'
			if (!isSvg) {
				this.$message.error(this.$i18n('Only SVG files are allowed.'))
			}
			return isSvg;
		},
		handleSuccess(response, file) {
			const reader = new FileReader()
			reader.onload = () => {
				const content = reader.result
				this.$store.dispatch('loadSVG', content);
				this.$refs.changeSVG.clearFiles();
			}
			reader.readAsText(file.raw)
		},
	},
	watch: {
		fieldOrder: {
			handler(){
				if(!this.loadSortedGroupFields){
					this.$store.dispatch('setFieldOrder', _.map(this.fieldOrder, 'field'))
				}
			},
			deep: false,
		},
		'$store.state.info.fieldOrder': {
			handler(){
				this.loadSortedGroupFields = true;
				this.fieldOrder = this.$store.getters['fieldOrder'].map((field, index) => {
					return { field, order: index + 1 };
				});
				this.$nextTick(() => {
					this.loadSortedGroupFields = false;
				});
			},
			deep: false,
		},
	},
}
</script>

<style scoped>
	.el-upload__tip {
		line-height: 1.1;
	}
	.group-field-name {
		width: auto;
		margin-left: 10px;
	}
</style>
<style>
	.pmbn-group-fields-draggable .el-form-item__label {
		cursor: move;
	}
</style>