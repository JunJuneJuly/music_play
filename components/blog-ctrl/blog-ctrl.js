// components/blog-ctrl/blog-ctrl.js
const app = getApp()
Component({

  /**
   * 组件的属性列表
   */
  properties: {

  },
  externalClasses: ['icon-fenxiang', 'iconfont', 'icon-pinglun'],
  /**
   * 组件的初始数据
   */
  data: {
    showBottomModal: false,
    content:'',//文本框内容
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //评论
    onComment() {
      //用户是否授权
      //否：跳转到userinfo页面
      //是：弹出bottom-modal组件
      const {
        openid
      } = app.globalData
      wx.getStorage({
        key: openid + '-userinfo',
        success:(res) => {
          this.setData({
            showBottomModal:true
          })

        },
        fail(res) {
          // 如果不存在用户信息，就跳转到用户信息配置页面
          wx.showToast({
            title: 'loading',
            title: '请配置用户信息'
          })
          setTimeout(() => {
            wx.navigateTo({
              url: '../../pages/userinfo/userinfo',
            })
          }, 1500)
        }
      })
    },
  }
})