<template>
	<el-form-item :label="$i18n('Is Apartment')">
		<el-switch
			v-model="group.isApartment"
			class="mt-2"
			style="margin-left: 24px"
			inline-prompt
			:active-icon="Check"
			:inactive-icon="Close"
		/>
	</el-form-item>
	<el-form-item :label="$i18n('Apartment name')">
		<el-input v-model="group.name" />
	</el-form-item>
	<template v-if="group.isApartment">
		<el-form-item :label="$i18n('Number of rooms')">
			<el-input-number v-model="group.rooms" :step="0.5" :step-strictly="true" :min="0"/>
		</el-form-item>
		<el-form-item :label="$i18n('Living area')">
			<el-input-number v-model="group.living_area" :min="0" :precision="2" /><span class="pmbn-m2">m<sup>2</sup></span>
		</el-form-item>
		<el-form-item :label="$i18n('Garden')">
			<el-input-number v-model="group.garden" :min="0" :precision="2" /><span class="pmbn-m2">m<sup>2</sup></span>
		</el-form-item>
		<el-form-item :label="$i18n('Terrace')">
			<el-input-number v-model="group.terrace" :min="0" :precision="2" /><span class="pmbn-m2">m<sup>2</sup></span>
		</el-form-item>
		<el-form-item :label="$i18n('Balcony')">
			<el-input-number v-model="group.balcony" :min="0" :precision="2" /><span class="pmbn-m2">m<sup>2</sup></span>
		</el-form-item>
		<el-form-item :label="$i18n('Sale price')">
			<el-row class="pmbn-price">
				<el-input-number v-model="group.sale_price" :min="0" :precision="2"/>
				<span class="pmbn-price-suffix">{{$store.state.info.currency}}</span>
			</el-row>
		</el-form-item>
		<el-form-item :label="$i18n('Rent price')">
			<el-row class="pmbn-price">
				<el-input-number v-model="group.rent_price" :min="0" :precision="2"/>
				<span class="pmbn-price-suffix">{{$store.state.info.currency}} / {{$store.state.info.rentPricePeriod}}</span>
			</el-row>
		</el-form-item>
		<el-form-item :label="$i18n('Overheads')">
			<el-row class="pmbn-price">
				<el-input-number v-model="group.rent_overheads" :min="0" :precision="2"/>
				<span class="pmbn-price-suffix">{{$store.state.info.currency}} / {{$store.state.info.rentPricePeriod}}</span>
			</el-row>
		</el-form-item>
		<el-form-item :label="$i18n('Available from')">
			<el-date-picker v-model="group.available_from" type="date"/>
		</el-form-item>
		<el-form-item :label="$i18n('Status')">
			<el-select
				v-model="group.status"
				filterable
				allow-create
				default-first-option
				:reserve-keyword="false"
			>
				<el-option
					v-for="(item, oi) in $store.getters['groupStatuses']"
					:key="oi"
					:label="item"
					:value="item"
				/>
			</el-select>
		</el-form-item>
		<el-form-item :label="$i18n('Registration URL')">
			<el-input v-model="group.registration_url">
				<template #prepend><el-icon><Link /></el-icon></template>
			</el-input>
		</el-form-item>
		<el-form-item :label="$i18n('Fact sheet')">
			<file-field v-model="group.factsheet" />
		</el-form-item>
		<el-form-item :label="$i18n('Apartment images')">
			<gallery-field v-model="group.images" />
		</el-form-item>

	</template>
	<div class="pmbn-clipboard-container">
		<el-tooltip
			effect="dark"
			:content="$i18n('Copy Apartment Data')"
			placement="top"
		>
			<el-button size="small" @click="copyGroup()">{{$i18n('Copy')}}</el-button>
		</el-tooltip>
		
		<el-tooltip
			effect="dark"
			:content="$i18n('Paste Apartment Data')"
			placement="top"
			v-if="$store.getters['clipboard'] && $store.getters['clipboard'].type === 'group'"
		>
			<el-button size="small" @click="pasteGroup()">{{$i18n('Paste')}}</el-button>
		</el-tooltip>
		<span class="clipboard-message" v-if="clipboardMessage"><el-icon><CircleCheck /></el-icon> {{clipboardMessage}}</span>
	</div>
</template>

<script>
import galleryField from './galleryField.vue';
import fileField from './fileField.vue';
import { Check, Close, Link, CircleCheck} from '@element-plus/icons-vue';

export default {
	name: 'Editor',
	components: {galleryField, fileField, Link, CircleCheck},
	data: function(){
		return {
			clipboardMessage: null,
			clipboardMessageTO: null,
		};
	},
	computed: {
		group(){
			return this.$store.getters['selectedGroup'];
		},
		Check(){
			return Check;
		},
		Close(){
			return Close;
		},
	},
	methods: {
		copyGroup(){
			this.$store.dispatch('copyToClipboard', {type: 'group', data: this.group});
			this.clipboardMessage = this.$i18n('Apartment copied on clipboard.');

			clearTimeout(this.clipboardMessageTO);
			this.clipboardMessageTO = setTimeout(() => {
				this.clipboardMessage = null;
				this.clipboardMessageTO = null;
			}, 1500);
		},
		pasteGroup(){
			this.$store.dispatch('pasteClipboardToGroup', this.group);
			this.clipboardMessage = this.$i18n('Clipboard data pasted into apartment.');
			
			clearTimeout(this.clipboardMessageTO);
			this.clipboardMessageTO = setTimeout(() => {
				this.clipboardMessage = null;
				this.clipboardMessageTO = null;
			}, 1500);
		},
	},
}
</script>

<style scoped>
	.clipboard-message {
		display: inline-block;
		margin-left: 5px;
		color: var(--el-color-success);
	}

</style>