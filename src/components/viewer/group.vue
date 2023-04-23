<template>
	<g class="pmbn-group" v-html="group.svg"></g>
</template>

<script>
export default {
	name: 'Group',
	components: {},
	props: ['floor','index'],
	mounted(){
		
	},
	computed: {
		group(){
			return this.$store.getters['group'](this.floor, this.index);
		},
	},
}
</script>

<style scoped>
	.pmbn-group {
		-webkit-transition: all 300ms ease-out;
		-moz-transition: all 300ms ease-out;
		-ms-transition: all 300ms ease-out;
		-o-transition: all 300ms ease-out;
		transition: all 300ms ease-out;
		cursor: pointer;
	}
	.pmbn-group:hover {
		filter: brightness(0.85);
	}
</style>
