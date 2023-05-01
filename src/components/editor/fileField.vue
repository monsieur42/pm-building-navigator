<template>
	<div class="pmbn-file-item" v-if="file">
		<el-icon size="20"><Document /></el-icon>
		<span>{{file.filename}}</span>
		<el-button class="pmbn-file-item-delete" type="danger" circle @click="deleteItem()" ><el-icon ><Delete /></el-icon></el-button>
	</div>
	<div class="pmbn-file-add-wrapper" v-else >
		<el-button plain @click="addFile" ><el-icon><DocumentAdd /></el-icon>{{$i18n('Add file')}}</el-button>
	</div>
</template>

<script>
import {DocumentAdd, Document, Delete} from '@element-plus/icons-vue';

export default {
	name: 'fileField',
	components: {DocumentAdd, Document, Delete},
	props: ['modelValue'],
	emits: ['update:modelValue'],
	data: function(){
		return {
			file: this.modelValue,
			load: false,
		};
	},
	computed: {

	},
	methods: {
		addFile(){
			let payload = {
				promise: null,
			};
			this.$eventBus.emit('addFile', null, payload);

			if(payload.promise){
				payload.promise.then((file) => {
					this.file = file;
				});
			}
		},
		deleteItem(){
			this.file = null;
		},
	},
	watch: {
		file: {
			handler(){
				if(!this.load){
					this.$emit('update:modelValue', this.file);
				}
			},
			deep: true,
		},
		modelValue: {
			handler(){
				this.load = true;
				this.file = this.modelValue;
				this.$nextTick(() => {
					this.load = false;
				});
			},
			deep: true,
		},
	},
}
</script>

<style scoped>
	.pmbn-file-item {
		width: 100%;
		display: flex;
		justify-content: flex-start;
		align-items: center;
		align-content: center;
		flex-wrap: wrap;
		gap: 10px;
		margin-bottom: 10px;
		border: 1px solid #cfcfcf;
		padding: 5px 50px 5px 15px;
		position: relative;
	}
	.pmbn-file-item-delete {
		position: absolute;
		right: 5px;
		visibility: hidden;
		user-select: none;
		cursor: pointer;
	}
	.pmbn-file-item:hover .pmbn-file-item-delete {
		visibility: visible;
	}
	.pmbn-file-add-wrapper {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1px dashed #cfcfcf;
		padding: 10px;
	}
</style>
