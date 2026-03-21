# Платформа для репетиторов — Backend (план реализации)

Этот документ описывает бэкенд, который необходимо реализовать для полноценной работы платформы. Фронтенд уже готов и работает на моковых данных.

## Рекомендуемый стек

- **Node.js** + **Express** или **Fastify** (альтернатива: NestJS)
- **PostgreSQL** — основная база данных
- **Prisma** или **Drizzle** — ORM
- **JWT** — аутентификация (access + refresh tokens)
- **Multer** / **S3** — загрузка файлов
- **Zod** — валидация входных данных
- **bcrypt** — хеширование паролей

## Модели данных (схема БД)

### User
| Поле       | Тип      | Описание                        |
|------------|----------|---------------------------------|
| id         | UUID     | PK                              |
| name       | string   | Имя пользователя                |
| email      | string   | Уникальный, для входа           |
| password   | string   | bcrypt-хеш                      |
| role       | enum     | `teacher` \| `student`          |
| avatarUrl  | string?  | URL аватара (S3 или CDN)        |
| createdAt  | datetime |                                 |

### StudentGroup
| Поле       | Тип      | Описание                        |
|------------|----------|---------------------------------|
| id         | UUID     | PK                              |
| name       | string   | Название группы                 |
| teacherId  | UUID     | FK → User (teacher)             |
| createdAt  | datetime |                                 |

### GroupMembership (M2M: Group ↔ Student)
| Поле       | Тип      | Описание                        |
|------------|----------|---------------------------------|
| groupId    | UUID     | FK → StudentGroup               |
| studentId  | UUID     | FK → User (student)             |

### Homework
| Поле        | Тип      | Описание                       |
|-------------|----------|--------------------------------|
| id          | UUID     | PK                             |
| title       | string   |                                |
| description | text     |                                |
| teacherId   | UUID     | FK → User (teacher)            |
| groupId     | UUID?    | FK → StudentGroup (если группа)|
| deadline    | datetime |                                |
| createdAt   | datetime |                                |

### HomeworkStudent (M2M: Homework ↔ Student, для индивидуальных заданий)
| Поле        | Тип      | Описание                       |
|-------------|----------|--------------------------------|
| homeworkId  | UUID     | FK → Homework                  |
| studentId   | UUID     | FK → User (student)            |

### HomeworkMaterial (M2M: Homework ↔ Material)
| Поле        | Тип      | Описание                       |
|-------------|----------|--------------------------------|
| homeworkId  | UUID     | FK → Homework                  |
| materialId  | UUID     | FK → Material                  |

### Submission
| Поле           | Тип      | Описание                    |
|----------------|----------|-----------------------------|
| id             | UUID     | PK                          |
| homeworkId     | UUID     | FK → Homework               |
| studentId      | UUID     | FK → User (student)         |
| text           | text     | Текст ответа                |
| fileUrl        | string?  | URL загруженного файла      |
| submittedAt    | datetime |                             |
| status         | enum     | `submitted` \| `graded` \| `returned` |
| grade          | int?     | 1-5                         |
| teacherComment | text?    |                             |

### Material
| Поле        | Тип      | Описание                       |
|-------------|----------|--------------------------------|
| id          | UUID     | PK                             |
| title       | string   |                                |
| description | text     |                                |
| teacherId   | UUID     | FK → User (teacher)            |
| fileUrl     | string   | URL файла (S3)                 |
| fileName    | string   | Оригинальное имя файла         |
| fileType    | string   | MIME-тип или расширение        |
| createdAt   | datetime |                                |

### Lesson (регулярные занятия)
| Поле            | Тип      | Описание                    |
|-----------------|----------|-----------------------------|
| id              | UUID     | PK                          |
| title           | string   |                             |
| teacherId       | UUID     | FK → User (teacher)         |
| groupId         | UUID     | FK → StudentGroup           |
| dayOfWeek       | int      | 0=Пн, 6=Вс                 |
| time            | string   | "HH:mm"                    |
| durationMinutes | int      |                             |
| room            | string?  | Кабинет                     |
| createdAt       | datetime |                             |

## API эндпоинты

### Auth
```
POST   /api/auth/register     — регистрация (name, email, password, role)
POST   /api/auth/login        — вход (email, password) → {accessToken, refreshToken, user}
POST   /api/auth/refresh       — обновление токенов
POST   /api/auth/logout        — выход (инвалидация refresh token)
GET    /api/auth/me            — текущий пользователь по токену
```

### Users
```
GET    /api/users/students     — список учеников (для teacher)
PATCH  /api/users/:id          — обновление профиля
POST   /api/users/:id/avatar   — загрузка аватара
```

