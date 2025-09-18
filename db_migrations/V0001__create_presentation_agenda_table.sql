-- Создание таблицы для повестки дня презентации
CREATE TABLE presentation_agenda (
    id SERIAL PRIMARY KEY,
    number VARCHAR(10) NOT NULL,
    title VARCHAR(255) NOT NULL,
    duration VARCHAR(50) NOT NULL,
    sort_order INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Добавление тестовых данных
INSERT INTO presentation_agenda (number, title, duration, sort_order) VALUES
('01', 'Введение в тему', '5 мин', 1),
('02', 'Основная часть', '15 мин', 2),
('03', 'Ключевые моменты', '10 мин', 3),
('04', 'Выводы и заключение', '5 мин', 4);