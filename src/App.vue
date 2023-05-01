<template>
	<div class="pmbn-app-container">
		<viewer v-if="$store.getters['svgLoaded']" />
		<div class="pmbn-app-info-container" :class="{'-full': !$store.getters['svgLoaded'] }">
			<el-form-item :label="$i18n('Preview')" v-if="$store.getters['mode'] !== 'view'">
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

export default {
	name: 'App',
	components: {
		viewer,
		editor,
		info
	},
	mounted(){

	},
	data(){
		return {
			saveTO: null,
			preview: false,
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
		preview: {
			handler(){
				this.$store.dispatch('setMode', ((this.preview)? 'preview' : 'editor'));
			},
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
	.pmbn-app-info-container {
		width: 600px;
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
	.el-form-item__label {
		width: 150px;
	}

	/* ELEMENT PLUS WP FIXES */
	.pmbn-app-container input.el-input__inner,
	.pmbn-app-container input.el-input__inner:focus {
		border: none;
		padding: 0px;
		outline: none;
		box-shadow: none;
		background-color: #fff;
	}
	body .el-overlay {
		z-index: 999999 !important;
	}
</style>
