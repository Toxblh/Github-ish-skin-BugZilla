// Select all elements that contain the "mailto:" email link
let emailLinks = document.querySelectorAll('a.email[href^="mailto:"]');

if (!emailLinks.length) {
    console.log('Email links not found.');
    emailLinks = document.querySelectorAll('.vcard .fn');
}

emailLinks.forEach(link => {
    // Extract the email address from the "mailto:" href attribute or the name
    const linkHref = link.getAttribute('href');
    const email = linkHref ? linkHref.replace('mailto:', '').trim() : link.textContent.trim();

    // Use CryptoJS to generate MD5 hash of the email (Gravatar uses lowercased MD5 hash of the email)
    const emailHash = CryptoJS.MD5(email.toLowerCase()).toString();

    // Create Gravatar URL (you can adjust the size of the avatar by changing the size parameter)
    const gravatarUrl = `https://www.gravatar.com/avatar/${emailHash}?s=80&d=identicon`;

    // Create an img element for the Gravatar
    const img = document.createElement('img');
    img.src = gravatarUrl;
    img.alt = 'Gravatar';
    img.classList.add('bz_avatar');

    // Insert the Gravatar image before the email link
    link.parentElement.insertBefore(img, link);
});



(function() {
    // Шаг 1: Найти таблицу с id "attachment_table"
    var attachmentTable = document.getElementById('attachment_table');
    if (!attachmentTable) {
        console.log('Таблица вложений не найдена.');
        return;
    }

    // Шаг 2: Собрать идентификаторы изображений из таблицы
    var imageAttachmentIds = new Set();
    var rows = attachmentTable.getElementsByTagName('tr');
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var className = row.className;
        // Проверяем, является ли строка вложением изображения
        if (className && className.startsWith('bz_contenttype_image')) {
            var link = row.querySelector('a[href^="attachment.cgi?id="]');
            if (link) {
                var href = link.getAttribute('href');
                var match = href.match(/id=(\d+)/);
                if (match) {
                    var attachmentId = match[1];
                    imageAttachmentIds.add(attachmentId);
                }
            }
        }
    }

    if (imageAttachmentIds.size === 0) {
        console.log('Изображения во вложениях не найдены.');
        return;
    }

    // Шаг 3: Найти все элементы <pre> с классом "bz_comment_text"
    var preElements = document.querySelectorAll('pre.bz_comment_text');

    preElements.forEach(function(pre) {
        // Найти все ссылки внутри текущего <pre>, исключая ссылки с action=edit
        var links = pre.querySelectorAll('a[href^="attachment.cgi?id="]:not([href*="action=edit"])');
        links.forEach(function(link) {
            var href = link.getAttribute('href');
            var match = href.match(/id=(\d+)/);
            if (match) {
                var attachmentId = match[1];
                if (imageAttachmentIds.has(attachmentId)) {
                    // Проверяем, не добавлено ли уже изображение внутри ссылки
                    if (!link.querySelector('img')) {
                        // Создать элемент <img>
                        var img = document.createElement('img');
                        // Формируем URL изображения, добавляя параметр action=view
                        img.src = href + '&action=view';
                        img.style.maxWidth = '100%';
                        img.style.display = 'block';
                        img.style.marginTop = '10px';
                        img.style.maxHeight = '600px';
                        img.alt = 'Вложенное изображение';

                        // Вставить <img> внутрь ссылки перед текстом
                        link.insertBefore(img, link.firstChild);
                    }
                }
            }
        });
    });

    console.log('Обработка изображений завершена.');
})();

