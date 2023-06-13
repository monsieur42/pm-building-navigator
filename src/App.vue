<template>
	<div class="pmbn-app-container" ref="appContainer">
		<viewer v-if="$store.getters['svgLoaded']" :viewportDimensions="viewportDimensions"/>
		<div 
			class="pmbn-app-info-container"
			:class="{'-full': !$store.getters['svgLoaded'],'-responsive': infoWidth <= 800 }"
			:style="{
				width: infoWidth+'px',
				'min-width': infoWidth+'px',
				'max-width': infoWidth+'px',
			}"
		>
			<el-form-item :label="$i18n('Preview')" v-if="$store.getters['mode'] !== 'view' && $store.getters['svgLoaded']" class="pmbn-preview-toggle">
				<el-switch
					v-model="preview"
					class="ml-2"
					inline-prompt
					:active-text="$i18n('On')"
					:inactive-text="$i18n('Off')"
				/>
			</el-form-item>
			<editor v-if="$store.getters['mode'] === 'editor'" />
			<info v-else />
		</div>
	</div>
</template>

<script>
import viewer from './components/viewer.vue'
import editor from './components/editor.vue'
import info from './components/info.vue'

import computedDimensions from "vue-computed-dimensions";

export default {
	mixins: [computedDimensions('appContainer')],
	name: 'App',
	components: {
		viewer,
		editor,
		info
	},
	data(){
		return {
			saveTO: null,
			preview: false,
			breakView: false,
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
		setBreakView(val){
			this.breakView = val;
		},
	},
	computed: {
		appContainerDimensions(){
			return [this.appContainerWidth, this.appContainerHeight, this.appContainerX, this.appContainerY];
		},
		viewportDimensions(){
			let maxWidth = this.appContainerDimensions[0] * 0.4;
			let maxHeight = window.innerHeight * 0.9;

			if(maxWidth < 450){
				maxWidth = this.appContainerDimensions[0];
				this.setBreakView(true);
			}
			else {
				this.setBreakView(false);
			}

			let viewbox = [...this.$store.getters['viewbox']];
			viewbox[3] = parseInt(viewbox[3] )+ this.$store.getters['levelSpacing'] + this.$store.getters['spaceAbove'];

			const scale = Math.min(maxWidth / parseInt(viewbox[2]), maxHeight / parseInt(viewbox[3]));

			return [Math.round(parseInt(viewbox[2]) * scale), Math.round(parseInt(viewbox[3]) * scale)];
		},
		infoWidth(){
			return (this.breakView)? this.appContainerDimensions[0] : this.appContainerDimensions[0] - this.viewportDimensions[0];
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
		'$store.state.info': {
			handler(){
				this.save();
			},
			deep: true,
		},
		preview: {
			handler(){
				this.$store.dispatch('setMode', ((this.preview)? 'preview' : 'editor'));
			},
		},
		'$store.state.building.mainColor': {
			handler(newVal){
				document.documentElement.style.setProperty('--pmbn-color-primary', newVal);
				document.documentElement.style.setProperty('--el-color-primary', newVal);
				document.documentElement.style.setProperty('--swiper-navigation-color', newVal);
				document.documentElement.style.setProperty('--swiper-pagination-color', newVal);
				document.documentElement.style.setProperty('--swiper-theme-color', newVal);
			},
			deep: false,
		},
		'$store.state.info.soldStatusRowOpacity': {
			handler(newVal){
				document.documentElement.style.setProperty('--pmbn-sold-status-row-opacity', (newVal / 100));
			},
			deep: false,
		},
	},
	mounted(){
		document.documentElement.style.setProperty('--pmbn-color-primary', this.$store.state.building.mainColor);
		document.documentElement.style.setProperty('--el-color-primary', this.$store.state.building.mainColor);
		document.documentElement.style.setProperty('--swiper-navigation-color', this.$store.state.building.mainColor);
		document.documentElement.style.setProperty('--swiper-pagination-color', this.$store.state.building.mainColor);
		document.documentElement.style.setProperty('--swiper-theme-color', this.$store.state.building.mainColor);

		document.documentElement.style.setProperty('--pmbn-sold-status-row-opacity', (this.$store.state.info.soldStatusRowOpacity / 100));
	},
}
</script>

<style>
	.pmbn-app-container {
		width: 100%;
		max-width: 100%;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		flex-wrap: wrap;
	}
	.pmbn-app-info-container.-full {
		width: 100%;
	}

	.pmbn-app-container .pmbn-m2,
	.pmbn-app-container .pmbn-price-suffix {
		display: inline-block;
		margin: 0px 10px;
	}
	.pmbn-price .el-input:not(:last-child),
	.pmbn-price .el-input-number:not(:last-child) {
		margin-bottom: 5px;
	}
	.el-form-item__label:not(.pmbn-preview-toggle .el-form-item__label) {
		width: 150px;
	}
	.el-overlay-dialog {
		padding: 20px;
	}
	.el-dialog {
		max-width: 1000px;
		--el-dialog-title-font-size: 30px;
	}
	.el-dialog__title {
		font-weight: bold;
	}

	/* ELEMENT PLUS WP FIXES */
	.pmbn-app-container input.el-input__inner,
	.pmbn-app-container input.el-input__inner:focus,
	.pmbn-app-container input.el-select__input,
	.pmbn-app-container input.el-select__input:focus {
		border: none;
		padding: 0px;
		outline: none;
		box-shadow: none;
		background-color: #fff;
	}
	body .el-overlay {
		z-index: 999999 !important;
	}
	.el-button,
	a.el-button {
		text-decoration: none;
		color: var(--el-button-text-color);
	}
	a.el-button.is-plain {
		--el-button-hover-text-color: var(--el-color-primary);
	}

</style>