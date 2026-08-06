const express = require('express');
const path = require('path');

const app = express();
// Render автоматически передает порт в переменную окружения PORT
const PORT = process.env.PORT || 3000;

// Раздаем статические файлы (HTML, CSS, JS) из папки public
app.use(express.static(path.join(__dirname, 'public')));

// Главный маршрут
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Пример API-эндпоинта для VTT (на будущее)
app.get('/api/status', (req, res) => {
    res.json({ status: 'KPMS VTT Server is running', system: 'Harry Potter RPG' });
});

app.listen(PORT, () => {
    console.log(`Сервер KPMS VTT запущен на порту ${PORT}`);
});
