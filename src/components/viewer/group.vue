<template>
	<g class="pmbn-group" :class="{'-selected': isSelected, '-highlighted': isHighlighted, '-hoverable': isHoverable}" v-html="group.svg" @click="selectGroup" @mouseenter="highlightGroup"></g>
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
		floorObj(){
			return this.$store.getters['floor'](this.floor);
		},
		isSelected(){
			return this.$store.state.mode === 'editor' &&
				this.$store.state.editor.selectedGroup && 
				this.$store.state.editor.selectedGroup.floor === this.floor && 
				this.$store.state.editor.selectedGroup.group === this.index;
		},
		isHighlighted(){
			return this.$store.state.mode !== 'editor' &&
				this.$store.state.editor.selectedGroup && 
				this.$store.state.editor.selectedGroup.floor === this.floor && 
				this.$store.state.editor.selectedGroup.group === this.index;
		},
		isHoverable(){
			if(this.$store.state.mode === 'editor'){
				return true;
			}
			
			return this.group.isApartment;
		},
	},
	methods: {
		selectGroup(){
			if(!this.floorObj.passive && this.$store.state.mode === 'editor'){
				this.$store.dispatch('selectGroup', {floor: this.floor, group: this.index});
				this.$store.dispatch('setActiveTab', 'apartment');
			}
		},
		highlightGroup(){
			if(!this.floorObj.passive && this.$store.state.mode !== 'editor' && this.group.isApartment){
				this.$store.dispatch('selectGroup', {floor: this.floor, group: this.index});
			}
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
	.pmbn-floor:not(.-passive) .pmbn-group.-hoverable.-highlighted,
	.pmbn-floor:not(.-passive) .pmbn-group.-hoverable:hover {
		filter: brightness(0.85);
	}
	.pmbn-group.-selected,
	.pmbn-group.-selected:hover {
		filter: brightness(0.75);
	}
</style>