(function() {
    /**
     * Функция для преобразования абсолютной даты в относительное время на русском языке.
     * @param {Date} date - Абсолютная дата.
     * @returns {string} - Относительное время (например, "6 часов назад").
     */
    function getRelativeTime(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        const intervals = [
            { label: 'год', seconds: 31536000 },
            { label: 'месяц', seconds: 2592000 },
            { label: 'день', seconds: 86400 },
            { label: 'час', seconds: 3600 },
            { label: 'минута', seconds: 60 },
            { label: 'секунда', seconds: 1 }
        ];

        for (let interval of intervals) {
            const count = Math.floor(diffInSeconds / interval.seconds);
            if (count >= 1) {
                return `${count} ${getRussianPlural(count, interval.label)} назад`;
            }
        }
        return 'только что';
    }

    /**
     * Функция для получения правильной формы слова на русском языке в зависимости от числа.
     * @param {number} number - Число.
     * @param {string} word - Слово в именительном падеже единственного числа.
     * @returns {string} - Слово в нужной форме.
     */
    function getRussianPlural(number, word) {
        const forms = {
            'год': ['год', 'года', 'лет'],
            'месяц': ['месяц', 'месяца', 'месяцев'],
            'день': ['день', 'дня', 'дней'],
            'час': ['час', 'часа', 'часов'],
            'минута': ['минута', 'минуты', 'минут'],
            'секунда': ['секунда', 'секунды', 'секунд']
        };

        const form = forms[word];
        if (!form) return word;

        const n = Math.abs(number) % 100;
        const n1 = n % 10;

        if (n > 10 && n < 20) return form[2];
        if (n1 > 1 && n1 < 5) return form[1];
        if (n1 === 1) return form[0];
        return form[2];
    }

    /**
     * Функция для парсинга строки даты в объект Date.
     * Предполагается формат: "YYYY-MM-DD HH:MM:SS TZ"
     * @param {string} dateString - Строка даты.
     * @returns {Date|null} - Объект Date или null, если парсинг не удался.
     */
    function parseDateString(dateString) {
        // Пример строки: "2024-09-25 10:49:26 MSK"
        // Удаляем временную зону для парсинга
        const cleanedString = dateString.replace(/ [A-Z]{2,4}$/, '');
        const date = new Date(cleanedString);
        return isNaN(date.getTime()) ? null : date;
    }

    // Шаг 1: Найти все элементы <span> с классом "bz_comment_time"
    const timeElements = document.querySelectorAll('span.bz_comment_time');

    timeElements.forEach(function(span) {
        const originalText = span.textContent.trim();
        const date = parseDateString(originalText);

        if (date) {
            const relativeTime = getRelativeTime(date);
            span.textContent = relativeTime;
            span.title = originalText; // Устанавливаем всплывающую подсказку с оригинальной датой
        } else {
            console.warn(`Не удалось распарсить дату: "${originalText}"`);
        }
    });

    console.log('Преобразование дат завершено.');
})();

