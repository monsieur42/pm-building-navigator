<template>
	<div class="pmbn-app-container">
		<viewer v-if="$store.getters['svgLoaded']" />
		<editor />
	</div>
</template>

<script>
import viewer from './components/viewer.vue'
import editor from './components/editor.vue'

export default {
	name: 'App',
	components: {
		viewer,
		editor
	},
	mounted(){

	},
	data(){
		return {
			saveTO: null,
		};
	},
	methods: {
		save(){
			clearTimeout(this.saveTO);
			this.saveTO = setTimeout(() => {
				let promises = [];
				this.$eventBus.emit('save', null, this.$store.getters['config'], promises);
			}, 1000);
		},
	},
	watch: {
		'$store.state.building': {
			handler(){
				this.save();
			},
			deep: true,
		},
		'$store.state.editor': {
			handler(){
				this.save();
			},
			deep: true,
		},
	},
}
</script>

<style>
	.pmbn-app-container {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	/* ELEMENT PLUS WP FIXES */
	.pmbn-app-container input.el-input__inner,
	.pmbn-app-container input.el-input__inner:focus {
		border: none;
		padding: 0px;
		outline: none;
		box-shadow: none;
	}
</style>
