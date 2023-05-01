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
export default {
	name: 'Editor',
	components: {},
	data: function(){
		return {
			svgInput: null,
			levelSpacingMax: this.$store.getters['levelSpacing'] * 2,
		};
	},
	computed: {

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
