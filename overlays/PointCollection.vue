<script>
import commonMixin from '../base/mixins/common.js'
import bindEvents from '../base/bindEvent.js'
import { createPoint } from '../base/factory.js'
import { generateOptions } from '../base/util.js'

export default {
  render() { },
  name: 'bm-point-collection',
  mixins: [commonMixin('overlay')],
  props: {
    points: {
      type: Array,
      default() {
        return []
      }
    },
    shape: {
      type: String,
      default: 'BMAP_POINT_SHAPE_CIRCLE'
    },
    color: {
      type: String
    },
    size: {
      type: String,
      default: 'BMAP_POINT_SIZE_NORMAL'
    }
  },
  watch: {
    shape(val) {
      const { originInstance, color, size } = this
      originInstance.setStyles({
        shape: global[val],
        color,
        size: global[size]
      })
    },
    size(val) {
      const { originInstance, color, shape } = this
      originInstance.setStyles({
        shape: global[shape],
        color,
        size: global[val]
      })
    },
    color(val) {
      const { originInstance, shape, size } = this
      originInstance.setStyles({
        shape: global[shape],
        color: val,
        size: global[size]
      })
    },
    points: {
      deep: true,
      handler(val) {
        const { originInstance } = this
        originInstance.clear()
        originInstance.setPoints(val)
      }
    }
  },
  methods: {
    load() {
      const { BMap, map, points, shape, color, size } = this
      const options = generateOptions({
        shape: global[shape],
        color,
        size: global[size]
      })
      const overlay = this.originInstance = new BMap.PointCollection(points.map(p => createPoint(BMap, p)), options)
      bindEvents.call(this, overlay)
      map.addOverlay(overlay)
    }
  }
}
</script>
