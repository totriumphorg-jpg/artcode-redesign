# ARTCODE — международные творческие конкурсы

Современный адаптивный сайт платформы ARTCODE. Сайт автоматически публикуется в GitHub Pages при каждом push в ветку `main`.

## Публикация

Workflow `.github/workflows/deploy-pages.yml` устанавливает зависимости, выполняет `pnpm run build:pages` и разворачивает каталог `dist/public` через GitHub Pages.

Все визуальные материалы находятся в `client/public/assets`, поэтому опубликованная версия не зависит от внешнего временного хранилища. Для корректной работы на адресе репозитория и на будущем пользовательском домене Vite собирает ссылки с относительной базой `./`.

## Локальная разработка

```bash
pnpm install
pnpm dev
```

Проверка production-сборки для GitHub Pages:

```bash
pnpm run build:pages
pnpm run check
```

## Подключение домена

После переноса домена `my-artcode.com` в настройках репозитория откройте **Settings → Pages → Custom domain** и укажите `my-artcode.com`. Затем добавьте DNS-записи, рекомендованные GitHub Pages, и включите **Enforce HTTPS** после выпуска сертификата.
