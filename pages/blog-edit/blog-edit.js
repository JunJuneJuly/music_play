// pages/blog-edit/blog-edit.js
const MAX_WORDS_NUM = 140;
const MAX_IMG_NUM = 9;
let userinfo = {};
let content = ''; //发布内容
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wordsNum: 0,
    footerBottom: 0, //底部距离
    images: [], //存放图片容器
    selectPhoto: true, //是否显示”上传图片“按钮
  },
  //预览事件
  previewImage(e) {
    const {
      src
    } = e.target.dataset
    wx.previewImage({
      current: src, // 图片的地址url
      urls: this.data.images // 预览的地址url
    })
  },
  //发布事件
  send() {
    if (content.trim() === '') {
      wx.showModal({
        title: '输入内容不能为空',
        content: ''
      })
      return
    }
    wx.showLoading({
      title: '发布中',
      mask: true
    })
    let promiseArr = [];
    let filesID = []
    //先把图片上传到云存储
    //再把”图片fileID,内容，姓名，头像，时间“上传到云数据库
    for (let i = 0; i < this.data.images.length; i++) {
      let p = new Promise((resolve, reject) => {
        let suffix = /\.\w+$/.exec(this.data.images[i])[0]
        wx.cloud.uploadFile({
          cloudPath: 'blog/' + Date.now() + '-' + Math.random() * 10000 + suffix,
          filePath: this.data.images[i],
          success: res => {
            filesID = filesID.concat(res.fileID)
            resolve()
          },
          fail: (err) => {
            console.log(err)
            reject()
          }
        })
      })
      promiseArr.push(p)
    }
    Promise.all(promiseArr).then((res) => {
      db.collection('blog').add({
        data: {
          ...userinfo,
          content,
          img: filesID,
          createTime: db.serverDate() //服务端时间
        }
      }).then((res) => {
        content = '';
        wx.showToast({
          title: '发布成功',
        })
        wx.navigateBack();
        //刷新
        const pages = getCurrentPages()
        let currentPage = pages[pages.length - 2]
        currentPage.onPullDownRefresh()
      })
    }).catch(() => {
      wx.hideLoading()
      wx.showToast({
        title: '发布失败',
      })
    })
  },
  //删除图片
  onDelImage(e) {
    this.data.images.splice(e.target.dataset.index, 1)
    this.setData({
      images: this.data.images
    })
    //是否显示上传图片按钮
    this.setData({
      selectPhoto: (MAX_IMG_NUM - this.data.images.length) > 0 ? true : false
    })
  },
  //文本框输入事件
  onInput(e) {
    let wordsNum = e.detail.value.length;
    if (wordsNum >= MAX_WORDS_NUM) {
      wordsNum = `最大字数是${MAX_WORDS_NUM}`
    }
    this.setData({
      wordsNum
    })
    content = e.detail.value
  },
  //文本框聚焦事件
  onFocus(e) {
    const height = e.detail.height; //e.detail.height获取键盘高度
    this.setData({
      footerBottom: height
    })
  },
  //上传图片
  onChooseImage() {
    let max = MAX_IMG_NUM - this.data.images.length;
    wx.chooseImage({
      count: max,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({
          images: this.data.images.concat(res.tempFilePaths)
        })
        //是否显示上传图片按钮
        this.setData({
          selectPhoto: (MAX_IMG_NUM - this.data.images.length) > 0 ? true : false
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    userinfo = options
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