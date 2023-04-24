<template>
	<div class="pmbn-editor-container">
		<el-tabs v-model="$store.state.editor.activeTab" class="demo-tabs">
			<el-tab-pane label="General" name="general">
				<el-form-item label="Level spacing">
					<el-slider v-model="$store.state.building.levelSpacing" :max="levelSpacingMax" @change="levelSpacingChanged" />
				</el-form-item>
			</el-tab-pane>

			<el-tab-pane label="Floor" name="floor" v-if="floor">
				<el-form-item label="Floor name">
					<el-input v-model="floor.name" />
				</el-form-item>
			</el-tab-pane>

			<el-tab-pane label="Apartment" name="apartment" v-if="group">
				<el-form-item label="Apartment name">
					<el-input v-model="group.name" />
				</el-form-item>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
export default {
	name: 'Editor',
	components: {},
	data: function(){
		return {
			levelSpacingMax: this.$store.getters['levelSpacing'] * 2,
		};
	},
	computed: {
		floor(){
			return this.$store.getters['activeFloor'];
		},
		group(){
			return this.$store.getters['selectedGroup'];
		},
	},
	methods: {
		levelSpacingChanged(){
			this.levelSpacingMax = this.$store.getters['levelSpacing'] * 2;
		},
	},
}
</script>

<style scoped>
	.pmbn-editor-container {
		width: 600px;
		background-color: #fff;
		padding: 20px;
		border: 1px solid #c3c4c7;
	}
</style>
