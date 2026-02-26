import { config, fields, collection, singleton } from '@keystatic/core'

export default config({
  storage: process.env.NEXT_PUBLIC_KEYSTATIC_GITHUB_CLIENT_ID
    ? {
        kind: 'github',
        repo: {
          owner: 'pavelypopov-droid',
          name: 'svetlana-popova-site',
        },
      }
    : { kind: 'local' },

  ui: {
    brand: { name: 'Светлана Попова — CMS' },
    navigation: {
      Контент: ['blog', 'testimonials'],
      Страницы: ['homePage', 'therapyPage', 'careerPage', 'coachingPage'],
      Настройки: ['settings'],
    },
  },

  // ─── Collections ─────────────────────────────────────────────────────────────

  collections: {
    blog: collection({
      label: 'Блог',
      slugField: 'title',
      path: 'content/blog/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Заголовок' } }),
        date: fields.date({ label: 'Дата публикации', defaultValue: { kind: 'today' } }),
        category: fields.text({ label: 'Категория', defaultValue: 'Психология' }),
        excerpt: fields.text({ label: 'Анонс (краткое описание)', multiline: true }),
        content: fields.document({
          label: 'Текст статьи',
          formatting: true,
          dividers: true,
          links: true,
          images: { directory: 'public/images/blog', publicPath: '/images/blog/' },
        }),
      },
    }),

    testimonials: collection({
      label: 'Отзывы клиентов',
      slugField: 'name',
      path: 'content/testimonials/*',
      format: { data: 'yaml' },
      schema: {
        name: fields.slug({ name: { label: 'Имя клиента' } }),
        age: fields.number({ label: 'Возраст', validation: { min: 10, max: 100 } }),
        role: fields.text({ label: 'Роль / профессия' }),
        service: fields.select({
          label: 'Услуга',
          options: [
            { label: 'Психотерапия', value: 'therapy' },
            { label: 'Карьерное консультирование', value: 'career' },
            { label: 'Бизнес-коучинг', value: 'coaching' },
          ],
          defaultValue: 'therapy',
        }),
        request: fields.text({ label: 'Запрос (с чем обратился)' }),
        result: fields.text({ label: 'Результат (заголовок)' }),
        text: fields.text({ label: 'Текст отзыва', multiline: true }),
      },
    }),
  },

  // ─── Singletons ──────────────────────────────────────────────────────────────

  singletons: {
    settings: singleton({
      label: 'Контакты и цены',
      path: 'content/settings',
      format: { data: 'yaml' },
      schema: {
        contacts: fields.object({
          whatsapp: fields.text({ label: 'WhatsApp (номер без +)' }),
          telegram: fields.text({ label: 'Telegram (без @)' }),
          calendly: fields.text({ label: 'Ссылка Calendly (необязательно)' }),
        }),
        prices: fields.object({
          therapy: fields.text({ label: 'Психотерапия' }),
          career: fields.text({ label: 'Карьерное консультирование' }),
          coaching: fields.text({ label: 'Бизнес-коучинг' }),
        }),
      },
    }),

    homePage: singleton({
      label: 'Главная страница',
      path: 'content/pages/home',
      format: { data: 'yaml' },
      schema: {
        hero_tagline: fields.text({ label: 'Главный заголовок (первая строка)' }),
        hero_subtitle: fields.text({ label: 'Подзаголовок под именем', multiline: true }),
        hero_cta: fields.text({ label: 'Текст кнопки' }),
      },
    }),

    therapyPage: singleton({
      label: 'Страница: Психотерапия',
      path: 'content/pages/therapy',
      format: { data: 'yaml' },
      schema: {
        title: fields.text({ label: 'Заголовок страницы' }),
        subtitle: fields.text({ label: 'Подзаголовок', multiline: true }),
        pains: fields.array(fields.text({ label: 'Пункт' }), {
          label: 'Это для вас, если...',
          itemLabel: (props) => (props.value as string) || 'Пункт',
        }),
        format: fields.text({ label: 'Формат работы' }),
        price: fields.text({ label: 'Стоимость' }),
      },
    }),

    careerPage: singleton({
      label: 'Страница: Карьерное консультирование',
      path: 'content/pages/career',
      format: { data: 'yaml' },
      schema: {
        title: fields.text({ label: 'Заголовок страницы' }),
        subtitle: fields.text({ label: 'Подзаголовок', multiline: true }),
        pains: fields.array(fields.text({ label: 'Пункт' }), {
          label: 'Это для вас, если...',
          itemLabel: (props) => (props.value as string) || 'Пункт',
        }),
        format: fields.text({ label: 'Формат работы' }),
        price: fields.text({ label: 'Стоимость' }),
      },
    }),

    coachingPage: singleton({
      label: 'Страница: Бизнес-коучинг',
      path: 'content/pages/coaching',
      format: { data: 'yaml' },
      schema: {
        title: fields.text({ label: 'Заголовок страницы' }),
        subtitle: fields.text({ label: 'Подзаголовок', multiline: true }),
        pains: fields.array(fields.text({ label: 'Пункт' }), {
          label: 'Это для вас, если...',
          itemLabel: (props) => (props.value as string) || 'Пункт',
        }),
        format: fields.text({ label: 'Формат работы' }),
        price: fields.text({ label: 'Стоимость' }),
      },
    }),
  },
})
