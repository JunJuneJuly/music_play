// pages/blog/blog.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalShow: false
  },
  onPublish() {
    // 20221128小程序用户头像昵称获取规则调整
    // 判断本地存储中是否有用户信息
    // 用户信息在本地存储，key为openid + '-userinfo'
    const {
      openid
    } = app.globalData
    wx.getStorage({
      key:openid + '-userinfo',
      success(res){
        console.log(res)
      },
      fail(res){
        console.log(res)
        // 如果不存在用户信息，就跳转到用户信息配置页面
        wx.showToast({
          title: 'loading',
          title:'请配置用户信息'
        })
        setTimeout(()=>{
          wx.navigateTo({
            url: '../../pages/userinfo/userinfo',
          })
        },1500)
      }
    })
    
  },
  onLoginSuccess(event) {
    const detail = event.detail
    wx.navigateTo({
      url: `../blog-edit/blog-edit?nickName=${detail.nickName}&avatarUrl=${detail.avatarUrl}`,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})