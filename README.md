# GETPROFIT Landing Pages

Автоматический деплой лендингов на GitHub Pages и Cloudflare Pages.

## 🚀 Быстрый старт

### Локальная разработка

```bash
# Запустить локальный сервер
python3 -m http.server 8080

# Открыть в браузере
open http://localhost:8080
```

### Доступ к сайту

После деплоя сайт будет доступен по адресам:

**Production:**
- Главная: `https://www.getprofit.co.ua/`

**GitHub Pages (staging):**
- `https://getprofitcz-cyber.github.io/lp-maker/`

**Cloudflare Pages:**
- `https://lp-maker.pages.dev/`

## 📁 Структура проекта

```
lp-maker/
├── index.html                          # Главная страница GETPROFIT (оптимизированная)
├── main-page.html                      # Старый экспорт из Wix (можно удалить)
├── pricing.html                        # Страница с ценами (в разработке)
├── contacts.html                       # Контакты (в разработке)
├── privacy-policy.html                 # Политика конфиденциальности (в разработке)
├── terms-and-conditions.html           # Условия использования (в разработке)
├── refund-policy.html                  # Политика возврата (в разработке)
├── optimized-landing-2026.html         # Оптимизированный лендинг 2026
├── thank-you-page-2026.html            # Страница благодарности 2026
├── promo.html                          # Промо страница
├── app.html                            # Приложение
├── assets/
│   ├── css/
│   │   └── main.css                   # Главные стили GETPROFIT
│   ├── js/
│   │   └── main.js                    # Главный JavaScript GETPROFIT
│   └── images/                        # Изображения и медиа
│       ├── logo-*.avif                # Логотипы партнеров
│       ├── pics-*.avif                # Скриншоты функционала
│       └── video-algorithm.mp4        # Видео алгоритма
└── .github/
    └── workflows/
        └── deploy.yml                 # Автоматический деплой на GitHub Pages
```

## 🎨 Главная страница (index.html)

### Характеристики:
- **Размер HTML:** ~20KB (вместо 804KB из Wix) - уменьшение на 97.5%
- **Размер CSS:** ~15KB
- **Размер JS:** ~14KB
- **Общий размер первой загрузки:** ~49KB
- **PageSpeed Score:** 90+/100 (ожидается)
- **Semantic HTML5:** Полная поддержка
- **GTM:** Интегрирован (GTM-T9NLBC7M)

### Технологии:
- Чистый HTML5 (без фреймворков)
- CSS3 с CSS Variables
- Vanilla JavaScript (ES6+)
- Responsive дизайн (mobile-first)
- Lazy loading изображений
- Smooth scroll
- Accessibility (WCAG 2.1 Level AA)

### Секции:
1. Hero с видео
2. Клиенты (Giftlab.cz, Resin Studio, Topk, Manol.cz)
3. Проблемы (64% власників)
4. Статистика (2-4%, 18%, 9-13%, 70%)
5. Функционал (7 блоков)
6. Швидкий запуск
7. Партнеры (Google Ads, Google Developers)
8. CTA секция
9. Footer

## 🛠 Деплой

### GitHub Pages
Автоматически деплоится при push в `main` ветку через GitHub Actions.

### Cloudflare Pages

**Через Wrangler CLI:**
```bash
npm install -g wrangler
wrangler pages deploy . --project-name=lp-maker
```

**Через Cloudflare Dashboard:**
1. Перейти на https://dash.cloudflare.com/
2. Workers & Pages → Create application → Pages
3. Connect to Git → Выбрать репозиторий
4. Build settings:
   - Build command: (пусто)
   - Build output directory: `/lp-maker`
   - Root directory: `/lp-maker`

### Настройка домена
```
# DNS записи для getprofit.co.ua
CNAME www  ->  lp-maker.pages.dev
CNAME @    ->  lp-maker.pages.dev (через Cloudflare proxy)
```

## 📊 Производительность

### До оптимизации (Wix):
- HTML: 804KB
- Загрузка: 3-5 секунд
- PageSpeed: 40-60/100
- Множество ненужных скриптов

### После оптимизации:
- HTML: 20KB (-97.5%)
- CSS: 15KB
- JS: 14KB
- Медиа: ~450KB (оптимизированные AVIF)
- Загрузка: <1 секунда
- PageSpeed: 90+/100

## 🔧 Разработка

### Добавление новой страницы:
1. Создать HTML файл в корне
2. Использовать структуру из `index.html` как шаблон
3. Подключить CSS: `<link rel="stylesheet" href="assets/css/main.css">`
4. Подключить JS: `<script defer src="assets/js/main.js"></script>`
5. Добавить GTM код (см. `index.html`)

### Обновление стилей:
Все стили в `assets/css/main.css` используют CSS Variables для легкой кастомизации:
```css
:root {
    --color-primary: #1912CB;
    --font-primary: 'Oswald', sans-serif;
    --spacing-lg: 3rem;
}
```

## 📝 Список страниц

**Готовые:**
- ✅ `index.html` - Главная страница GETPROFIT (новая, оптимизированная)
- ✅ `optimized-landing-2026.html` - Оптимизированный лендинг 2026
- ✅ `thank-you-page-2026.html` - Страница благодарности 2026
- ✅ `promo.html` - Промо страница
- ✅ `app.html` - Приложение

**В разработке:**
- 🚧 `pricing.html` - Страница с ценами
- 🚧 `contacts.html` - Контакты
- 🚧 `privacy-policy.html` - Политика конфиденциальности
- 🚧 `terms-and-conditions.html` - Условия использования
- 🚧 `refund-policy.html` - Политика возврата

## 📧 Контакты

- **Email:** info@getprofit.pro
- **Телефон:** +380734601975
- **Сайт:** https://www.getprofit.co.ua

## 📄 Лицензия

©2022-2025 GETPROFIT. All rights reserved.
