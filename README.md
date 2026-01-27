# Landing Pages Maker

Автоматический деплой лендингов на GitHub Pages и Cloudflare Pages.

## 🚀 Быстрый старт

### Создание нового лендинга

1. Создайте новый HTML файл в корне проекта
2. Добавьте стили в `assets/css/`
3. Добавьте скрипты в `assets/js/`
4. Коммитьте и пушьте изменения

```bash
git add .
git commit -m "Add new landing page"
git push
```

### Доступ к лендингам

После деплоя лендинги будут доступны по адресам:

**GitHub Pages:**
- Главная: `https://getprofitcz-cyber.github.io/lp-maker/`
- Конкретный лендинг: `https://getprofitcz-cyber.github.io/lp-maker/your-landing.html`

**Cloudflare Pages:**
- `https://lp-maker.pages.dev/`

## 📁 Структура проекта

```
lp-maker/
├── index.html              # Главная страница (список всех лендингов)
├── optimized-landing-2026.html
├── thank-you-page-2026.html
├── assets/
│   ├── css/               # Стили
│   ├── js/                # Скрипты
│   └── images/            # Изображения
└── .github/
    └── workflows/
        └── deploy.yml     # Автоматический деплой
```

## 🛠 Деплой

### GitHub Pages
Автоматически деплоится при push в `main` ветку.

### Cloudflare Pages
```bash
npm install -g wrangler
wrangler pages deploy . --project-name=lp-maker
```

## 📝 Существующие лендинги

- `optimized-landing-2026.html` - Оптимизированный лендинг 2026
- `thank-you-page-2026.html` - Страница благодарности 2026
- `promo.html` - Промо страница
- `app.html` - Приложение