(function() {
    // Функции для обработки даты

    /**
     * Функция для преобразования абсолютной даты в относительное время на русском языке.
     * @param {Date} date - Абсолютная дата.
     * @returns {string} - Относительное время (например, "6 часов назад").
     */
    function getRelativeTime(date) {
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        const intervals = [
            { label: 'год', seconds: 31536000 },
            { label: 'месяц', seconds: 2592000 },
            { label: 'день', seconds: 86400 },
            { label: 'час', seconds: 3600 },
            { label: 'минута', seconds: 60 },
            { label: 'секунда', seconds: 1 }
        ];

        for (let interval of intervals) {
            const count = Math.floor(diffInSeconds / interval.seconds);
            if (count >= 1) {
                return `${count} ${getRussianPlural(count, interval.label)} назад`;
            }
        }
        return 'только что';
    }

    /**
     * Функция для получения правильной формы слова на русском языке в зависимости от числа.
     * @param {number} number - Число.
     * @param {string} word - Слово в именительном падеже единственного числа.
     * @returns {string} - Слово в нужной форме.
     */
    function getRussianPlural(number, word) {
        const forms = {
            'год': ['год', 'года', 'лет'],
            'месяц': ['месяц', 'месяца', 'месяцев'],
            'день': ['день', 'дня', 'дней'],
            'час': ['час', 'часа', 'часов'],
            'минута': ['минута', 'минуты', 'минут'],
            'секунда': ['секунда', 'секунды', 'секунд']
        };

        const form = forms[word];
        if (!form) return word;

        const n = Math.abs(number) % 100;
        const n1 = n % 10;

        if (n > 10 && n < 20) return form[2];
        if (n1 > 1 && n1 < 5) return form[1];
        if (n1 === 1) return form[0];
        return form[2];
    }

    /**
     * Функция для парсинга строки даты в объект Date.
     * Поддерживает различные форматы дат.
     * @param {string} dateString - Строка даты.
     * @returns {Date|null} - Объект Date или null, если парсинг не удался.
     */
    function parseDateString(dateString) {
        const now = new Date();
        let date = null;

        // Попытка распознать формат YYYY-MM-DD
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            date = new Date(dateString);
        }
        // Попытка распознать формат HH:MM:SS или HH:MM:SS
        else if (/^\d{2}:\d{2}(:\d{2})?$/.test(dateString)) {
            const [hours, minutes, seconds] = dateString.split(':').map(Number);
            date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, seconds || 0);
        }
        // Попытка распознать формат Weekday HH:MM
        else if (/^(Mon|Tue|Wed|Thu|Fri|Sat|Sun) \d{2}:\d{2}$/.test(dateString)) {
            const [weekday, time] = dateString.split(' ');
            const daysOfWeek = {
                'Sun': 0,
                'Mon': 1,
                'Tue': 2,
                'Wed': 3,
                'Thu': 4,
                'Fri': 5,
                'Sat': 6
            };
            const targetDay = daysOfWeek[weekday];

            const currentDay = now.getDay();
            let dayOffset = targetDay - currentDay;
            if (dayOffset > 0) dayOffset -= 7; // Если день в будущем, корректируем на прошлую неделю

            const targetDate = new Date(now);
            targetDate.setDate(now.getDate() + dayOffset);

            const [hours, minutes] = time.split(':').map(Number);
            targetDate.setHours(hours);
            targetDate.setMinutes(minutes);
            targetDate.setSeconds(0);
            targetDate.setMilliseconds(0);

            date = targetDate;
        }

        return date && !isNaN(date.getTime()) ? date : null;
    }

    /**
     * Функция для получения эмодзи по статусу.
     * @param {string} status - Статус задачи.
     * @returns {string} - Соответствующий эмодзи.
     */
    function getStatusEmoji(status) {
        var mapping = {
            'UNCONFIRMED': '❓',
            'NEW': '🆕',
            'ASSIGNED': '👤',
            'REOPENED': '🔄',
            'RESOLVED': '✅',
            'VERIFIED': '✔️',
            'CLOSED': '🔒'
        };
        return mapping[status] || '';
    }

    // Выбираем таблицу Bugzilla
    var table = document.querySelector('table.bz_buglist');
    if (!table) return;

    // Сохраняем и стилизуем существующий заголовок таблицы
    var headerRow = table.querySelector('tr.bz_buglist_header');
    if (headerRow) {
        headerRow.className = 'gh-table-header';
        headerRow.querySelectorAll('th').forEach(function(th) {
            th.className = 'gh-header-cell';
        });
    }

    // Добавляем класс для стилизации таблицы
    table.classList.add('gh-issues-listing');

    // Получаем все строки с задачами
    var rows = table.querySelectorAll('tr.bz_bugitem');

    // Обрабатываем каждую строку
    rows.forEach(function(row) {
        // Очищаем существующие классы
        row.className = 'gh-issue-row';

        // Извлекаем данные из ячеек
        var idCell = row.querySelector('.bz_id_column');
        var statusCell = row.querySelector('.bz_bug_status_column');
        var severityCell = row.querySelector('.bz_bug_severity_column');
        var productCell = row.querySelector('.bz_product_column');
        var componentCell = row.querySelector('.bz_component_column');
        var assignedToCell = row.querySelector('.bz_assigned_to_column');
        var reporterCell = row.querySelector('.bz_reporter_column');
        var titleCell = row.querySelector('.bz_short_desc_column');
        var opendateCell = row.querySelector('.bz_opendate_column');

        // Получаем содержимое
        var issueNumber = idCell.textContent.trim();
        var issueLink = idCell.querySelector('a').getAttribute('href');
        var statusCode = statusCell ? statusCell.querySelector('span').getAttribute('title') : '';
        var status = statusCell.textContent.trim();
        var severityTitle = severityCell ? severityCell.querySelector('span').getAttribute('title') : '';
        var productTitle = productCell ? productCell.querySelector('span').getAttribute('title') : '';
        var componentTitle = componentCell ? componentCell.querySelector('span').getAttribute('title') : '';
        var assignedTo = assignedToCell ? assignedToCell.textContent.trim() : '';
        var reporter = reporterCell ? reporterCell.textContent.trim() : '';
        var title = titleCell.textContent.trim();
        var openDateText = opendateCell ? opendateCell.textContent.trim() : '';
        var openDate = parseDateString(openDateText);

        // Обновленная переменная timeAgoText
        var timeAgoText = openDate ? 'открыт ' + getRelativeTime(openDate) : ' от ';

        // Удаляем все существующие ячейки
        row.innerHTML = '';

        // Создаем одну ячейку на всю строку
        var issueCell = document.createElement('td');
        issueCell.className = 'gh-issue-cell';
        issueCell.colSpan = opendateCell ? 10 : 9; // Указываем количество столбцов

        // Контейнер для содержания задачи
        var issueContainer = document.createElement('div');
        issueContainer.className = 'gh-issue-container';

        // Первая строка
        var firstRow = document.createElement('div');
        firstRow.className = 'gh-issue-first-row';

        // Левая часть первой строки
        var leftFirstRow = document.createElement('div');
        leftFirstRow.className = 'gh-issue-left';

        // Добавляем статус иконкой
        var statusIconSpan = document.createElement('span');
        statusIconSpan.className = 'gh-status-icon';
        statusIconSpan.textContent = getStatusEmoji(statusCode);
        leftFirstRow.appendChild(statusIconSpan);

        // Заголовок задачи
        var titleLinkElem = document.createElement('a');
        titleLinkElem.href = issueLink;
        titleLinkElem.textContent = title;
        titleLinkElem.className = 'gh-issue-link';
        leftFirstRow.appendChild(titleLinkElem);

        // Теги
        var labelsDiv = document.createElement('div');
        labelsDiv.className = 'gh-labels';

        // Тег серьезности
        if (severityTitle) {
            var severityLabel = document.createElement('span');
            severityLabel.className = 'gh-label severity-label';
            severityLabel.textContent = mapSeverityToRussian(severityTitle);
            severityLabel.style.backgroundColor = getSeverityColor(severityTitle);
            labelsDiv.appendChild(severityLabel);
        }

        // Тег продукта
        if (productTitle) {
            var productLabel = document.createElement('span');
            productLabel.className = 'gh-label';
            productLabel.textContent = productTitle;
            labelsDiv.appendChild(productLabel);
        }

        // Тег компонента
        if (componentTitle) {
            var componentLabel = document.createElement('span');
            componentLabel.className = 'gh-label component-label';
            componentLabel.textContent = componentTitle;
            labelsDiv.appendChild(componentLabel);
        }

        leftFirstRow.appendChild(labelsDiv);

        // Правая часть первой строки
        var rightFirstRow = document.createElement('div');
        rightFirstRow.className = 'gh-issue-right';
        var assigneeSpan = document.createElement('span');
        assigneeSpan.className = 'gh-assignee';
        assigneeSpan.textContent = assignedTo;
        rightFirstRow.appendChild(assigneeSpan);

        firstRow.appendChild(leftFirstRow);
        firstRow.appendChild(rightFirstRow);

        // Вторая строка
        var secondRow = document.createElement('div');
        secondRow.className = 'gh-issue-second-row';

        // Левая часть второй строки
        var leftSecondRow = document.createElement('div');
        leftSecondRow.className = 'gh-issue-left';
        var idSpan = document.createElement('span');
        idSpan.className = 'gh-issue-id';
        idSpan.textContent = '#' + issueNumber;
        leftSecondRow.appendChild(idSpan);

        // Время с момента открытия
        if (timeAgoText) {
            var timeAgoSpan = document.createElement('span');
            timeAgoSpan.className = 'gh-time-ago';
            timeAgoSpan.textContent = timeAgoText;
            leftSecondRow.appendChild(document.createTextNode(' '));
            leftSecondRow.appendChild(timeAgoSpan);
        }

        // Инициатор
        leftSecondRow.appendChild(document.createTextNode(' от ' + reporter));

        secondRow.appendChild(leftSecondRow);

        // Добавляем строки в контейнер
        issueContainer.appendChild(firstRow);
        issueContainer.appendChild(secondRow);

        // Добавляем контейнер в ячейку
        issueCell.appendChild(issueContainer);

        // Добавляем ячейку в строку
        row.appendChild(issueCell);
    });

    /**
     * Функция для сопоставления серьезности на русский язык.
     * @param {string} severity - Уровень серьезности на английском.
     * @returns {string} - Сопоставленный уровень на русском.
     */
    function mapSeverityToRussian(severity) {
        var mapping = {
            'blocker': 'Блокирующий',
            'critical': 'Критический',
            'major': 'Серьезный',
            'normal': 'Нормальный',
            'minor': 'Незначительный',
            'trivial': 'Тривиальный',
            'enhancement': 'Улучшение'
        };
        return mapping[severity.toLowerCase()] || severity;
    }

    /**
     * Функция для получения цвета по уровню серьезности.
     * @param {string} severity - Уровень серьезности.
     * @returns {string} - Цвет в формате HEX.
     */
    function getSeverityColor(severity) {
        var colors = {
            'blocker': '#d73a4a',      // Красный
            'critical': '#cb2431',     // Темно-красный
            'major': '#e36209',        // Оранжевый
            'normal': '#0e8a16',       // Зеленый
            'minor': '#0366d6',        // Синий
            'trivial': '#6f42c1',      // Фиолетовый
            'enhancement': '#a2eeef'   // Светло-голубой
        };
        return colors[severity.toLowerCase()] || '#d1d5da'; // По умолчанию серый
    }

})();
