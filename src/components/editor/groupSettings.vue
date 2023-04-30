<template>
	<el-form-item :label="$i18n('Is Apartment')">
		<el-switch
			v-model="group.isApartment"
			class="mt-2"
			style="margin-left: 24px"
			inline-prompt
			:active-icon="Check"
			:inactive-icon="Close"
		/>
	</el-form-item>
	<el-form-item :label="$i18n('Apartment name')">
		<el-input v-model="group.name" />
	</el-form-item>
	<template v-if="group.isApartment">
		<el-form-item :label="$i18n('Apartment images')">
			<gallery-field v-model="group.images" />
		</el-form-item>
	</template>
</template>

<script>
import galleryField from './galleryField.vue';
import { Check, Close } from '@element-plus/icons-vue';

export default {
	name: 'Editor',
	components: {galleryField},
	data: function(){
		return {};
	},
	computed: {
		group(){
			return this.$store.getters['selectedGroup'];
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