// pages/userinfo/userinfo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '', //头像(临时)地址
    avatarFileId: '', //头像在云存储中的永久地址
  },
  //上传头像
  onChooseAvatar(e) {
    this.setData({
      avatarUrl: e.detail.avatarUrl
    })
    // 注意：图片只支持<1M图片，超过1M会失败
    // 注意：avatarUrl获取到的是临时地址！临时地址！临时地址！
    // 所以如果想永久使用这个头像地址，可以上传到云存储中得到永久地址
    this.uploadFile();
  },
  //把图片上传到云端
  uploadFile() {
    const suffix = /\.\w+$/.exec(this.data.avatarUrl)[0] //获取头像临时地址的后缀
    // 将图片上传至云存储空间
    wx.cloud.uploadFile({
      // 指定上传到的云路径
      cloudPath: 'avatar/' + Date.now() + '-' + Math.random() * 1000000 + suffix,
      // 指定要上传的文件的小程序临时文件路径
      filePath: this.data.avatarUrl,
      // 成功回调
      success: res => {
        this.setData({
          avatarFileId:res.fileID
        })
      },
      fail:err => {
        console.error(err);
      }
    })
  },
  //上传表单
  formSubmit(e) {
    const { nickname } = e.detail.value;
    const { openid } = app.globalData;
    wx.setStorage({
      key: openid + '-userinfo',
      data:{
        nickname,
        avatarFileId: this.data.avatarFileId
      },
      success(){
        wx.showToast({
          icon:'success',
          title: '保存成功',
        })
        setTimeout(wx.navigateBack,1500)
      },
      fail(){
        wx.showToast({
          icon:'error',
          title: '保存失败',
        })
      }
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