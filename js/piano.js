/**
 * piano
 * @author real <nmlixa@163.com>
 * @date 2020-4-12 06:06:06
 */

import AC from './audio-context.js'
import noteData from './note-data.js'

let playTimer = null
let playIdx = 0

function initPlayConf () {
  playIdx = 0
  playTimer && clearInterval(playTimer)
}

function translateNote (sheetMusic, oscType, time, interval = 500) {
  // 替换所有换行为空格
  sheetMusic = sheetMusic.replace(/\n/g, ' ')

  // 替换所有音符为频率
  for (let [note, frequency] of Object.entries(noteData)) {
    let reg = new RegExp(note+'[#♯\.♭]?\\d', 'g')
    let matched = sheetMusic.match(reg)
    if (matched) {
      for (let it of matched) {
        let [mul] = it.match(/\d/)
        // | 为防替换错误字符 ,为转换数组字符
        // console.log(it, mul, computedNoteMul(frequency, mul))
        sheetMusic = sheetMusic.replace(it, '|' + computedNoteMul(frequency, mul) + ',')
      }
    }
  }
  // 清除防替换频率保护字符
  sheetMusic = sheetMusic.replace(/\|/g, '')
  sheetMusic = sheetMusic.split(/\s|,|-/)
  // 转换正确的空音
  sheetMusic.forEach((val, idx) => {
    if (!val) sheetMusic[idx] = "0"
  })

  // console.log(sheetMusic)

  playTimer = setInterval(playAudioRing.bind(document, sheetMusic, oscType, time), interval)
}

function playAudioRing (sheetMusic, oscType, time) {
  if (!sheetMusic[playIdx]) return

  AC.ring(sheetMusic[playIdx], oscType, time)

  if (playIdx < sheetMusic.length) {
    playIdx ++
  } else {
    initPlayConf()
  }
}

function computedNoteMul (fre, mul) {
  let nmul = 'n' + mul

  let scale = {
    n0: val => val/2/2/2/2,
    n1: val => val/2/2/2,
    n2: val => val/2/2,
    n3: val => val/2,
    n5: val => val*2,
    n6: val => val*2*2,
    n7: val => val*2*2*2,
    n8: val => val*2*2*2*2
  }

  var getScale = () => +mul !== 4 ? scale[nmul](fre) : fre

  return getScale()
}

export function playAudio (sheetMusic, oscType, time, interval) {
  sheetMusic = sheetMusic.trim()
  
  if (playTimer) {
    initPlayConf()
  }
  
  translateNote(sheetMusic, oscType, time, interval)
}

export function stopAudio () {
  initPlayConf()
}