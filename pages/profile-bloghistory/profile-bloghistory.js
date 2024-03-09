// pages/profile-bloghistory/profile-bloghistory.js
import formatTime from '../../utils/formatTime'
const MAX_LIMIT = 10;
const db = wx.cloud.database()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blogList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // this._getListByCloudFn();
    this._getListByMiniprogram();
  },
  //获取云数据库
  _getListByMiniprogram() {
    wx.showLoading({
      title: '加载中',
    })
    db.collection('blog').skip(this.data.blogList.length).limit(MAX_LIMIT).orderBy('createTime', 'desc').get().then(res => {
      console.log(res)
      let blogList = res.data;
      for (let i = 0; i < blogList; i++) {
        blogList[i].createTime = formatTime(new Date(blogList[i].createTime))
      }
      this.setData({
        blogList: this.data.blogList.concat(blogList)
      })
      wx.hideLoading()
    })
  },
  //跳转博客评论/详情
  goComment(e) {
    wx.navigateTo({
      url: `../blog-comment/blog-comment?blogid=${e.target.dataset.blogid}`,
    })
  },
  //云函数获取
  _getListByCloudFn() {
    wx.showLoading({
      title: '加载中',
    })
    wx.cloud.callFunction({
      name: 'blog',
      data: {
        $url: 'getListByOpenid',
        start: this.data.blogList.length,
        count: MAX_LIMIT
      }
    }).then(res => {
      let blogList = res.result;
      for (let i = 0; i < blogList; i++) {
        blogList[i].createTime = formatTime(new Date(blogList[i].createTime))
      }
      this.setData({
        blogList: this.data.blogList.concat(blogList)
      })
      wx.hideLoading()
    })
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
    this._getListByCloudFn()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {
    this._getListByCloudFn()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(e) {
    return {
      title: e.target.dataset.blog.content,
      path: `/pages/blog-comment/blog-comment?blogid=${e.target.dataset.blogid}`
    }
  }
})