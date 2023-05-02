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
				<el-form-item :label="($store.getters['groupFieldNames']($i18n)[groupField])? $store.getters['groupFieldNames']($i18n)[groupField] : groupField" v-for="(groupField, gfindex) in groupFields" :key="gfindex">
					<el-tooltip effect="dark" :content="$i18n('Display in table column')" placement="top" :hide-after="0">
						<el-button 
							:type="($store.getters['infoTableColumns'].includes(groupField))? 'success' : 'default' " 
							circle 
							@click="$store.dispatch('toggleInfoTableColumn', groupField)"
						>
							<el-icon><Grid /></el-icon>
						</el-button>
					</el-tooltip>
					<el-tooltip effect="dark" :content="$i18n('Display apartment details')" placement="top" :hide-after="0">
						<el-button 
							:type="($store.getters['infoDetailsFields'].includes(groupField))? 'success' : 'default' " 
							circle
							@click="$store.dispatch('toggleInfoDetailsField', groupField)"
						>
							<el-icon><Tickets /></el-icon>
						</el-button>
					</el-tooltip>
					<el-tooltip effect="dark" :content="$i18n('Display as filter option')" placement="top" :hide-after="0">
						<el-button 
							:type="($store.getters['infoFilterFields'].includes(groupField))? 'success' : 'default' " 
							circle 
							@click="$store.dispatch('toggleInfoFilterField', groupField)"
						>
							<el-icon><Operation /></el-icon>
						</el-button>
					</el-tooltip>
				</el-form-item>
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

export default {
	name: 'Editor',
	components: {Grid, Tickets, Operation},
	data: function(){
		return {
			svgInput: null,
			levelSpacingMax: this.$store.getters['levelSpacing'] * 2,
		};
	},
	computed: {
		groupFields(){
			const exludeProps = ['svg', 'selected', 'isApartment'];
			let fields = _.difference(_.keys(this.$store.getters['defaultGroup']()), exludeProps);
			fields.push('floor');
			fields.push('floorIndex');
			return fields;
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
}
</script>

<style scoped>
	.el-upload__tip {
		line-height: 1.1;
	}
</style>
