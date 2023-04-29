<template>
	<template v-if="$store.getters['svgLoaded']">
		<el-form-item label="Level spacing">
			<el-slider v-model="$store.state.building.levelSpacing" :max="levelSpacingMax" @change="levelSpacingChanged" />
		</el-form-item>
		<el-form-item label="Space above">
			<el-input-number v-model="$store.state.building.spaceAbove" :step="1" />
		</el-form-item>
		<el-form-item label="Change SVG">
			<el-upload
				ref="changeSVG"
				action=""
				:limit="1"
				:before-upload="handleBeforeUpload"
				:on-success="handleSuccess"
				accept=".svg"
			>
				<template #trigger>
					<el-button type="primary">select file</el-button>
				</template>

				<template #tip>
					<div class="el-upload__tip">
						SVG files
					</div>
				</template>
			</el-upload>
		</el-form-item>
	</template>
	<template v-else="$store.getters['svgLoaded']">
		<el-form-item label="Load SVG">
			<el-upload
				ref="loadSVG"
				action=""
				:limit="1"
				:before-upload="handleBeforeUpload"
				:on-success="handleSuccess"
				accept=".svg"
			>
				<template #trigger>
					<el-button type="primary">select file</el-button>
				</template>

				<template #tip>
					<div class="el-upload__tip">
						SVG files
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
				this.$message.error('Only SVG files are allowed.')
			}
			return isSvg;
		},
		handleSuccess(response, file, fileList) {
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

</style>
