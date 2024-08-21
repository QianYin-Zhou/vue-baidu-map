## 使用

直接复制仓库代码到项目的公共组件components目录，再引入

```js
import Vue from 'vue'
import BaiduMap from '@/components/vue-baidu-map'

Vue.use(BaiduMap, {
    ak: "xxxxxxxxxxxx",
    type: 'webgl', // 注意大小写
})
```

组件使用与vue-baidu-map[文档](https://dafrok.github.io/vue-baidu-map/#/zh/index)一致

目前webgl版本仅支持以下几个组件，其它自己支持：

```html
<baidu-map>
<bm-scale>
<bm-overview-map>
<bm-geolocation>
<bm-copyright>
<bm-control>
<bm-marker>
<bm-info-window>
```

只能说控制台不会报错，不影响系统本有功能，但是升级了webgl版本功能可能被去掉了，具体看下面的说明

## 说明

代码是依据vue-baidu-map基础上开发，没有fork，因为并不需要支持npm进入，如果需要帮忙支持或者解决报错问题，可以联系邮箱

以下是变更的地方：

**base/mixins/common.js**: 改为常见的mixin文件写法

**base/factory.js**：参考了 [vue2-baidu-map ](https://github.com/YangJianFei/vue2-baidu-map)的变更

**controls/Control**: 踩坑，不能传不合法的offset值，注意默认值，换了一个构造函数名CustomControl

**controls/Geolocation**: 判断了一下，webgl版本不支持这个组件，直接return，避免报错

**controls/OverviewMap**: 判断了一下，webgl版本不支持这个组件，直接return，避免报错

**controls/Scale**: 比例尺控件，就放默认位置挺好的，好看；判断了webgl版本直接跳过参数设置（如果非要设置偏移值和位置请参考controls/Control写法)

**map/Map**： 

1. center只能传对象形式(懒得判断类型)，经纬度支持传String类型的值，即{lat: Number|String, lng: Number|String }, 
2. 简化了wacth写法， 设置deep为true
3. getMapScript方法，判断一下，不同参数不同的版本的百度地图底图

**overlayers/InfoWindow**: 

1. show参数改成支持双向绑定的value,
2. offset判断一下，避免被createSize转成{ width: NaN, height: NaN }, 导致信息窗体永远在左上角
3. 去掉了不常用的参数：enableMessage、message



## 参考

百度地图开发者平台：https://lbsyun.baidu.com/

百度地图API3.0官方类文档、接口文档：https://mapopen-pub-jsapi.bj.bcebos.com/jsapi/reference/jsapi_reference_3_0.html#a0b0

百度地图API3.0官方演示地址：https://lbsyun.baidu.com/jsdemo3.0.htm#contrlv3-0

百度地图WebGL官方类文档、接口文档：https://lbsyun.baidu.com/cms/jsapi/reference/jsapi_webgl_1_0.html#a2b0

百度地图WebGL官方演示地址：https://lbsyun.baidu.com/jsdemo.htm#cAddCustomControl

vue-baidu-map: https://dafrok.github.io/vue-baidu-map/#/zh/overlay/info-window

vue2-baidu-map: https://map.heifahaizei.com/doc/begin/install.html



