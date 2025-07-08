import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function ChapterView() {
  const { book, chapter } = useParams();
  const [verses, setVerses] = useState([]);
  const [readVerses, setReadVerses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const storageKey = `readVerses-${book}-${chapter}`;

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`https://bible-api.com/${book}+${chapter}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch verses');
        return res.json();
      })
      .then(data => {
        setVerses(data.verses || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });

    // Load read verses from localStorage
    const saved = JSON.parse(localStorage.getItem(storageKey)) || [];
    setReadVerses(saved);
  }, [book, chapter]);

  const toggleVerse = (verseNumber) => {
    let updated;
    if (readVerses.includes(verseNumber)) {
      updated = readVerses.filter(v => v !== verseNumber);
    } else {
      updated = [...readVerses, verseNumber];
    }
    setReadVerses(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  if (loading) return <p>Loading verses...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{book} Chapter {chapter}</h2>
      <Link to="/dashboard">← Back to Dashboard</Link>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {verses.map(verse => (
          <li
            key={verse.verse}
            onClick={() => toggleVerse(verse.verse)}
            style={{
              cursor: 'pointer',
              backgroundColor: readVerses.includes(verse.verse) ? '#d4edda' : '#f8d7da',
              margin: '0.25rem 0',
              padding: '0.5rem',
              borderRadius: '5px',
            }}
          >
            <strong>{verse.verse}.</strong> {verse.text.trim()}
            {readVerses.includes(verse.verse) && ' ✅'}
          </li>
        ))}
      </ul>
    </div>
  );
}
