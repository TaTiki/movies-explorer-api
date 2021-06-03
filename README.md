# movies-explorer-api

https://api.mata.hari.nomoredomains.icu

## Быстрый старт
* Чтобы запустить локальную сборку разработчика:
```
docker-compose -f docker-compose.dev.yml up -d
mkdir logs
npm install
npm run dev
```

mongodb запускается на порту 27017, а сервер запускает порт 3000.

* Чтобы начать производственную сборку:

в базовом каталоге необходим файл .env
со следующими переменными окружения
```
DB=mongodb://mongodb:27017/moviesdb                                                                                                                                                                                                             NODE_ENV=production                                                                                                                                                                                                                             JWT_SECRET=<some-secret-key>
```
Команда в консоли:
```
docker-compose up -d
```

сервер запускает порт 5000 