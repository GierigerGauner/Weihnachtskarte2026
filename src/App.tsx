import { Navigate, Route, Routes } from 'react-router-dom';
import Experience from './teaser';

/** Eine Seite unter `/`. Mit `?debug=1` erscheint das Event-Log, `?embed=1` blendet den Phone-Frame aus. */
export function App() {
  return (
    <Routes>
      <Route path="/" element={<Experience />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
