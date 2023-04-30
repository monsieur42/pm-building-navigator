<template>
	<div class="pmbn-editor-container">
		<el-tabs v-model="$store.state.editor.activeTab" class="demo-tabs">
			<el-tab-pane :label="$i18n('General', 'settings')" name="general">
				<general-settings />
			</el-tab-pane>

			<el-tab-pane :label="$i18n('Floor')" name="floor" v-if="$store.getters['activeFloor']">
				<floor-settings />
			</el-tab-pane>

			<el-tab-pane :label="$i18n('Apartment')" name="apartment" v-if="$store.getters['selectedGroup']">
				<group-settings />
			</el-tab-pane>
		</el-tabs>
	</div>
</template>

<script>
import generalSettings from './editor/generalSettings.vue';
import floorSettings from './editor/floorSettings.vue';
import groupSettings from './editor/groupSettings.vue';

export default {
	name: 'Editor',
	components: {generalSettings, floorSettings, groupSettings},
	data: function(){
		return {
			
		};
	},
	computed: {
		
	},
	methods: {
		
	},
}
</script>

<style scoped>
	.pmbn-editor-container {
		width: 100%;
		background-color: #fff;
		padding: 20px;
		border: 1px solid #c3c4c7;
		box-sizing: border-box;
	}
	.el-button .el-icon {
		margin-right: 10px;
	}
</style>
