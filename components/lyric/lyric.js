// components/lyric/lyric.js
let lyricHeight = 0
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    isLyricShow: {
      type: Boolean,
      value: false,
    },
    lyric: String,
  },

  observers: {
    lyric(n) {
      this._parseLyric(n)
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    lrcList: [],
    nowLyricIndex: 0, // 当前选中的歌词的索引
    scrollTop: 0, // 滚动条滚动的高度
  },
  lifetimes: {
    ready() {
      wx.getSystemInfo({
        success(res) {
          //64指的是class="lyric的高度
          lyricHeight = res.screenWidth / 750 * 64
        }
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //滚动歌词
    update(currentTime) {
      //如果歌词长度是0，则返回
      if (this.data.lrcList.length == 0) {
        return
      }
      if(currentTime > this.data.lrcList[this.data.lrcList.length - 1]){
        this.setData({
          nowLyricIndex: -1,
          scrollTop: this.data.lrcList.length * lyricHeight
        })
      }
      //遍历歌词长度，获取正在播放的歌词索引
      for (let i = 0; i < this.data.lrcList.length; i++) {
        let lrcItem = this.data.lrcList[i]
        if (currentTime <= lrcItem.time) {
          this.setData({
            nowLyricIndex: i - 1,
            scrollTop: (i - 1) * lyricHeight
          })
          break
        }
      }
    },
    //整理歌词
    _parseLyric(lrc) {
      let line = lrc.split('\n');
      let _lyricList = [];
      line.forEach((ele) => {
        const time = ele.match(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?]/g)
        if (time != null) {
          let lrc = ele.split(time[0])[1]
          let timeReg = time[0].match(/(\d{2,}):(\d{2})(?:\.(\d{2,3}))?/)
          let timeToSec = parseInt(timeReg[1]) * 60 + parseInt(timeReg[2]) + parseInt(timeReg[3]) / 1000;
          _lyricList.push({
            lrc,
            time: timeToSec
          })
          this.setData({
            lrcList: _lyricList
          })
        }
      })
    },
  }
})