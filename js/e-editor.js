/**
 * e-editor
 * @author real<nmlixa@163.com>
 * @date 2020-4-12 21:50:05
 */

'use strict'

import noteData from './note-data.js'
import eepInputSheet from './e-editor-plugin-input-sheet.js'

const $ = document.querySelector.bind(document)
let plugInstalled

function throttle(fn, gapTime) {
  let _lastTime = null;

  return function () {
    let _nowTime = + new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn();
      _lastTime = _nowTime
    }
  }
}

export default {
  init (data) {
    this.editor = document.querySelector(data.node)
    this.oscType = data.oscType

    this.__init()
  },
  __init () {
    this.runfmt()
    
    !plugInstalled && this.insPlgn()
  },
  insPlgn () {
    this.extendsInstall(eepInputSheet({
      node: $('#input-sheet')
    }))
    
    plugInstalled = true
  },
  runfmt () {
    var selection = window.getSelection();
    var range = document.createRange();

    this.validEditor() && this.fmtNote(range, selection)
  },
  fmtNote () {
    let sheetMusic = this.editor.innerText

    // set noteClass
    for (let note of Object.keys(noteData)) {
      let reg = new RegExp(note+'[#♯\.♭]?\\d(?!</)', 'g')
      let matched = sheetMusic.match(reg)
      if (matched) {
        for (let it of matched) {
          this.setSheetClass(it)
        }
      }
    }
    
    let muteReg = /(?<![n"])(\s|\-)(?=\S)/g
    let muteRegMatched = sheetMusic.match(muteReg)

    // set muteClass
    if (muteRegMatched) {
      for (let it of muteRegMatched) {
        this.setMuteClass(it)
      }
    }
  },
  setSheetClass (note) {
    let reg = new RegExp(`${note}(?!</)`, 'g')
    let matched = this.editor.innerHTML.match(reg)
    
    if (matched) {
      this.editor.innerHTML =
        this.editor.innerHTML.replace(reg, `<span class="s-n" data-sheet="${note.toLowerCase()}">${note}</span>`)
    }
  },
  setMuteClass (note) {
    let regNote = note === '-' ? note : '\s'
    let attrNote = note === '-' ? 'dash' : 'space'
    let reg = new RegExp(`(?<![ns"])\\${regNote}(?!(\\<\\/|["dnsc]))`, 'g')
    let matched = this.editor.innerHTML.match(reg)

    if (matched) {
      this.editor.innerHTML =
        this.editor.innerHTML.replace(reg, `<span class="s-n s-m" data-sheet="${attrNote}">-</span>`)
    }
  },
  validEditor () {
    return this.editor.contentEditable
  },
  selectAll (range, selection) {
    range.selectNodeContents(this.editor)
    selection.removeAllRanges()
    selection.addRange(range)
  },
  command (cmd, value) {
    document.execCommand(cmd, false, value)

    getSelection().empty()
    this.editor.focus()
  },
  extendsInstall ({ install }) {
    install(this)
  }
}