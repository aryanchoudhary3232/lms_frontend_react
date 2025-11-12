import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './TeacherFlashcards.css';
import CreateFlashcardDeck from './CreateFlashcardDeck';
import FlashcardDeckList from './FlashcardDeckList';
import EditDeck from './EditDeck';

const TeacherFlashcards = () => {
  const [decks, setDecks] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingDeck, setEditingDeck] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:3000/api/flashcards';
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchDecks();
  }, []);

  const fetchDecks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/teacher/decks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDecks(response.data.data);
      setError(null);
    } catch (err) {
      setError('Failed to load flashcard decks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDeck = async (deckData) => {
    try {
      const response = await axios.post(`${API_URL}/create`, deckData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDecks([...decks, response.data.data]);
      setShowCreateModal(false);
      alert('Flashcard deck created successfully!');
    } catch (err) {
      alert('Failed to create deck: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteDeck = async (deckId) => {
    if (!window.confirm('Are you sure you want to delete this deck?')) return;

    try {
      await axios.delete(`${API_URL}/${deckId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDecks(decks.filter(d => d._id !== deckId));
      alert('Deck deleted successfully!');
    } catch (err) {
      alert('Failed to delete deck');
    }
  };

  if (loading) return <div className="loading">Loading flashcards...</div>;

  return (
    <div className="teacher-flashcards">
      <div className="flashcard-header">
        <h1>📚 My Flashcard Decks</h1>
        <button 
          className="btn-create-deck"
          onClick={() => setShowCreateModal(true)}
        >
          + Create New Deck
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showCreateModal && (
        <CreateFlashcardDeck
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateDeck}
        />
      )}

      {editingDeck && (
        <EditDeck
          deck={editingDeck}
          onClose={() => setEditingDeck(null)}
          onUpdate={fetchDecks}
        />
      )}

      <FlashcardDeckList
        decks={decks}
        onEdit={setEditingDeck}
        onDelete={handleDeleteDeck}
      />
    </div>
  );
};

export default TeacherFlashcards;