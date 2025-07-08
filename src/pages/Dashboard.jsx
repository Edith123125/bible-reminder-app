import { useEffect, useState } from 'react';
import bibleBooks from '../data/bibleData';
import Select from 'react-select';

export default function Dashboard() {
  const [selectedBook, setSelectedBook] = useState('Matthew');
  const [readChapters, setReadChapters] = useState([]);

  const chapters = Array.from(
    { length: bibleBooks.find(book => book.name === selectedBook)?.chapters || 0 },
    (_, i) => ({ id: i + 1, chapter: `${selectedBook} ${i + 1}` })
  );

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(`readChapters-${selectedBook}`)) || [];
    setReadChapters(stored);
  }, [selectedBook]);

  const toggleChapter = (id) => {
    let updated;
    if (readChapters.includes(id)) {
      updated = readChapters.filter(chap => chap !== id);
    } else {
      updated = [...readChapters, id];
    }
    setReadChapters(updated);
    localStorage.setItem(`readChapters-${selectedBook}`, JSON.stringify(updated));
  };

  // Prepare options for react-select
  const options = bibleBooks.map(book => ({
    value: book.name,
    label: book.name,
  }));

  return (
    <div>
      <h1>Bible Reading Plan</h1>

      <label style={{ display: 'block', marginBottom: '1rem' }}>
        Select Book:
        <Select
          options={options}
          value={options.find(option => option.value === selectedBook)}
          onChange={(option) => setSelectedBook(option.value)}
          isClearable={false}
          placeholder="Type or select a book..."
        />
      </label>

      <div style={{ marginBottom: '1rem' }}>
        <strong>Progress:</strong> {readChapters.length} / {chapters.length} chapters read
        <div style={{
          height: '12px',
          backgroundColor: '#eee',
          borderRadius: '4px',
          marginTop: '4px',
          overflow: 'hidden',
        }}>
          <div style={{
            width: `${(readChapters.length / chapters.length) * 100}%`,
            backgroundColor: '#4caf50',
            height: '100%',
          }} />
        </div>
      </div>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {chapters.map(({ id, chapter }) => (
          <li
            key={id}
            onClick={() => toggleChapter(id)}
            style={{
              cursor: 'pointer',
              padding: '8px',
              margin: '4px 0',
              backgroundColor: readChapters.includes(id) ? '#d4edda' : '#f8d7da',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          >
            {chapter} {readChapters.includes(id) && '✅'}
          </li>
        ))}
      </ul>
    </div>
  );
}
