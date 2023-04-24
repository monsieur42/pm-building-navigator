<template>
	<div class="pmbn-app-container">
		<viewer />
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
