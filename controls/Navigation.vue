<script>
import commonMixin from '../base/mixins/common.js'
import { createSize } from '../base/factory.js'
import { generateOptions } from '../base/util.js'

export default {
  name: 'bm-navigation',
  render() { },
  mixins: [commonMixin('control')],
  props: {
    anchor: {
      type: String
    },
    offset: {
      type: Object
    },
    type: {
      type: String
    },
    showZoomInfo: {
      type: Boolean
    },
    enableGeolocation: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    anchor() {
      this.reload()
    },
    offset() {
      this.reload()
    },
    type() {
      this.reload()
    },
    showZoomInfo() {
      this.reload()
    }
  },
  methods: {
    load() {
      const { BMap, map, anchor, offset, type, showZoomInfo, enableGeolocation } = this
      const options = generateOptions({
        anchor: global[anchor],
        offset: offset && createSize(BMap, offset),
        type: global[type],
        showZoomInfo,
        enableGeolocation
      })
      this.originInstance = new BMap.NavigationControl(options)
      map.addControl(this.originInstance)
    }
  }
}
</script>
