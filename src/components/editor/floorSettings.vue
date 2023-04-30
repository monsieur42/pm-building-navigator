<template>
	<el-form-item :label="$i18n('Passive')">
		<el-switch
			v-model="floor.passive"
			class="mt-2"
			style="margin-left: 24px"
			inline-prompt
			:active-icon="Check"
			:inactive-icon="Close"
		/>
	</el-form-item>

	<el-form-item :label="$i18n('Floor name')">
		<el-input v-model="floor.name" />
	</el-form-item>
</template>

<script>
import { Check, Close } from '@element-plus/icons-vue'

export default {
	name: 'Editor',
	components: {},
	data: function(){
		return {

		};
	},
	computed: {
		floor(){
			return this.$store.getters['activeFloor'];
		},
		Check(){
			return Check;
		},
		Close(){
			return Close;
		},
	},
	methods: {
		
	},
}
</script>

<style scoped>
	
</style>