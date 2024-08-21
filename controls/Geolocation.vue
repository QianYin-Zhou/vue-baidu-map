<script>
import commonMixin from '../base/mixins/common.js'
import bindEvents from '../base/bindEvent.js'
import { createIcon, createSize } from '../base/factory.js'
import { generateOptions } from '../base/util.js'

export default {
  name: 'bm-geolocation',
  render() { },
  mixins: [commonMixin('control')],
  props: {
    anchor: {
      type: String
    },
    offset: {
      type: Object
    },
    showAddressBar: {
      type: Boolean
    },
    autoLocation: {
      type: Boolean
    },
    locationIcon: {
      type: Object
    }
  },
  watch: {
    anchor() {
      this.reload()
    },
    offset() {
      this.reload()
    },
    showAddressBar() {
      this.reload()
    },
    autoLocation() {
      this.reload()
    },
    locationIcon() {
      this.reload()
    }
  },
  methods: {
    load() {
      if (this._BMap().type == "webgl") {
        console.warn("webgl 版本不支持 bm-geolocation!");
        return;
      }
      const { BMap, map, anchor, showAddressBar, autoLocation, locationIcon, offset } = this
      const options = generateOptions({
        anchor: global[anchor],
        showAddressBar,
        enableAutoLocation: autoLocation,
        offset: offset && createSize(BMap, offset),
        locationIcon: locationIcon && createIcon(BMap, locationIcon)
      })
      this.originInstance = new BMap.GeolocationControl(options)
      bindEvents.call(this, this.originInstance)
      map.addControl(this.originInstance)
    }
  }
}
</script>
