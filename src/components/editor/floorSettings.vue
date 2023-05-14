<template>
	<div class="floor-nav">
		<el-button-group>
			<el-button
				:disabled="$store.state.editor.activeFloor === 0"
				@click="$store.dispatch('setActiveFloor', ($store.state.editor.activeFloor - 1))"
			>
				<el-icon class="el-icon--left"><ArrowLeft /></el-icon>{{$i18n('Previous Floor')}}
			</el-button>
			<el-button
				:disabled="$store.state.editor.activeFloor >= $store.state.building.floors.length - 1"
				@click="$store.dispatch('setActiveFloor', ($store.state.editor.activeFloor + 1))"
			>
				{{$i18n('Next Floor')}}<el-icon class="el-icon--right"><ArrowRight /></el-icon>
			</el-button>
		</el-button-group>
	</div>
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
import { Check, Close, ArrowLeft, ArrowRight} from '@element-plus/icons-vue'

export default {
	name: 'Editor',
	components: {ArrowLeft, ArrowRight},
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
	.floor-nav {
		display: flex;
		justify-content: center;
		margin-bottom: 20px;
	}
</style>