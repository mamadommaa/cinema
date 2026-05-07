-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Хост: localhost:8889
-- Время создания: Май 07 2026 г., 11:15
-- Версия сервера: 8.0.40
-- Версия PHP: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `cinema`
--

-- --------------------------------------------------------

--
-- Структура таблицы `currentWeek`
--

CREATE TABLE `currentWeek` (
  `id` int NOT NULL,
  `movie_id` int NOT NULL,
  `week_start` date NOT NULL,
  `week_end` date NOT NULL,
  `position` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `currentWeek`
--

INSERT INTO `currentWeek` (`id`, `movie_id`, `week_start`, `week_end`, `position`) VALUES
(11, 126, '2026-05-01', '2026-08-01', 1),
(12, 127, '2026-05-01', '2026-08-01', 2),
(13, 129, '2026-05-01', '2026-08-01', 3),
(14, 130, '2026-05-01', '2026-08-01', 4),
(15, 128, '2026-05-01', '2026-08-01', 5);

-- --------------------------------------------------------

--
-- Структура таблицы `favorites`
--

CREATE TABLE `favorites` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `movie_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `favorites`
--

INSERT INTO `favorites` (`id`, `user_id`, `movie_id`, `created_at`) VALUES
(6, 1, 133, '2026-04-24 13:48:35'),
(8, 1, 125, '2026-04-24 13:48:44'),
(9, 1, 123, '2026-04-28 11:37:11'),
(10, 1, 131, '2026-04-28 14:46:52');

-- --------------------------------------------------------

--
-- Структура таблицы `genres`
--

CREATE TABLE `genres` (
  `id` int NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `genres`
--

INSERT INTO `genres` (`id`, `name`) VALUES
(15, 'action'),
(20, 'adventure'),
(18, 'animation'),
(9, 'comedy'),
(12, 'crime'),
(14, 'documentary'),
(6, 'drama'),
(8, 'family'),
(5, 'fantasy'),
(1, 'history'),
(2, 'horror'),
(11, 'music'),
(7, 'mystery'),
(10, 'romance'),
(3, 'scifi'),
(4, 'stand-up'),
(22, 'test'),
(16, 'thriller'),
(13, 'tv-movie'),
(19, 'war'),
(17, 'western');

-- --------------------------------------------------------

--
-- Структура таблицы `movies`
--

CREATE TABLE `movies` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `posterUrl` varchar(500) DEFAULT NULL,
  `tmdbRating` decimal(3,1) DEFAULT NULL,
  `releaseYear` int DEFAULT NULL,
  `runtime` decimal(5,2) DEFAULT NULL,
  `plot` text,
  `backdropUrl` varchar(500) DEFAULT NULL,
  `language` varchar(255) DEFAULT NULL,
  `budget` varchar(50) DEFAULT NULL,
  `revenue` varchar(50) DEFAULT NULL,
  `director` varchar(255) DEFAULT NULL,
  `production` varchar(255) DEFAULT NULL,
  `awardsSummary` text,
  `videoUrl` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `movies`
--

INSERT INTO `movies` (`id`, `title`, `posterUrl`, `tmdbRating`, `releaseYear`, `runtime`, `plot`, `backdropUrl`, `language`, `budget`, `revenue`, `director`, `production`, `awardsSummary`, `videoUrl`) VALUES
(123, 'Джон Уик', 'http://localhost:5000/uploads/john-wick-poster.jpg', 7.4, 2014, 101.00, 'Наёмный убийца выходит на тропу войны после того, как у него угоняют машину и убивают собаку — последний подарок покойной жены.', 'http://localhost:5000/uploads/john-wick-backdrop.jpg', 'en', NULL, NULL, 'Чад Стахелски', NULL, NULL, NULL),
(124, 'Гарри Поттер и философский камень', 'http://localhost:5000/uploads/garry-potter-1-poster.jpg', 7.6, 2001, 152.00, 'Мальчик-сирота Гарри Поттер узнаёт, что он волшебник, и поступает в школу чародейства и волшебства Хогвартс, где раскрывает тайну философского камня.', 'http://localhost:5000/uploads/garry-potter-1-backdrop.jpg', 'en', NULL, NULL, 'Крис Коламбус', NULL, NULL, NULL),
(125, 'Мастер и Маргарита', 'http://localhost:5000/uploads/master-margarita-poster.jpg', 7.8, 2024, 157.00, 'Талантливый писатель, автор романа о Понтии Пилате, оказывается в эпицентре борьбы света и тьмы. В его жизнь врывается загадочный профессор Воланд со своей свитой, заставляя пересмотреть всё, во что он верил.', 'http://localhost:5000/uploads/master-margarita-backdrop.jpg', 'ru', NULL, NULL, 'Михаил Локшин', NULL, NULL, NULL),
(126, 'Троя', 'http://localhost:5000/uploads/troy-poster.jpg', 7.3, 2004, 163.00, 'История о любви, предательстве и войне, развязанной из-за прекрасной Елены...', 'http://localhost:5000/uploads/troy-backdrop.jpg', 'Αρχαία Ελληνικά, English', '$175 млн', '$497 млн', 'Вольфганг Петерсен', 'Warner Bros. Pictures, Plan B Entertainment', 'Номинация на Оскар (лучшие костюмы)', NULL),
(127, 'Гладиатор', 'http://localhost:5000/uploads/gladiator-poster.jpg', 8.5, 2000, 155.00, 'Бывший римский генерал Максимус становится гладиатором и борется за справедливость против продажного императора Коммода.', 'http://localhost:5000/uploads/gladiator-backdrop.jpg', 'en', NULL, NULL, 'Ридли Скотт', NULL, NULL, NULL),
(128, 'Помпеи', 'http://localhost:5000/uploads/pompeii-poster.jpg', 6.0, 2014, 105.00, 'Молодой раб оказывается в центре извержения Везувия и борется за выживание и любовь к дочери сенатора.', 'http://localhost:5000/uploads/pompeii-backdrop.jpg', 'en', NULL, NULL, 'Пол У. С. Андерсон', NULL, NULL, NULL),
(129, 'Бен-Гур', 'http://localhost:5000/uploads/ben-hur-poster.jpg', 8.1, 1959, 212.00, 'Иудейский принц Иуда Бен-Гур становится рабом после предательства друга. Он ищет искупления и мести, пересекаясь с историей Иисуса Христа.', 'http://localhost:5000/uploads/ben-hur-backdrop.jpg', 'en', NULL, NULL, 'Уильям Уайлер', NULL, NULL, NULL),
(130, 'Агора', 'http://localhost:5000/uploads/agora-poster.jpg', 7.1, 2009, 126.00, 'История Гипатии Александрийской — женщины-учёного, которая борется за знание и свободу мысли в Римском Египте на фоне религиозных конфликтов.', 'http://localhost:5000/uploads/agora-backdrop.jpg', 'en', NULL, NULL, 'Алехандро Аменабар', NULL, NULL, NULL),
(131, 'Мумия', 'http://localhost:5000/uploads/mummy-poster.jpg', 7.1, 1999, 125.00, 'Авантюрист Рик О’Коннелл случайно пробуждает древнюю мумию жреца Имхотепа, который начинает насылать проклятия на тех, кто потревожил его гробницу.', 'http://localhost:5000/uploads/mummy-backdrop.jpg', 'en', NULL, NULL, 'Стивен Соммерс', NULL, NULL, NULL),
(132, 'Царь скорпионов', 'http://localhost:5000/uploads/scorpion-king-poster.jpg', 5.5, 2002, 92.00, 'Приквел «Мумии» о короле-воине Матиасе, который объединяет пустынные племена для борьбы с тираном.', 'http://localhost:5000/uploads/scorpion-king-backdrop.jpg', 'en', NULL, NULL, 'Чак Рассел', NULL, NULL, NULL),
(133, 'Пираты Карибского моря', 'http://localhost:5000/uploads/pirates-poster.jpg', 8.0, 2003, 0.53, 'Харизматичный пират Джек Воробей объединяется с кузнецом Уиллом Тёрнером, чтобы спасти похищенную дочь губернатора и вернуть свой корабль «Чёрная жемчужина» у капитана Барбоссы, который вместе с командой пал под действием древнего ацтекского проклятия.', 'http://localhost:5000/uploads/pirates-backdrop.jpg', 'Английский', '$140 млн', '$654 млн', 'Гор Вербински', 'Walt Disney Pictures, Jerry Bruckheimer Films', 'Номинация на Оскар (лучший звук, лучший грим, лучший звуковой монтаж), Премия MTV за лучший фильм', 'http://localhost:5000/uploads/video/pirates.mov'),
(134, 'Великий Гэтсби', 'http://localhost:5000/uploads/gatsby-poster.jpg', 7.3, 2013, 143.00, 'Таинственный миллионер Джей Гэтсби устраивает роскошные вечеринки в надежде воссоединиться с Дейзи, женщиной, которую он потерял много лет назад. Рассказ ведётся от лица его соседа, писателя Ника Кэррауэя.', 'http://localhost:5000/uploads/gatsby-backdrop.jpg', 'en', NULL, NULL, 'Баз Лурман', NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Структура таблицы `movie_genres`
--

CREATE TABLE `movie_genres` (
  `movie_id` int NOT NULL,
  `genre_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `movie_genres`
--

INSERT INTO `movie_genres` (`movie_id`, `genre_name`) VALUES
(123, 'action'),
(126, 'action'),
(127, 'action'),
(128, 'action'),
(129, 'action'),
(131, 'action'),
(132, 'action'),
(133, 'action'),
(124, 'adventure'),
(126, 'adventure'),
(127, 'adventure'),
(128, 'adventure'),
(129, 'adventure'),
(131, 'adventure'),
(132, 'adventure'),
(133, 'adventure'),
(125, 'drama'),
(126, 'drama'),
(127, 'drama'),
(128, 'drama'),
(129, 'drama'),
(130, 'drama'),
(134, 'drama'),
(124, 'family'),
(124, 'fantasy'),
(125, 'fantasy'),
(131, 'fantasy'),
(132, 'fantasy'),
(133, 'fantasy'),
(127, 'history'),
(128, 'history'),
(129, 'history'),
(130, 'history'),
(134, 'history'),
(125, 'romance'),
(126, 'romance'),
(128, 'romance'),
(130, 'romance'),
(134, 'romance'),
(126, 'war');

-- --------------------------------------------------------

--
-- Структура таблицы `quiz`
--

CREATE TABLE `quiz` (
  `id` int NOT NULL,
  `movie_id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `quiz`
--

INSERT INTO `quiz` (`id`, `movie_id`, `title`, `created_at`) VALUES
(1, 133, 'Пираты Карибского моря: Проклятие Чёрной жемчужины', '2026-04-28 14:58:54');

-- --------------------------------------------------------

--
-- Структура таблицы `quiz_options`
--

CREATE TABLE `quiz_options` (
  `id` int NOT NULL,
  `question_id` int NOT NULL,
  `option_text` varchar(500) NOT NULL,
  `is_correct` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `quiz_options`
--

INSERT INTO `quiz_options` (`id`, `question_id`, `option_text`, `is_correct`) VALUES
(1, 1, 'Джек Воробей', 1),
(2, 1, 'Уилл Тёрнер', 0),
(3, 1, 'Гектор Барбосса', 0),
(4, 2, 'Мстящий голландец', 0),
(5, 2, 'Чёрная жемчужина', 1),
(6, 2, 'Летучий голландец', 0),
(7, 3, 'Орландо Блум', 0),
(8, 3, 'Кира Найтли', 0),
(9, 3, 'Джонни Депп', 1),
(10, 4, 'Вечная жизнь под водой', 0),
(11, 4, 'Превращение в скелетов при лунном свете', 1),
(12, 4, 'Крик души каждую ночь', 0),
(13, 5, 'Капитан Норрингтон', 0),
(14, 5, 'Гектор Барбосса', 1),
(15, 5, 'Дейви Джонс', 0);

-- --------------------------------------------------------

--
-- Структура таблицы `quiz_questions`
--

CREATE TABLE `quiz_questions` (
  `id` int NOT NULL,
  `quiz_id` int NOT NULL,
  `question_text` text NOT NULL,
  `sort_order` int DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `quiz_questions`
--

INSERT INTO `quiz_questions` (`id`, `quiz_id`, `question_text`, `sort_order`) VALUES
(1, 1, 'Как зовут главного героя — харизматичного пирата?', 1),
(2, 1, 'Как называется корабль Джека Воробья?', 2),
(3, 1, 'Кто играет капитана Джека Воробья?', 3),
(4, 1, 'Какое проклятие лежит на команде «Чёрной жемчужины»?', 4),
(5, 1, 'Кто является главным антагонистом в фильме?', 5);

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `firstName` varchar(100) DEFAULT NULL,
  `lastName` varchar(100) DEFAULT NULL,
  `createdAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `email`, `password`, `firstName`, `lastName`, `createdAt`) VALUES
(1, 'mamadommaa@gmail.com', '$2b$10$5/VNkShYqG58ek.Ynr6uZ.hNdqkH6XFs9uzwoFdrfzerE4gAgo2te', 'Дарья', 'Гурина', '2026-04-24 12:25:20'),
(2, 'maria@test.com', '$2b$10$BcV6hehDKe2xgeZGIncO6e7D6tAv.Ee8.HRSVTFLHYy/d5sjBaQA2', 'Мария', 'Иванова', '2026-04-24 12:41:20');

-- --------------------------------------------------------

--
-- Структура таблицы `user_quiz_results`
--

CREATE TABLE `user_quiz_results` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `quiz_id` int NOT NULL,
  `score` int DEFAULT '0',
  `passed` tinyint(1) DEFAULT '0',
  `completed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `watch_progress`
--

CREATE TABLE `watch_progress` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `movie_id` int NOT NULL,
  `progress` int DEFAULT '0',
  `completed` tinyint(1) DEFAULT '0',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Дамп данных таблицы `watch_progress`
--

INSERT INTO `watch_progress` (`id`, `user_id`, `movie_id`, `progress`, `completed`, `updated_at`) VALUES
(1, 1, 133, 100, 1, '2026-05-05 17:15:07');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `currentWeek`
--
ALTER TABLE `currentWeek`
  ADD PRIMARY KEY (`id`),
  ADD KEY `movie_id` (`movie_id`);

--
-- Индексы таблицы `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_movie` (`user_id`,`movie_id`);

--
-- Индексы таблицы `genres`
--
ALTER TABLE `genres`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Индексы таблицы `movies`
--
ALTER TABLE `movies`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `movie_genres`
--
ALTER TABLE `movie_genres`
  ADD PRIMARY KEY (`movie_id`,`genre_name`),
  ADD KEY `genre_name` (`genre_name`);

--
-- Индексы таблицы `quiz`
--
ALTER TABLE `quiz`
  ADD PRIMARY KEY (`id`),
  ADD KEY `movie_id` (`movie_id`);

--
-- Индексы таблицы `quiz_options`
--
ALTER TABLE `quiz_options`
  ADD PRIMARY KEY (`id`),
  ADD KEY `question_id` (`question_id`);

--
-- Индексы таблицы `quiz_questions`
--
ALTER TABLE `quiz_questions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `quiz_id` (`quiz_id`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Индексы таблицы `user_quiz_results`
--
ALTER TABLE `user_quiz_results`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_quiz` (`user_id`,`quiz_id`),
  ADD KEY `quiz_id` (`quiz_id`);

--
-- Индексы таблицы `watch_progress`
--
ALTER TABLE `watch_progress`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_movie` (`user_id`,`movie_id`),
  ADD KEY `movie_id` (`movie_id`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `currentWeek`
--
ALTER TABLE `currentWeek`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT для таблицы `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT для таблицы `genres`
--
ALTER TABLE `genres`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT для таблицы `movies`
--
ALTER TABLE `movies`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=135;

--
-- AUTO_INCREMENT для таблицы `quiz`
--
ALTER TABLE `quiz`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT для таблицы `quiz_options`
--
ALTER TABLE `quiz_options`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT для таблицы `quiz_questions`
--
ALTER TABLE `quiz_questions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `user_quiz_results`
--
ALTER TABLE `user_quiz_results`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `watch_progress`
--
ALTER TABLE `watch_progress`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=186;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `currentWeek`
--
ALTER TABLE `currentWeek`
  ADD CONSTRAINT `currentweek_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `movie_genres`
--
ALTER TABLE `movie_genres`
  ADD CONSTRAINT `movie_genres_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`),
  ADD CONSTRAINT `movie_genres_ibfk_2` FOREIGN KEY (`genre_name`) REFERENCES `genres` (`name`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `quiz`
--
ALTER TABLE `quiz`
  ADD CONSTRAINT `quiz_ibfk_1` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `quiz_options`
--
ALTER TABLE `quiz_options`
  ADD CONSTRAINT `quiz_options_ibfk_1` FOREIGN KEY (`question_id`) REFERENCES `quiz_questions` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `quiz_questions`
--
ALTER TABLE `quiz_questions`
  ADD CONSTRAINT `quiz_questions_ibfk_1` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `user_quiz_results`
--
ALTER TABLE `user_quiz_results`
  ADD CONSTRAINT `user_quiz_results_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_quiz_results_ibfk_2` FOREIGN KEY (`quiz_id`) REFERENCES `quiz` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `watch_progress`
--
ALTER TABLE `watch_progress`
  ADD CONSTRAINT `watch_progress_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `watch_progress_ibfk_2` FOREIGN KEY (`movie_id`) REFERENCES `movies` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
