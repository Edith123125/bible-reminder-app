import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ChapterView from './pages/ChapterView';

function App() {
  useEffect(() => {
    // Request browser notification permission
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission().then(permission => {
        console.log('Notification permission:', permission);
      });
    }

    const checkTimeAndNotify = () => {
      const now = new Date();
      const is8PM = now.getHours() === 20 && now.getMinutes() === 0;
      const alreadyNotified = localStorage.getItem('notifiedToday') === now.toDateString();

      if (is8PM && !alreadyNotified) {
        localStorage.setItem('notifiedToday', now.toDateString());

        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('📖 Bible Reminder', {
            body: 'It’s 8:00 PM — time to read your Bible 📚🙏',
            icon: '/bible-icon.png',
          });
        } else {
          alert("📖 Bible Reminder: It's 8:00 PM — time to read your Bible!");
        }
      }
    };

    const intervalId = setInterval(checkTimeAndNotify, 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/:book/:chapter" element={<ChapterView />} />
      </Routes>
    </Router>
  );
}

export default App;
