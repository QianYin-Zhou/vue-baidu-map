<template>
  <div v-show="visible">
    <slot></slot>
  </div>
</template>

<script>
import commonMixin from '../base/mixins/common.js'
import bindEvents from '../base/bindEvent.js'
import { createSize } from '../base/factory.js'
import { generateOptions } from '../base/util.js'

export default {
  name: 'bm-info-window',
  mixins: [commonMixin('overlay')],
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Boolean
    },
    position: {
      type: Object
    },
    title: {
      type: String
    },
    width: {
      type: Number
    },
    height: {
      type: Number
    },
    maxWidth: {
      type: Number
    },
    offset: {
      type: Object
    },
    maximize: {
      type: Boolean
    },
    autoPan: {
      type: Boolean
    },
    closeOnClick: {
      type: Boolean,
      default: true
    },
    message: {
      type: String
    }
  },
  data() {
    return {
      visible: false,
    }
  },
  computed: {
    visibleChange() {
      return `${this.visible}-${this.position.lng},${this.position.lat}`
    }
  },
  watch: {
    value: {
      handler(val) {
        this.visible = val;
      },
      immediate: true,
    },
    visibleChange: {
      handler() {
        this.reload();
      },
    },
    'offset.width'(val, oldVal) {
      this.reload()
    },
    'offset.height'(val) {
      this.reload()
    },
    maxWidth() {
      this.reload()
    },
    width(val) {
      this.originInstance.setWidth(val)
    },
    height(val) {
      this.originInstance.setHeight(val)
    },
    title(val) {
      this.originInstance.setTitle(val)
    },
    maximize(val) {
      val ? this.originInstance.enableMaximize() : this.originInstance.disableMaximize()
    },
    autoPan(val) {
      val ? this.originInstance.enableAutoPan() : this.originInstance.disableAutoPan()
    },
    closeOnClick(val) {
      val ? this.originInstance.enableCloseOnClick() : this.originInstance.disableCloseOnClick()
    }
  },
  methods: {
    redraw() {
      this.originInstance.redraw()
    },
    load() {
      const { BMap, map, visible, title, width, height, maxWidth, offset, autoPan, closeOnClick, message, maximize, bindObserver, $parent } = this
      const $content = this.$el
      const overlay = new BMap.InfoWindow($content, generateOptions({
        width,
        height,
        title,
        maxWidth,
        offset: offset ? createSize(BMap, offset) : undefined,
        enableAutoPan: autoPan,
        enableCloseOnClick: closeOnClick,
        // 注释原因：webgl不支持enableMessage、message
        // enableMessage: typeof message === 'undefined',
        // message
      }));

      maximize ? overlay.enableMaximize() : overlay.disableMaximize()
      bindEvents.call(this, overlay)
      this.originInstance = overlay
      this.originInstance.redraw();
      [].forEach.call($content.querySelectorAll('img'), $img => {
        $img.onload = () => overlay.redraw()
      })
      bindObserver()
      this.$container = $parent.originInstance && $parent.originInstance.openInfoWindow ? $parent.originInstance : map
      visible && this.openInfoWindow()
    },
    bindObserver() {
      const MutationObserver = global.MutationObserver
      if (!MutationObserver) {
        return
      }
      const { $el, originInstance } = this
      this.observer = new MutationObserver(mutations => originInstance.redraw())
      this.observer.observe($el, { attributes: true, childList: true, characterData: true, subtree: true })
    },
    openInfoWindow() {
      const { $container, position, originInstance } = this
      $container.openInfoWindow(originInstance, { ...position })
    },
    closeInfoWindow() {
      this.$container.closeInfoWindow(this.originInstance)
    },
  }
}
</script>
