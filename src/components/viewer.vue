<template>
	<div 
		class="pmbn-viewer-container" 
		:style="{
			width: viewportDimensions[0]+'px',
			height: viewportDimensions[1]+'px',
			'max-width': viewportDimensions[0]+'px',
			'max-height': viewportDimensions[1]+'px',
			'min-width': viewportDimensions[0]+'px',
			'min-height': viewportDimensions[1]+'px',
		}"
	>
		<svg 
			:viewBox="viewbox" 
			width="100%" 
			height="100%" 
			version="1.1" 
			xmlns="http://www.w3.org/2000/svg" 
			xmlns:xlink="http://www.w3.org/1999/xlink" 
			xml:space="preserve" 
			v-if="$store.getters['floors'].length > 0"
			:style="cssVariables"
		>
			<template v-html="$store.getters['additionalSVG']"></template>
			<floor v-for="(floor, index) in $store.getters['floors']" :index="index" :key="index" />
			<floor v-for="(floor, index) in $store.getters['floors']" :index="index" :key="index" />
		</svg>
	</div>
</template>

<script>
import floor from './viewer/floor.vue';

export default {
	name: 'Viewer',
	components: {floor},
	props: ['viewportDimensions'],
	computed: {
		viewbox(){
			let viewbox = [...this.$store.getters['viewbox']];
			
			viewbox[3] = parseInt(viewbox[3]) + this.$store.getters['levelSpacing'] + this.$store.getters['spaceAbove'];

			return viewbox.join(' ');
		},
		cssVariables(){
			return {
				'--pmbn-level-above': this.$store.getters['spaceAbove']+'px',
				'--pmbn-level-spacing': (this.$store.getters['levelSpacing'] + this.$store.getters['spaceAbove'])+'px',
			};
		},
		
	},
	mounted(){

	},
}
</script>

<style scoped>
	.pmbn-viewer-container svg {
		width: 100%;
		height: auto;
		-webkit-tap-highlight-color: transparent;
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}
	.pmbn-viewer-container svg:focus {
		outline: none !important;
	}
	@media only screen and (max-width: 1024px) {
		.pmbn-viewer-container {
			width: 100%;
			flex: auto;
		}
	}
</style>
