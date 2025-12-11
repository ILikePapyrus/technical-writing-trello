import { useState } from 'react'
import List from './List'
import './Board.css'

function Board() {
  const [lists, setLists] = useState([
    { id: 'list-1', title: 'To do', cards: [
      { id: 'card-1', content: 'Buy milk' },
      { id: 'card-2', content: 'Write README' }
    ] },
    { id: 'list-2', title: 'Doing', cards: [ { id: 'card-3', content: 'Develop UI' } ] },
    { id: 'list-3', title: 'Done', cards: [] },
  ])

  const [newListTitle, setNewListTitle] = useState('')

  function addList() {
    const title = newListTitle.trim()
    if (!title) return
    const id = 'list-' + Date.now()
    setLists([...lists, { id, title, cards: [] }])
    setNewListTitle('')
  }

  function addCard(listId, text) {
    const content = text.trim()
    if (!content) return
    setLists(lists.map(l => l.id === listId ? { ...l, cards: [...l.cards, { id: 'card-' + Date.now(), content }] } : l))
  }

  function removeCard(listId, cardId) {
    setLists(lists.map(l => l.id === listId ? { ...l, cards: l.cards.filter(c => c.id !== cardId) } : l))
  }

  function removeList(listId) {
    setLists(lists.filter(l => l.id !== listId))
  }

  function onDragStart(e, fromListId, cardId) {
    e.dataTransfer.setData('application/json', JSON.stringify({ fromListId, cardId }))
  }

  function onDragOver(e) {
    e.preventDefault()
  }

  function onDrop(e, toListId) {
    e.preventDefault()
    try {
      const raw = e.dataTransfer.getData('application/json')
      if (!raw) return
      const { fromListId, cardId } = JSON.parse(raw)
      if (fromListId === toListId) return

      let draggedCard = null
      const removed = lists.map(l => {
        if (l.id === fromListId) {
          const newCards = l.cards.filter(c => {
            if (c.id === cardId) {
              draggedCard = c
              return false
            }
            return true
          })
          return { ...l, cards: newCards }
        }
        return l
      })

      const added = removed.map(l => l.id === toListId ? { ...l, cards: [...l.cards, draggedCard].filter(Boolean) } : l)
      setLists(added)
    } catch (err) {
      // ignore parse errors
    }
  }

  return (
    <div className="board">
      <div className="lists">
        {lists.map(list => (
          <div key={list.id} className="list-dropzone" onDragOver={onDragOver} onDrop={(e) => onDrop(e, list.id)}>
            <List
              list={list}
              onAddCard={(text) => addCard(list.id, text)}
              onDragStart={onDragStart}
              onRemoveCard={removeCard}
              onRemoveList={removeList}
            />
          </div>
        ))}

        <div className="add-list">
          <input value={newListTitle} onChange={(e) => setNewListTitle(e.target.value)} placeholder="New list title" />
          <button onClick={addList}>Add list</button>
        </div>
      </div>
    </div>
  )
}

export default Board
