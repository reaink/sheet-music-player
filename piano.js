/**
 * piano
 * @author real <nmlixa@163.com>
 * @date 2020-4-12 06:06:06
 */

import AC from './bell.js'
import noteData from './note-data.js'

let playTimer = null
let playIdx = 0

function initPlayConf () {
  playIdx = 0
  clearInterval(playTimer)
}

function translateNote (sheetMusic, playTime, oscType, interval = 500) {
  // 替换所有换行为空格
  sheetMusic = sheetMusic.replace(/\n/g, ' ')

  // 替换所有音符为频率
  for (let [note, frequency] of Object.entries(noteData)) {
    let reg = new RegExp(note+'\\d', 'g')
    let matched = sheetMusic.match(reg)
    if (matched) {
      for (let it of matched) {
        let [mul] = it.match(/\d/)
        sheetMusic = sheetMusic.replace(it, computedNoteMul(frequency, mul))
      }
    }
  }

  sheetMusic = sheetMusic.split(' ')

  // 转换正确的空音
  sheetMusic.forEach((val, idx) => {
    if (!val) sheetMusic[idx] = "0"
  })

  playTimer = setInterval(playAudioRing.bind(document, sheetMusic, playTime, oscType), interval)
}

function playAudioRing (sheetMusic, playTime, oscType) {
  if (!sheetMusic[playIdx]) return

  AC.ring(sheetMusic[playIdx], playTime, oscType)

  if (playIdx < sheetMusic.length) {
    playIdx ++
  } else {
    initPlayConf()
  }
}

function computedNoteMul (fre, mul) {
  let nmul = 'n' + mul

  let scale = {
    n0: 2/2/2/2,
    n1: 2/2/2,
    n2: 2/2,
    n3: 2,
    n5: 2,
    n6: 2*2,
    n7: 2*2*2,
    n8: 2*2*2*2
  }

  return mul < 4 ? fre / scale[nmul] : mul > 4 ? fre * scale[nmul] : fre
}

export function playAudio (sheetMusic, oscType, interval) {
  sheetMusic = sheetMusic.trim()
  
  if (playTimer) {
    initPlayConf()
  }
  // let interval = 500
  /// ms
  let playTime = 1
  /// s
  translateNote(sheetMusic, playTime, oscType, interval)
}