import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import './Editor.css';

export default function Editor() {
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('Saved');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const loadSession = async () => {
      try {
        const res = await api.get('/sessions');
        if (res.data && res.data.length > 0) {
          setContent(res.data[0].content || '');
        }

      } catch (err) {
        console.error("Failed to load sessions");
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, [navigate]);

  const handleSave = async () => {
    setStatus('Saving...');
    try {
      await api.post('/sessions', { content });
      setStatus('Saved');
      
    } catch (err) {
      setStatus('Save Failed');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (isLoading) return <div className="editor-layout"><div className="loading">Loading...</div></div>;

  return (
    <div className="editor-layout">
      <header className="editor-header">
        <div className="editor-brand">Vi-Notes Editor</div>
        <div className="editor-actions">
          <span className="status-text">{status}</span>
          <button onClick={handleSave} className="btn-secondary">Save Session</button>
          <button onClick={handleLogout} className="btn-outline">Logout</button>
        </div>
      </header>
      <main className="editor-main">
        <textarea
          className="editor-textarea"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setStatus('Unsaved Changes');
          }}
          placeholder="Start writing your thoughts..."
          autoFocus
        />
      </main>
    </div>
  );
}
