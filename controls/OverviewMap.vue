<script>
import { createSize } from '../base/factory.js'
import commonMixin from '../base/mixins/common.js'
import bindEvents from '../base/bindEvent.js'
import { generateOptions } from '../base/util.js'

export default {
  name: 'bm-overview-map',
  mixins: [commonMixin('control')],
  render() { },
  props: {
    anchor: {
      type: String
    },
    offset: {
      type: Object
    },
    size: {
      type: Object
    },
    isOpen: {
      type: Boolean
    }
  },
  watch: {
    anchor() {
      this.reload()
    },
    offset() {
      this.reload()
    },
    size() {
      this.reload()
    },
    isOpen() {
      this.reload()
    }
  },
  methods: {
    load() {
      if (this._BMap().type == "webgl") {
        console.warn("webgl 版本不支持 bm-overview-map!");
        return;
      }
      const { BMap, map, isOpen, size, offset, anchor } = this
      const mapTypes = []
      this.mapTypes && this.mapTypes.forEach(item => {
        mapTypes.push(global[item])
      })
      const options = generateOptions({
        anchor: global[anchor],
        offset: createSize(BMap, offset),
        size: createSize(BMap, size),
        isOpen
      })
      this.originInstance = new BMap.OverviewMapControl(options)
      bindEvents.call(this, this.originInstance)
      map.addControl(this.originInstance)
    }
  }
}
</script>
