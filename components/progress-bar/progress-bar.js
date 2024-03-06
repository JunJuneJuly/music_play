// 获取全局唯一的背景音频管理器 getBackgroundAudioManager
const backgroundAudioManager = wx.getBackgroundAudioManager()
let duration = 0 // 当前歌曲的总时长，以秒为单位
let movabelView = 0;
let movableWidth = 0;
let currentSec = -1;
let isMoving = false; //拖拽时也会执行onTimeUpdate事件
Component({

  /**
   * 组件的属性列表
   */
  properties: {
    isSame:Boolean
  },
  //组件生命周期
  lifetimes: {
    ready() {
      if(this.properties.isSame){
        this._setTime()
      }
      this._bindBGMEvent();
      this._getMovableDis();
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    showTime: {
      currentTime: '00:00',
      totalTime: '00:00'
    },
    progress: 0,
    movableDis: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //拖拽
    bindChange(event) {
      //先存储对应值
      if (event.detail.source == 'touch') {
        this.data.movableDis = event.detail.x;
        this.data.progress = event.detail.x / (movableWidth - movabelView) * 100;
        isMoving = true;
      }
    },
    bindTouchEnd() {
      //计算当前拖拽的时间
      let currentTime = this._dateFormat(Math.floor(this.data.progress / 100 * duration))
      this.setData({
        movableDis: this.data.movableDis,
        progress: this.data.progress,
        ['showTime.totalTime']: `${currentTime.min}:${currentTime.sec}`
      })
      backgroundAudioManager.seek(Math.floor(this.data.progress / 100 * duration))
      isMoving = false
    },
    //获取dom节点
    _getMovableDis() {
      const query = this.createSelectorQuery();
      query.select('.movable-view').boundingClientRect()
      query.select('.movable-area').boundingClientRect();
      query.exec((rect) => {
        movabelView = rect[0].width;
        movableWidth = rect[1].width;
      })
    },
    _bindBGMEvent() {
      //获取时长
      backgroundAudioManager.onCanplay(() => {
        if (typeof backgroundAudioManager.duration == 'undefined') {
          setTimeout(() => {
            this._setTime()
          }, 300)
        } else {
          this._setTime()
        }
        setTimeout(() => {
          isMoving = false
        })
      })
      backgroundAudioManager.onTimeUpdate(() => {
        //不拖拽时触发
        if (!isMoving) {
          console.log('onTimeUpdate')
          const sec = backgroundAudioManager.currentTime.toString().split('.')[0]
          if (sec != currentSec) {
            let currentTime = this._dateFormat(sec)
            this.setData({
              ['showTime.currentTime']: `${currentTime.min}:${currentTime.sec}`,
              movableDis: (backgroundAudioManager.currentTime / duration) * (movableWidth - movabelView),
              progress: (backgroundAudioManager.currentTime / duration) * 100
            })
            currentSec = sec
            //联动歌词
            this.triggerEvent('timeUpdate', {
              currentTime: backgroundAudioManager.currentTime
            })
          }
        }
      })
      //歌曲播放结束
      backgroundAudioManager.onEnded(() => {
        this.triggerEvent('musicEnd')
      })
      //歌曲播放
      backgroundAudioManager.onPlay(() => {
        console.log('play')
        this.triggerEvent('onPlay')
      })
      backgroundAudioManager.onPause(() => {
        console.log('pause')
        this.triggerEvent('onPause')
      })
    },
    _setTime() {
      duration = backgroundAudioManager.duration;
      let durationFmt = this._dateFormat(duration)
      this.setData({
        'showTime.totalTime': durationFmt.min + ':' + durationFmt.sec
      })
    },
    _dateFormat(sec) {
      let min = Math.floor(sec / 60);
      let seconds = Math.floor(sec % 60)
      return {
        'min': this._parse0(min),
        'sec': this._parse0(seconds)
      }
    },
    _parse0(sec) {
      return sec < 10 ? '0' + sec : sec
    }
  }
})