### Groups
```
GET    /api/groups             — список групп (teacher: свои, student: в которых состоит)
POST   /api/groups             — создать группу (teacher)
GET    /api/groups/:id         — детали группы
PATCH  /api/groups/:id         — обновить группу (teacher)
DELETE /api/groups/:id         — удалить группу (teacher)
POST   /api/groups/:id/students — добавить учеников в группу
DELETE /api/groups/:id/students/:studentId — убрать ученика
```

### Homeworks
```
GET    /api/homeworks          — список заданий (teacher: свои, student: назначенные)
POST   /api/homeworks          — создать задание (teacher)
GET    /api/homeworks/:id      — детали задания + submissions
PATCH  /api/homeworks/:id      — обновить задание (teacher)
DELETE /api/homeworks/:id      — удалить задание (teacher)
```

### Submissions
```
GET    /api/homeworks/:id/submissions   — список сдач по заданию (teacher)
POST   /api/homeworks/:id/submissions   — сдать работу (student)
PATCH  /api/submissions/:id/grade       — оценить работу (teacher) {grade, comment}
PATCH  /api/submissions/:id/return      — вернуть на доработку (teacher) {comment}
```

### Materials
```
GET    /api/materials          — список материалов
POST   /api/materials          — загрузить материал (teacher) — multipart/form-data
GET    /api/materials/:id      — скачать / детали материала
DELETE /api/materials/:id      — удалить материал (teacher)
```

### Lessons (расписание)
```
GET    /api/lessons            — расписание (teacher: своё, student: своих групп)
POST   /api/lessons            — создать занятие (teacher)
PATCH  /api/lessons/:id        — обновить занятие (teacher)
DELETE /api/lessons/:id        — удалить занятие (teacher)
```

## Авторизация и доступ

- Все эндпоинты кроме `/auth/*` требуют JWT в заголовке `Authorization: Bearer <token>`
- Middleware проверки роли: `requireRole('teacher')` / `requireRole('student')`
- Преподаватель видит/управляет только своими данными
- Ученик видит только задания и материалы своих групп
- Ученик НЕ может создавать/редактировать/удалять задания, группы, материалы, расписание

## Загрузка файлов

- Материалы и файлы сдач загружаются через `multipart/form-data`
- Рекомендуется хранить в S3-совместимом хранилище (AWS S3, MinIO, Yandex Object Storage)
- Ограничение размера: ~20 МБ на файл
- Допустимые типы: pdf, docx, doc, xlsx, jpg, jpeg, png
- URL файла сохраняется в БД, отдаётся клиенту для скачивания

## Серия сдач (Streak)

Фронтенд рассчитывает серию на клиенте, но для надёжности нужен бэкенд-расчёт:

```
GET /api/students/:id/streak → { streak: number, totalSubmissions: number }
```

Логика: подсчёт уникальных дней подряд, в которые ученик отправлял хотя бы одну сдачу. Серия обнуляется, если прошло больше 1 дня без сдачи.

## Уведомления (опционально, на будущее)

- WebSocket или SSE для реального времени
- Уведомления ученику: новое задание, оценка выставлена, работа возвращена
- Уведомления преподавателю: новая сдача
- Email-уведомления (nodemailer) о дедлайнах за 24 часа

## Переменные окружения

```env
DATABASE_URL=postgresql://user:pass@localhost:5432/tutor_db
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
S3_BUCKET=tutor-files
S3_REGION=ru-central1
S3_ENDPOINT=https://storage.yandexcloud.net
S3_ACCESS_KEY=...
S3_SECRET_KEY=...
PORT=3001
```

## Порядок реализации

1. **Инфраструктура** — инициализация проекта, настройка БД, Prisma-схема, миграции
2. **Auth** — регистрация, логин, JWT middleware, refresh tokens
3. **Users + Groups** — CRUD групп, управление составом
4. **Homeworks + Submissions** — CRUD заданий, сдача и оценивание
5. **Materials** — загрузка файлов в S3, CRUD
6. **Lessons** — CRUD расписания
7. **Streak** — эндпоинт расчёта серии
8. **Уведомления** — WebSocket + email (опционально)

## Интеграция с фронтендом

Фронтенд сейчас использует Zustand-сторы с моковыми данными. Для подключения к бэкенду нужно:

1. Заменить моковые данные на API-вызовы (`fetch` / `axios`)
2. Добавить интерцептор для JWT-токенов (обновление при истечении)
3. Заменить `sessionStorage` авторизацию на JWT
4. Подключить реальную загрузку файлов через `FormData`
5. Обновить streak-расчёт — брать с бэкенда вместо локального подсчёта
