<template>
	<g class="pmbn-group" :class="{'-selected': isSelected}" v-html="group.svg" @click="selectGroup"></g>
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
		isSelected(){
			return this.$store.state.editor.selectedGroup && 
				this.$store.state.editor.selectedGroup.floor === this.floor && 
				this.$store.state.editor.selectedGroup.group === this.index;
		},
	},
	methods: {
		selectGroup(){
			this.$store.dispatch('selectGroup', {floor: this.floor, group: this.index});
			this.$store.dispatch('setActiveTab', 'apartment');
		},
	}
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
	.pmbn-group.-selected,
	.pmbn-group.-selected:hover {
		filter: brightness(0.75);
	}
</style>
