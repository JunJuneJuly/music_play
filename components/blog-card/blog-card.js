// components/blog-card/blog-card.js
import formatTime from '../../utils/formatTime'
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    blog: Object
  },
  observers: {
    ['blog.createTime'](val){
      if(val){
        this.setData({
          createTime: formatTime(new Date(val))
        })
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    createTime:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //预览图片
    onPreviewImage(e){
      const {
        imgs,
        imgsrc
      } = e.target.dataset
      wx.previewImage({
        current: imgsrc, // 图片的地址url
        urls: imgs // 预览的地址url
      })
    }
  }
})