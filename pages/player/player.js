// pages/player/player.js
let nowPlayingIndex = 0;
let musiclist = [];
// 获取全局唯一的背景音频管理器 getBackgroundAudioManager
const backgroundAudioManager = wx.getBackgroundAudioManager()
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    picUrl: '',
    isPlaying: false, // false表示不播放，true表示正在播放
    isLyricShow: false, //是否显示歌词组件
    lyric: '', //歌词
    isSame: false, //是否同一首歌曲
  },
  timeUpdate(event) {
    //父组件触发子组件的update事件
    this.selectComponent('.lyric').update(event.detail.currentTime)
  },
  onChangeLyricShow() {
    ~
    this.setData({
      isLyricShow: !this.data.isLyricShow
    })
  },
  //保存播放历史
  savePlayHistory() {
    let music = musiclist[nowPlayingIndex]
    let historyList = wx.getStorageSync(app.globalData.openid)
    let flag = false
    for (let i = 0; i < historyList.length; i++) {
      if (music.id == historyList[i].id) {
        flag = true;
        break
      }
    }
    if (!flag) {
      historyList.unshift(music)
      wx.setStorageSync(app.globalData.openid, historyList)
    }
  },
  //播放音乐
  _loadMusicDetail(musicId) {
    if (musicId == app.getPlayingMusicId()) {
      this.setData({
        isSame: true
      })
    } else {
      this.setData({
        isSame: false
      })
    }
    if (!this.data.isSame) {
      backgroundAudioManager.stop()
    }
    app.setPlayingMusicId(musicId)
    let music = musiclist[nowPlayingIndex]
    wx.setNavigationBarTitle({
      title: music.name,
    })
    this.setData({
      picUrl: music.al.picUrl,
      isPlaying: false
    })
    wx.cloud.callFunction({
      name: 'music',
      data: {
        musicId,
        $url: 'musicUrl'
      }
    }).then((res) => {
      let result = res.result
      if (result.data[0].url === null) {
        wx.showToast({
          title: '无权限'
        })
        return
      }
      if (!this.data.isSame) {
        backgroundAudioManager.src = result.data[0].url
        backgroundAudioManager.title = music.name; //必须加，否则音频不会播放
        backgroundAudioManager.coverImgUrl = music.al.picUrl;
        backgroundAudioManager.singer = music.ar[0].name;
        backgroundAudioManager.epname = music.al.name
        //保存历史数据
        this.savePlayHistory()
      }
      this.setData({
        isPlaying: true
      })
      backgroundAudioManager.play()
      //获取歌词
      wx.cloud.callFunction({
        name: 'music',
        data: {
          musicId,
          $url: 'lyric'
        }
      }).then((res) => {
        let lyric = "暂无歌词"
        const lrc = res.result.lrc.lyric
        if (lrc) {
          lyric = lrc
        }
        this.setData({
          lyric
        })
      })
    })
  },
  //上一首
  onPrev() {
    nowPlayingIndex--
    if (nowPlayingIndex < 0) {
      nowPlayingIndex = musiclist.length - 1;
    }
    this._loadMusicDetail(musiclist[nowPlayingIndex].id);
  },
  //下一首
  onNext() {
    nowPlayingIndex++
    if (nowPlayingIndex == musiclist.length) {
      nowPlayingIndex = 0;
    }
    this._loadMusicDetail(musiclist[nowPlayingIndex].id);
  },
  //暂停/播放
  togglePlaying() {
    if (this.data.isPlaying) {
      backgroundAudioManager.pause()
    } else {
      backgroundAudioManager.play()
    }
    this.setData({
      isPlaying: !this.data.isPlaying
    })
  },
  onPause() {
    this.setData({
      isPlaying: false
    })
  },
  onPlay() {
    this.setData({
      isPlaying: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    musiclist = wx.getStorageSync('musiclist')
    nowPlayingIndex = Number(options.index);
    this._loadMusicDetail(options.musicId);
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

  },

})