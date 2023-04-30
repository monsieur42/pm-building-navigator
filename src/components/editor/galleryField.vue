<template>
	<draggable
		class="pmbn-gallery-items"
		:component-data="{
			type: 'transition-group',
			name: !drag ? 'flip-list' : null
		}"
		v-model="images"
		v-bind="dragOptions"
		@start="drag = true"
		@end="drag = false"
		item-key="order"
	>
		<template #item="{ element }">
			<div class="pmbn-gallery-item" :style="{'background-image': 'url(\''+imageItemBg(element.image)+'\')'}">
				<el-button class="pmbn-gallery-item-delete" type="danger" circle @click="deleteItem(element.order)" ><el-icon ><Delete /></el-icon></el-button>
			</div>
		</template>
	</draggable>
	<div class="pmbn-gallery-add-wrapper">
		<el-button plain @click="addImages" ><el-icon><Picture /></el-icon>{{$i18n('Add images')}}</el-button>
	</div>
</template>

<script>
import {Picture, Delete} from '@element-plus/icons-vue';
import draggable from "vuedraggable";
import _ from 'lodash';

export default {
	name: 'GalleryField',
	components: {Picture, Delete, draggable},
	props: ['modelValue'],
	emits: ['update:modelValue'],
	data: function(){
		return {
			images: this.modelValue.map((image, index) => {
				return { image, order: index + 1 };
			}),
			drag: false,
			load: false,
		};
	},
	computed: {
		dragOptions() {
			return {
				animation: 200,
				group: "description",
				disabled: false,
				ghostClass: "ghost"
			};
		},
		orderedImages(){
			return _.map(this.images, 'image')
		},
	},
	methods: {
		addImages(){
			let payload = {promise: null};
			this.$eventBus.emit('addImage', null, payload);

			if(payload.promise){
				payload.promise.then((images) => {
					_.forEach(images, (image, index) => {
						this.images.push({
							image,
							order: index + 1 + this.images.length
						});
					});
				});
			}
		},
		deleteItem(itemPos){
			_.remove(this.images, (i) => i.order === itemPos);
		},
		sort() {
			this.images = this.images.sort((a, b) => a.order - b.order);
		},
		imageItemBg(image){
			return (image.sizes && image.sizes.thumbnail)? image.sizes.thumbnail.url : image.url;
		},
	},
	watch: {
		images: {
			handler(){
				if(!this.load){
					this.$emit('update:modelValue', this.orderedImages);
				}
			},
			deep: true,
		},
		modelValue: {
			handler(){
				this.load = true;
				this.images = this.modelValue.map((image, index) => {
					return { image, order: index + 1 };
				});
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
	.pmbn-gallery-items {
		width: 100%;
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		align-content: flex-start;
		flex-wrap: wrap;
		gap: 10px;
		margin-bottom: 10px;
	}
	.pmbn-gallery-item {
		position: relative;
		width: calc(25% - (3 * 10px / 4));
		border: 1px solid #cfcfcf;
		background-size: cover;
		background-position: 50% 50%;
		cursor: move;
		user-select: none;
		box-sizing: border-box;
	}
	.pmbn-gallery-item::before {
		content: '';
		display: block;
		padding-top: 100%;
	}
	.pmbn-gallery-item.ghost {
		border: 1px dashed #cfcfcf;
		background-color: #f1f1f1;
		background-image: none !important;
	}
	.pmbn-gallery-add-wrapper {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1px dashed #cfcfcf;
		padding: 10px;
	}
	.pmbn-gallery-item-delete {
		position: absolute;
		top: 5px;
		right: 5px;
		visibility: hidden;
		user-select: none;
	}
	.pmbn-gallery-item:hover .pmbn-gallery-item-delete {
		visibility: visible;
	}
</style>
