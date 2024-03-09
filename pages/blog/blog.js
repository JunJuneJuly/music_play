// pages/blog/blog.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalShow: false,
    blogList: [],
  },
  //
  onSearch(e) {
    this.setData({
      blogList:[]
    })
    this._loadBlogList(0, e.detail.keywords)
  },
  //跳转博客评论页面
  goComment(e) {
    wx.navigateTo({
      url: `../blog-comment/blog-comment?blogid=${e.target.dataset.blogid}`,
    })
  },
  onPublish() {
    // 判断本地存储中是否有用户信息
    // 用户信息在本地存储，key为openid + '-userinfo'
    const {
      openid
    } = app.globalData
    wx.getStorage({
      key: openid + '-userinfo',
      success(res) {
        const {
          nickname,
          avatarFileId
        } = res.data
        wx.navigateTo({
          url: `../blog-edit/blog-edit?nickname=${nickname}&avatarUrl=${avatarFileId}`,
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
  onLoginSuccess(event) {
    const detail = event.detail
    wx.navigateTo({
      url: `../blog-edit/blog-edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
    })
  },
  //加载博客列表
  _loadBlogList(start = 0,keywords = '') {
    wx.showLoading({
      title: '拼命加载中',
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        $url: 'bloglist',
        start,
        keywords,
        count: 20
      }
    }).then(res => {
      this.setData({
        blogList: this.data.blogList.concat(res.result.data)
      })
      wx.hideLoading()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this._loadBlogList()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.setData({
      blogList: []
    })
    this._loadBlogList(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this._loadBlogList(this.data.blogList.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(e) {
    return{
      title:e.target.dataset.blog.content,
      path:`/pages/blog-comment/blog-comment?blogid=${e.target.dataset.blogid}`
    }
  }
})