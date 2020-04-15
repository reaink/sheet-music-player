/**
 * e-editor-plugin input-sheet
 * @author real<nmlixa@163.com>
 * @date 2020-04-15 20:50:15
 */

'use strict'

import noteData from './note-data.js'

function createBtns () {
  let btn = document.createElement('button')
  btn.classList.add('s-n')
  btn.type = 'button'
  return btn
}

function insertBtns (node) {
  let notes = Object.keys(noteData).filter(val => !val.match(/[#\.]/))
  notes.push('-')
  for (let note of notes) {
    let btn = createBtns()
    if (note !== '-') {
      note = note + 4
    } else {
      btn.classList.add('s-m')
    }
    btn.innerText = note
    btn.setAttribute('data-sheet', note.toLocaleLowerCase())

    btn.addEventListener('click', () => {
      this.editor.appendChild(btn.cloneNode(true))
    })

    node.append(btn)
  }

}

function init (node) {
  insertBtns.call(this, node)
}

export default ({ node }) => ({
  install (self) {
    init.call(self, node)
  }
})