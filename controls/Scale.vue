<script>
import commonMixin from '../base/mixins/common.js'
import { createSize } from '../base/factory.js'

export default {
  name: 'bm-scale',
  render() { },
  mixins: [commonMixin('control')],
  props: {
    anchor: {
      type: String
    },
    offset: {
      type: Object
    }
  },
  watch: {
    anchor() {
      this.reload()
    },
    offset() {
      this.reload()
    }
  },
  methods: {
    load() {
      const { BMap, map, anchor, offset } = this
      if (this._BMap().type == "webgl") {
        this.originInstance = new BMap.ScaleControl()
        map.addControl(this.originInstance)
      } else {
        this.originInstance = new BMap.ScaleControl({
          anchor: global[anchor],
          offset: offset && createSize(BMap, offset)
        })
        map.addControl(this.originInstance)
      }
    }
  }
}
</script>
