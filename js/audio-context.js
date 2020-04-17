/**
 * 读取频率按设定时长播放音频
 * @author real <nmlixa@163.com>
 * @date 2020/04/12 08:44:30
 * @author yutent<yutent@doui.cc>
 * @date 2020/02/26 14:57:44
 */

'use strict'

const AC = new (window.AudioContext || window.webkitAudioContext)()

export default {
  __init__(type = 'sine') {
    this.oscillator = AC.createOscillator()
    this.gain = AC.createGain()

    this.oscillator.connect(this.gain)
    this.gain.connect(AC.destination)
    this.oscillator.type = type
  },

  // 播放
  ring(frequency, type, time) {
    if (!frequency) return
    this.__play(parseFloat(frequency), type, time)
  },

  __play(frequency, type, { playTime, stopTime }) {
    this.__init__(type)

    this.oscillator.frequency.value = frequency
    this.gain.gain.setValueAtTime(0, AC.currentTime)
    this.gain.gain.linearRampToValueAtTime(playTime, AC.currentTime + .01);

    this.oscillator.start(AC.currentTime)

    this.gain.gain.exponentialRampToValueAtTime(0.001, AC.currentTime + playTime)
    this.oscillator.stop(AC.currentTime + stopTime);
  }
}
