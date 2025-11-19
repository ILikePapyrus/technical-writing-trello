import { useState } from 'react'

function List({ list, onAddCard, onDragStart, onRemoveCard, onRemoveList }) {
  const [cardText, setCardText] = useState('')

  function submitCard() {
    if (!cardText.trim()) return
    onAddCard(cardText)
    setCardText('')
  }

  return (
    <div className="list">
      <div className="list-header">
        <h3 className="list-title">{list.title}</h3>
        <button className="delete-btn" onClick={() => onRemoveList && onRemoveList(list.id)} title="Delete list">×</button>
      </div>

      <div className="cards">
        {list.cards.map(card => (
          <div key={card.id} className="card-item">
            <div className="card-content" draggable onDragStart={(e) => onDragStart(e, list.id, card.id)}>
              {card.content}
            </div>
            <button className="delete-btn card-delete" onClick={() => onRemoveCard && onRemoveCard(list.id, card.id)} title="Delete card">×</button>
          </div>
        ))}
      </div>

      <div className="add-card">
        <input value={cardText} onChange={(e) => setCardText(e.target.value)} placeholder="New card" />
        <button onClick={submitCard}>Add</button>
      </div>
    </div>
  )
}

export default List
