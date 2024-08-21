<template>
  <div>
    <div v-if="!hasBmView" ref="view" style="width: 100%; height: 100%">
    </div>
    <slot></slot>
  </div>
</template>

<script>
import bindEvents from '../base/bindEvent.js'

export default {
  name: 'bm-map',
  props: {
    ak: {
      type: String
    },
    center: {
      type: Object, // [object, String]不支持String，懒得处理
    },
    zoom: {
      type: Number
    },
    minZoom: {
      type: Number
    },
    maxZoom: {
      type: Number
    },
    highResolution: {
      type: Boolean,
      default: true
    },
    mapClick: {
      type: Boolean,
      default: true
    },
    mapType: {
      type: String
    },
    dragging: {
      type: Boolean,
      default: true
    },
    scrollWheelZoom: {
      type: Boolean,
      default: false
    },
    doubleClickZoom: {
      type: Boolean,
      default: true
    },
    keyboard: {
      type: Boolean,
      default: true
    },
    inertialDragging: {
      type: Boolean,
      default: true
    },
    continuousZoom: {
      type: Boolean,
      default: true
    },
    pinchToZoom: {
      type: Boolean,
      default: true
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    theme: {
      type: Array
    },
    mapStyle: {
      type: Object
    },
    hasAnimation: {
      type: Boolean,
      default: true
    },
    defaultAnimation: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    centerStringChange() {
      // 为何这样处理？
      // 因为用户传进来的center对象，lng、lat有时是Number，有时是String(Point对象只接受Number)
      // 变成字符串好处理，统一转成Number
      return `${this.center.lng},${this.center.lat}`
    }
  },
  watch: {
    centerStringChange: {
      handler(val, oldVal) {
        const { map, BMap } = this
        const arr = val.split(',');  // 经纬度字符串数组
        const lng = parseFloat(arr[0]); // BMap.Point传入的必须是number
        const lat = parseFloat(arr[1]); // BMap.Point传入的必须是number
        map.setCenter(new BMap.Point(lng, lat));
      }
    },
    zoom(val, oldVal) {
      const { map } = this
      if (val !== oldVal && val >= 3 && val <= 19) {
        map.setZoom(val)
      }
    },
    minZoom(val) {
      const { map } = this
      map.setMinZoom(val)
    },
    maxZoom(val) {
      const { map } = this
      map.setMaxZoom(val)
    },
    highResolution() {
      this.reset()
    },
    mapClick() {
      this.reset()
    },
    mapType(val) {
      const { map } = this
      map.setMapType(global[val])
    },
    dragging(val) {
      const { map } = this
      val ? map.enableDragging() : map.disableDragging()
    },
    scrollWheelZoom(val) {
      const { map } = this
      val ? map.enableScrollWheelZoom() : map.disableScrollWheelZoom()
    },
    doubleClickZoom(val) {
      const { map } = this
      val ? map.enableDoubleClickZoom() : map.disableDoubleClickZoom()
    },
    keyboard(val) {
      const { map } = this
      val ? map.enableKeyboard() : map.disableKeyboard()
    },
    inertialDragging(val) {
      const { map } = this
      val ? map.enableInertialDragging() : map.disableInertialDragging()
    },
    continuousZoom(val) {
      const { map } = this
      val ? map.enableContinuousZoom() : map.disableContinuousZoom()
    },
    pinchToZoom(val) {
      const { map } = this
      val ? map.enablePinchToZoom() : map.disablePinchToZoom()
    },
    autoResize(val) {
      const { map } = this
      val ? map.enableAutoResize() : map.disableAutoResize()
    },
    theme(val) {
      const { map } = this
      this.setMapStyle(map, { styleJson: val })
    },
    mapStyle: {
      handler(val) {
        const { map, theme } = this
        !theme && this.setMapStyle(map, val)
      },
      deep: true,
    },
  },
  methods: {
    setMapOptions() {
      const { map, minZoom, maxZoom, mapType, dragging, scrollWheelZoom, doubleClickZoom, keyboard, inertialDragging, continuousZoom, pinchToZoom, autoResize } = this
      minZoom && map.setMinZoom(minZoom)
      maxZoom && map.setMaxZoom(maxZoom)
      mapType && map.setMapType(global[mapType])
      dragging ? map.enableDragging() : map.disableDragging()
      scrollWheelZoom ? map.enableScrollWheelZoom() : map.disableScrollWheelZoom()
      doubleClickZoom ? map.enableDoubleClickZoom() : map.disableDoubleClickZoom()
      keyboard ? map.enableKeyboard() : map.disableKeyboard()
      inertialDragging ? map.enableInertialDragging() : map.disableInertialDragging()
      continuousZoom ? map.enableContinuousZoom() : map.disableContinuousZoom()
      pinchToZoom ? map.enablePinchToZoom() : map.disablePinchToZoom()
      autoResize ? map.enableAutoResize() : map.disableAutoResize()
    },
    init(BMap) {
      if (this.map) {
        return
      }
      let $el = this.$refs.view
      for (let $node of this.$slots.default || []) {
        if ($node.componentOptions && $node.componentOptions.tag === 'bm-view') {
          this.hasBmView = true
          $el = $node.elm
        }
      }
      const map = new BMap.Map($el, { enableHighResolution: this.highResolution, enableMapClick: this.mapClick })
      this.map = map
      const { setMapOptions, center, zoom, theme, mapStyle } = this
      theme ? this.setMapStyle(map, { styleJson: theme }) : this.setMapStyle(map, mapStyle)
      setMapOptions()
      bindEvents.call(this, map)
      this.setCenterZoom(map, new BMap.Point(center.lng, center.lat), zoom);
      this.$emit('ready', { BMap, map })
    },
    setMapStyle(map, config) {
      if (!config) return;
      if (this._BMap().type == 'API' && this._BMap().version == '2.0') {
        map.setMapStyle(config)
      } else if (this._BMap().type == 'API' && this._BMap().version == '3.0') {
        map.setMapStyle(config)
      } else if (this._BMap().type == 'webgl') {
        map.setMapStyleV2(config)
      }
    },
    setCenterZoom(map, center, zoom) {
      if (this._BMap().type == 'API' && this._BMap().version == '2.0') {
        map.centerAndZoom(center, zoom);
      } else if (this._BMap().type == 'API' && this._BMap().version == '3.0') {
        map.centerAndZoom(center, zoom);
      } else if (this._BMap().type == 'webgl') {
        if (!this.hasAnimation || !this.defaultAnimation) {
          map.setCenter(center, {
            noAnimation: !this.hasAnimation,
            callback: () => {
              map.setZoom(zoom, {
                noAnimation: !this.hasAnimation,
                zoomCenter: center,
                callback: () => {
                  this.$emit('animationed', { BMap: this.BMap, map });
                }
              });
            }
          });
        } else {
          map.centerAndZoom(center, zoom);
        }
      }
    },
    initMap(BMap) {
      this.BMap = BMap
      this.init(BMap)
    },
    getMapScript() {
      if (!global.BMap) {
        const type = this._BMap().type
        const version = this._BMap().version
        const ak = this.ak || this._BMap().ak
        global.BMap = {}
        global.BMap._preloader = new Promise((resolve, reject) => {
          global._initBaiduMap = function () {
            global.BMap = type == 'webgl' ? global.BMapGL : global.BMap;
            resolve(global.BMap)
            global.document.body.removeChild($script)
            global.BMap._preloader = null
            global._initBaiduMap = null
          }
          const $script = document.createElement('script')
          global.document.body.appendChild($script)
          if (type == "webgl") {
            $script.src = `https://api.map.baidu.com/api?v=1.0&type=webgl&ak=${ak}&callback=_initBaiduMap`
          } else {
            $script.src = `https://api.map.baidu.com/api?v=${version}&ak=${ak}&callback=_initBaiduMap`
          }
        })
        return global.BMap._preloader
      } else if (!global.BMap._preloader) {
        return Promise.resolve(global.BMap)
      } else {
        return global.BMap._preloader
      }
    },
    reset() {
      this.getMapScript().then(this.initMap)
    }
  },
  mounted() {
    this.reset();
  },
  data() {
    return {
      hasBmView: false,
    }
  }
}
</script>
