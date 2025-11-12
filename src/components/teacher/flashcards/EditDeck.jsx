import React, { useState } from 'react';
import axios from 'axios';
import AddCard from './AddCard';
import CardEditor from './CardEditor';
import './EditDeck.css';

const EditDeck = ({ deck, onClose, onUpdate }) => {
  const [cards, setCards] = useState(deck.cards || []);
  const [showAddCard, setShowAddCard] = useState(false);
  const [editingCardIndex, setEditingCardIndex] = useState(null);
  const [deckPublished, setDeckPublished] = useState(deck.isPublished);

  const API_URL = 'http://localhost:3000/api/flashcards';
  const token = localStorage.getItem('token');

  const handleAddCard = async (cardData) => {
    try {
      await axios.post(`${API_URL}/${deck._id}/cards`, { cards: [cardData] }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCards([...cards, cardData]);
      setShowAddCard(false);
      alert('Card added successfully!');
    } catch (err) {
      alert('Failed to add card');
    }
  };

  const handleEditCard = async (updatedCard) => {
    try {
      const cardId = cards[editingCardIndex]._id;
      await axios.put(`${API_URL}/${deck._id}/cards/${cardId}`, updatedCard, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const newCards = [...cards];
      newCards[editingCardIndex] = updatedCard;
      setCards(newCards);
      setEditingCardIndex(null);
      alert('Card updated successfully!');
    } catch (err) {
      alert('Failed to update card');
    }
  };

  const handleDeleteCard = async (index) => {
    if (!window.confirm('Delete this card?')) return;

    try {
      const cardId = cards[index]._id;
      await axios.delete(`${API_URL}/${deck._id}/cards/${cardId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCards(cards.filter((_, i) => i !== index));
      alert('Card deleted!');
    } catch (err) {
      alert('Failed to delete card');
    }
  };

  const handlePublish = async () => {
    if (cards.length === 0) {
      alert('Add at least one card before publishing');
      return;
    }

    try {
      await axios.put(`${API_URL}/${deck._id}/publish`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDeckPublished(true);
      alert('Deck published successfully!');
      onUpdate();
    } catch (err) {
      alert('Failed to publish deck');
    }
  };

  return (
    <div className="modal-overlay full-screen">
      <div className="edit-deck-container">
        <div className="edit-header">
          <h2>📝 {deck.title}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="deck-info">
          <p><strong>Course:</strong> {deck.courseId?.name}</p>
          <p><strong>Status:</strong> {deckPublished ? '✓ Published' : '○ Draft'}</p>
          <p><strong>Cards:</strong> {cards.length}</p>
        </div>

        {deckPublished && (
          <div className="warning-box">
            ⚠️ This deck is published. You cannot edit or delete cards. Create a new version to make changes.
          </div>
        )}

        <div className="cards-section">
          <div className="section-header">
            <h3>🎴 Flashcards ({cards.length})</h3>
            {!deckPublished && (
              <button
                className="btn-add-card"
                onClick={() => setShowAddCard(true)}
              >
                + Add Card
              </button>
            )}
          </div>

          {showAddCard && (
            <AddCard
              onAdd={handleAddCard}
              onCancel={() => setShowAddCard(false)}
            />
          )}

          <div className="cards-list">
            {cards.length === 0 ? (
              <p className="no-cards">No cards yet. Add your first card!</p>
            ) : (
              cards.map((card, index) => (
                <div key={index} className="card-item">
                  <div className="card-content">
                    <div className="card-type-badge">{card.type?.toUpperCase()}</div>
                    <div className="card-text">
                      <p><strong>Q:</strong> {card.question}</p>
                      <p><strong>A:</strong> {card.answer}</p>
                      {card.lectureTimestamp && (
                        <small className="timestamp">⏱️ {card.lectureTimestamp}</small>
                      )}
                    </div>
                  </div>
                  <div className="card-actions">
                    {!deckPublished && (
                      <>
                        <button
                          className="btn-small btn-edit"
                          onClick={() => setEditingCardIndex(index)}
                        >
                          ✏️
                        </button>
                        <button
                          className="btn-small btn-delete"
                          onClick={() => handleDeleteCard(index)}
                        >
                          🗑️
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {editingCardIndex !== null && (
          <CardEditor
            card={cards[editingCardIndex]}
            onSave={handleEditCard}
            onCancel={() => setEditingCardIndex(null)}
          />
        )}

        <div className="edit-footer">
          <button className="btn-cancel" onClick={onClose}>Close</button>
          {!deckPublished && (
            <button className="btn-publish" onClick={handlePublish}>
              🚀 Publish Deck
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditDeck;