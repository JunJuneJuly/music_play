// components/blog-ctrl/blog-ctrl.js
const app = getApp()
const db = wx.cloud.database()
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    blogId: String,
    blog: Object
  },
  externalClasses: ['icon-fenxiang', 'iconfont', 'icon-pinglun'],
  /**
   * 组件的初始数据
   */
  data: {
    showBottomModal: false,
    content: '', //文本框内容
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
        success: (res) => {
          this.setData({
            showBottomModal: true
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
    //输入
    onInput(e) {
      this.setData({
        content: e.detail.value
      })
    },
    //点击发送
    onSend(e) {
      let content = e.detail.value.content
      if (content.trim() === '') {
        wx.showModal({
          title: '输入内容为空',
          content: '',
        })
        return
      }
      const {
        openid
      } = app.globalData
      let userinfo = wx.getStorageSync(openid + '-userinfo')
      wx.showLoading({
        title: '评论中',
        mask: true
      })
      db.collection('blog-comment').add({
        data: {
          ...userinfo,
          content,
          createTime: db.serverDate(),
          blogId: this.properties.blogId
        }
      }).then(res => {
        wx.hideLoading()
        wx.showToast({
          title: '评论成功'
        })
        this.setData({
          showBottomModal: false,
          content: ''
        })
        //刷新页面的评论列表
        this.triggerEvent('refresh')
      })
    }

  }
})