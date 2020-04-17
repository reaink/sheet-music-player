/**
 * e-editor-plugin input-sheet
 * @author real<nmlixa@163.com>
 * @date 2020-04-15 20:50:15
 */

'use strict'

import noteData from './note-data.js'
import { playAudio } from './piano.js'

let $ = document.querySelector.bind(document)
let sharpFlatInstall
let key = 4

function createBtns () {
  let btn = document.createElement('button')
  btn.classList.add('s-n')
  btn.type = 'button'
  return btn
}

function createSheetBox () {
  let sharpBox = document.createElement('div')
  sharpBox.classList.add('sharp-box')
  let normalBox = document.createElement('div')
  normalBox.classList.add('normal-box')
  let flatBox = document.createElement('div')
  flatBox.classList.add('flat-box')

  return { sharpBox, normalBox, flatBox }
}

function createSharpFlatBtns () {
  let sharpBtn = document.createElement('button')
  sharpBtn.type = 'button'
  sharpBtn.innerText = '升Key'
  sharpBtn.classList.add('s-n')
  sharpBtn.addEventListener('click', () => {
    changeBtnsSharp.call(this)
    checkBtnIsMax(sharpBtn, flatBtn)
  })

  let flatBtn = document.createElement('button')
  flatBtn.type = 'button'
  flatBtn.innerText = '降Key'
  flatBtn.classList.add('s-n')
  flatBtn.addEventListener('click', () => {
    changeBtnsFlat.call(this)
    checkBtnIsMax(sharpBtn, flatBtn)
  })

  return { sharpBtn, flatBtn }
}

function checkBtnIsMax (sharpBtn, flatBtn) {
  if (key === 8) {
    sharpBtn.disabled = true
  } else if (key === 1) {
    flatBtn.disabled = true
  } else {
    sharpBtn.disabled = false
    flatBtn.disabled = false
  }
}

function changeBtnsSharp () {
  key < 8 && key++
  initBtns.call(this)
}

function changeBtnsFlat () {
  key > 1 && key--
  initBtns.call(this)
}

function initBtns () {
  let notes = Object.keys(noteData)
  notes.push('-')

  let sheetSpan = document.createElement('span')
  sheetSpan.classList.add('s-n')

  clearSheetBtns.call(this)
  insertBtns.call(this, notes, sheetSpan)
}

function clearSheetBtns () {
  this.node.innerHTML = ''
}

function insertBtns (notes, sheetSpan) {
  
  const { sharpBox, normalBox, flatBox } = createSheetBox()

  for (let note of notes) {
    let btn = createBtns()
    if (note !== '-') {
      note = note + key
    } else {
      btn.classList.add('s-m')
    }
    btn.innerText = note
    btn.setAttribute('data-sheet', note.toLocaleLowerCase())

    btn.addEventListener('click', () => {
      sheetSpan.classList.toggle('s-m', note === '-')
      sheetSpan.innerText = note
      sheetSpan.setAttribute('data-sheet', note.toLocaleLowerCase())
      this.editor.appendChild(sheetSpan.cloneNode(true))

      playAudio(note, this.oscType)

      scrollBottom.call(this)
    })

    // 区别添加至不同div
    note.includes('♯')
      ? sharpBox.append(btn)
      : note.includes('♭')
      ? flatBox.append(btn)
      : normalBox.append(btn)

    if (!sharpFlatInstall) {
      const { sharpBtn, flatBtn } = createSharpFlatBtns.call(this)
      let sheetControlsBox = $('.sheet-controls-box')
      sheetControlsBox.append(sharpBtn)
      sheetControlsBox.append(flatBtn)
      
      sharpFlatInstall = true
    }
  }

  this.node.append(sharpBox)
  this.node.append(normalBox)
  this.node.append(flatBox)

}

function scrollBottom () {
  this.editor.scrollTop = this.editor.offsetHeight
}

function init (node) {
  this.node = node
  initBtns.call(this)
}

export default ({ node }) => ({
  install (self) {
    init.call(self, node)
  }
})