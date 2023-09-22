
import Vue from 'vue'
import SvgIcon from '@/components/svg/index'// svg组件

Vue.component('svg-icon', SvgIcon)

const req = require.context('./', true, /\.svg$/)
req.keys().map(req)
