<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
import commonMixin from '../base/mixins/common.js'
import { createSize } from '../base/factory.js'

const defaultAnchor = global['BMAP_ANCHOR_TOP_LEFT'] // 默认左上角
const defaultOffset = { width: 0, height: 0 }  // 默认不偏移（webgl版本必须加上，不能是undefined\null）

export default {
  name: 'bm-control',
  mixins: [commonMixin('control')],
  props: ['anchor', 'offset'],
  watch: {
    anchor(val, oldValue) {
      const anchor = val ? global[val] : global[oldValue]
      this.originInstance.setAnchor(anchor)
    },
    offset: {
      handler(val, oldValue) {
        const { BMap } = this
        const offset = val ? createSize(BMap, val) : createSize(BMap, oldValue)
        this.originInstance.setOffset(offset)
      },
      deep: true, // 监听对象
    }
  },
  methods: {
    load() {
      const { BMap, map, anchor, offset, $el } = this
      function CustomControl(options) {
        this.defaultAnchor = options.anchor ? global[options.anchor] : defaultAnchor
        this.defaultOffset = options.offset ? createSize(BMap, options.offset) : createSize(BMap, defaultOffset)
      }
      CustomControl.prototype = new BMap.Control()
      CustomControl.prototype.initialize = (map) => map.getContainer().appendChild($el)
      this.originInstance = new CustomControl({ anchor, offset })
      map.addControl(this.originInstance)
    },
  }
}
</script>
