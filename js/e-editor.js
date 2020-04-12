/**
 * e-editor
 * @author real<nmlixa@163.com>
 * @date 2020-4-12 21:50:05
 */

'use strict'

import noteData from './note-data.js'

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

function keepLastIndex(obj) {
  if (window.getSelection) {//ie11 10 9 ff safari
      obj.focus(); //解决ff不获取焦点无法定位问题
      var range = window.getSelection();//创建range
      range.selectAllChildren(obj);//range 选择obj下所有子内容
      range.collapseToEnd();//光标移至最后
  }
  else if (document.selection) {//ie10 9 8 7 6 5
      var range = document.selection.createRange();//创建选择对象
      //var range = document.body.createTextRange();
      range.moveToElementText(obj);//range定位到obj
      range.collapse(false);//光标移至最后
      range.select();
  }
}

export default {
  init (node) {
    this.editor = document.querySelector(node)

    this.__init()
  },
  __init () {
    this.editor.setAttribute('contentEditable', true)
    this.editor.addEventListener('input', throttle(this.runfmt.bind(this), 800))

    this.runfmt()
  },
  runfmt () {
    var selection = window.getSelection();
    var range = document.createRange();

    this.validEditor() && this.fmtNote(range, selection)
  },
  fmtNote (range) {
    let sheetMusic = this.editor.innerText
    
    for (let note of Object.keys(noteData)) {
      let reg = new RegExp(note+'[#♯\.♭]?\\d(?!</)', 'g')
      let matched = sheetMusic.match(reg)
      if (matched) {
        for (let it of matched) {
          this.setSheetClass(it, sheetMusic)
        }
      }
    }

    this.editor.innerHTML += '<span></span>'
  },
  setSheetClass (note) {
    let reg = new RegExp(`${note}(?!</)`, 'g')
    if (this.editor.innerHTML.match(reg)) {
      this.editor.innerHTML =
        this.editor.innerHTML.replace(reg, `<span class="s-n" data-sheet="${note.toLowerCase()}">${note}</span>`)
      
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
  }
}