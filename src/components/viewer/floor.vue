<template>
	<g class="pmbn-floor" :class="{'-opened': $store.getters['isOpenedFloor'](index)}" @mouseenter="mouseEnter">
		<group v-for="(group, g_index) in floor.groups" :index="g_index" :floor="index" :key="g_index" />
	</g>
</template>

<script>
import group from './group.vue';

export default {
	name: 'Floor',
	components: {group},
	props: ['index'],
	mounted(){
		
	},
	computed: {
		floor(){
			return this.$store.getters['floor'](this.index);
		},
	},
	methods: {
		mouseEnter(){
			this.$store.dispatch('setActiveFloor', this.index);
		},
	}
}
</script>

<style scoped>
	.pmbn-floor {
		transform: translateY(var(--pmbn-level-spacing));
		-webkit-transition: all 500ms ease-out;
		-moz-transition: all 500ms ease-out;
		-ms-transition: all 500ms ease-out;
		-o-transition: all 500ms ease-out;
		transition: all 500ms ease-out;
	}
	.pmbn-floor.-opened {
		transform: translateY(0px);
	}
</style>
