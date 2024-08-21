const types = {
  control: {
    unload: 'removeControl'
  },
  layer: {
    unload: 'removeTileLayer'
  },
  overlay: {
    unload: 'removeOverlay'
  },
  contextMenu: {
    unload: 'removeContextMenu'
  }
}

const getParent = $component => ($component.abstract || $component.$el === $component.$children[0].$el) ? getParent($component.$parent) : $component

function getCommonMixin({ type }) {
  return {
    computed: {
      renderByParent() {
        return this.$parent.preventChildrenRender
      }
    },
    mounted() {
      const $parent = getParent(this.$parent)
      const map = $parent.map
      if (map) {
        this.ready()
      } else {
        // 因为百度地图初始化比这个控件初始化要晚，父组件子组件mounted生命周期执行顺序
        $parent.$on('ready', () => {
          this.ready();
        })
      }
    },
    beforeDestroy() {
      this.destroyInstance();
    },
    destroyed() {
      this.destroyInstance();
    },
    methods: {
      ready() {
        const $parent = getParent(this.$parent)
        const BMap = this.BMap = $parent.BMap
        const map = this.map = $parent.map
        this.load()
        this.$emit('ready', { BMap, map })
      },
      transmitEvent(e) {
        this.$emit(e.type.replace(/^on/, ''), e)
      },
      reload() {
        this && this.BMap && this.$nextTick(() => {
          this.unload()
          this.load()
        })
      },
      unload() {
        const { map, originInstance } = this
        try {
          switch (type) {
            case 'search':
              return originInstance.clearResults()
            case 'autoComplete':
            case 'lushu':
              return originInstance.dispose()
            case 'markerClusterer':
              return originInstance.clearMarkers()
            default:
              map[types[prop.type].unload](originInstance)
          }
        } catch (e) { }
      },
      destroyInstance() {
        const { unload, renderByParent, $parent } = this
        if (renderByParent) {
          $parent.reload()
        }
        unload()
      }
    },
  }
}

export default (type) => new getCommonMixin({ type })
