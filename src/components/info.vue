<template>
	<div class="pmbn-info-container">
		<el-table :data="properties" style="width: 100%" max-height="250">
			<el-table-column prop="name" label="Name">
				<template #default="scope">
					<div style="display: flex; align-items: center;">
						<el-icon style="cursor: pointer;" @click="openPopup(scope.$index)" ><View /></el-icon>
						<span style="margin-left: 10px">{{ scope.row.name }}</span>
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="floor" label="Floor"  />
		</el-table>

		<el-dialog
			v-for="(property, index) in properties"
			:key="index"
			:model-value="openedDialog === index"
			:title="property.name"
			width="30%"
		>
			<span>This is a message</span>
			<template #footer>
				<span class="dialog-footer">
					<el-button @click="openedDialog = null">Close</el-button>
				</span>
			</template>
		</el-dialog>
	</div>
</template>

<script>
import {View} from '@element-plus/icons-vue';

export default {
	name: 'Info',
	components: {View},
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
		openPopup(propIndex){
			this.openedDialog = propIndex;
		},
	},
}
</script>

<style scoped>
	.pmbn-info-container {
		width: 100%;
	}
</style>
