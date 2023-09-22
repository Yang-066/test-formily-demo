<template>
  <svg :class="svgClass" :style="sizeStyles" v-on="$listeners">
    <use :xlink:href="iconName" v-bind="$attrs" />
  </svg>
</template>

<script>
export default {
  name: 'SvgIcon',
  props: {
    name: {
      type: String,
      required: true
    },
    className: String,
    size: [String, Number, Object]
  },
  computed: {
    iconName () {
      return `#icon-${this.name}`
    },
    svgClass () {
      const defaultClassName = 'svg-icon'
      return this.className
        ? `${defaultClassName} ${this.className}`
        : defaultClassName
    },
    sizeStyles () {
      const haveSize = this.size ? `${this.size}px` : false
      let width
      let height
      if (this.size && typeof (this.size) === 'object') {
        width = this.size.width ? `${this.size.width}px` : false
        height = this.size.height ? `${this.size.height}px` : false
      }
      return {
        fontSize: haveSize,
        width: width || haveSize,
        height: height || haveSize
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  overflow: hidden;
}
</style>
