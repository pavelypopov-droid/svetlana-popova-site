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
      Контент: ['blog', 'testimonials', 'faq'],
      Страницы: ['homePage', 'aboutPage', 'therapyPage', 'careerPage', 'coachingPage', 'bookingPage', 'privacyPage'],
      Настройки: ['settings', 'navigation', 'quiz'],
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
        content: fields.markdoc({
          label: 'Текст статьи',
          extension: 'md',
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
        status: fields.select({
          label: 'Статус модерации',
          description: 'Только одобренные отзывы отображаются на сайте',
          options: [
            { label: '🟡 На проверке', value: 'pending' },
            { label: '🟢 Одобрен', value: 'approved' },
            { label: '🔴 Отклонён', value: 'rejected' },
          ],
          defaultValue: 'approved',
        }),
        age: fields.number({ label: 'Возраст', validation: { min: 10, max: 100 } }),
        role: fields.text({ label: 'Роль / профессия' }),
        service: fields.select({
          label: 'Услуга',
          options: [
            { label: 'Психотерапия', value: 'therapy' },
            { label: 'Профнавигация', value: 'career' },
            { label: 'Сопровождение бизнес-лидеров', value: 'coaching' },
          ],
          defaultValue: 'therapy',
        }),
        request: fields.text({ label: 'Запрос (с чем обратился)' }),
        result: fields.text({ label: 'Результат (заголовок)' }),
        text: fields.text({ label: 'Текст отзыва', multiline: true }),
      },
    }),

    faq: collection({
      label: 'Частые вопросы',
      slugField: 'title',
      path: 'content/faq/*',
      format: { data: 'yaml' },
      schema: {
        title: fields.slug({ name: { label: 'Короткое название' } }),
        question: fields.text({ label: 'Полный текст вопроса', multiline: true }),
        answer: fields.text({ label: 'Ответ', multiline: true }),
        order: fields.number({ label: 'Порядок сортировки', defaultValue: 0 }),
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
          career: fields.text({ label: 'Профнавигация' }),
          coaching: fields.text({ label: 'Сопровождение бизнес-лидеров' }),
        }),
      },
    }),

    navigation: singleton({
      label: 'Навигация и подвал',
      path: 'content/navigation',
      format: { data: 'yaml' },
      schema: {
        site_name: fields.text({ label: 'Название сайта (логотип)' }),
        header_links: fields.array(
          fields.object({
            href: fields.text({ label: 'URL' }),
            label: fields.text({ label: 'Текст ссылки' }),
          }),
          { label: 'Ссылки в шапке', itemLabel: (p) => p.fields.label.value || 'Ссылка' }
        ),
        header_cta_text: fields.text({ label: 'Текст кнопки CTA в шапке' }),
        header_cta_href: fields.text({ label: 'URL кнопки CTA в шапке' }),
        footer_description: fields.text({ label: 'Описание в подвале', multiline: true }),
        footer_links: fields.array(
          fields.object({
            href: fields.text({ label: 'URL' }),
            label: fields.text({ label: 'Текст ссылки' }),
          }),
          { label: 'Ссылки в подвале', itemLabel: (p) => p.fields.label.value || 'Ссылка' }
        ),
        social_links: fields.array(
          fields.object({
            platform: fields.select({
              label: 'Платформа',
              options: [
                { label: 'WhatsApp', value: 'whatsapp' },
                { label: 'Telegram', value: 'telegram' },
                { label: 'MAX', value: 'max' },
                { label: 'Instagram', value: 'instagram' },
                { label: 'VK', value: 'vk' },
              ],
              defaultValue: 'whatsapp',
            }),
            url: fields.text({ label: 'URL' }),
            label: fields.text({ label: 'Текст ссылки' }),
          }),
          { label: 'Социальные ссылки' }
        ),
        copyright: fields.text({ label: 'Текст копирайта' }),
      },
    }),

    // ─── Pages ───────────────────────────────────────────────────────────────

    homePage: singleton({
      label: 'Главная страница',
      path: 'content/pages/home',
      format: { data: 'yaml' },
      schema: {
        hero_badge: fields.text({ label: 'Бейдж героя (над заголовком)' }),
        hero_tagline: fields.text({ label: 'Главный заголовок' }),
        hero_subtitle: fields.text({ label: 'Подзаголовок', multiline: true }),
        hero_cta: fields.text({ label: 'Текст основной кнопки' }),
        hero_cta2: fields.text({ label: 'Текст второй кнопки' }),
        hero_stats: fields.text({ label: 'Статистика под кнопками' }),
        trust_items: fields.array(fields.text({ label: 'Пункт' }), {
          label: 'Доверительная полоса',
        }),
        trust_media: fields.array(
          fields.object({
            name: fields.text({ label: 'Название СМИ' }),
            url: fields.text({ label: 'Ссылка' }),
          }),
          { label: 'СМИ в доверительной полосе', itemLabel: (p) => p.fields.name.value || 'СМИ' }
        ),
        pains_title: fields.text({ label: 'Заголовок раздела "Боли"' }),
        pains_subtitle: fields.text({ label: 'Подзаголовок раздела "Боли"' }),
        pains: fields.array(
          fields.object({
            emoji: fields.text({ label: 'Эмодзи' }),
            text: fields.text({ label: 'Текст' }),
            href: fields.text({ label: 'Ссылка' }),
          }),
          { label: 'Карточки болей', itemLabel: (p) => p.fields.text.value || 'Боль' }
        ),
        services_title: fields.text({ label: 'Заголовок раздела услуг' }),
        services_subtitle: fields.text({ label: 'Подзаголовок раздела услуг' }),
        services: fields.array(
          fields.object({
            icon: fields.text({ label: 'Эмодзи-иконка' }),
            title: fields.text({ label: 'Название' }),
            shortDesc: fields.text({ label: 'Краткое описание', multiline: true }),
            slug: fields.text({ label: 'URL slug' }),
          }),
          { label: 'Карточки услуг', itemLabel: (p) => p.fields.title.value || 'Услуга' }
        ),
        testimonials_title: fields.text({ label: 'Заголовок раздела отзывов' }),
        testimonials_subtitle: fields.text({ label: 'Подзаголовок раздела отзывов' }),
        quiz_title: fields.text({ label: 'Заголовок раздела квиза' }),
        quiz_subtitle: fields.text({ label: 'Подзаголовок раздела квиза' }),
        cta_title: fields.text({ label: 'CTA заголовок (внизу)' }),
        cta_subtitle: fields.text({ label: 'CTA подзаголовок (внизу)' }),
        cta_button: fields.text({ label: 'CTA текст кнопки (внизу)' }),
      },
    }),

    aboutPage: singleton({
      label: 'Страница: Обо мне',
      path: 'content/pages/about',
      format: { data: 'yaml' },
      schema: {
        badge: fields.text({ label: 'Бейдж' }),
        title: fields.text({ label: 'Имя (заголовок)' }),
        subtitle: fields.text({ label: 'Подзаголовок (специализация)' }),
        stats: fields.array(
          fields.object({
            emoji: fields.text({ label: 'Эмодзи' }),
            text: fields.text({ label: 'Текст' }),
          }),
          { label: 'Статистика' }
        ),
        story_title: fields.text({ label: 'Заголовок раздела "Моя история"' }),
        story_paragraphs: fields.array(
          fields.text({ label: 'Абзац', multiline: true }),
          { label: 'Абзацы биографии' }
        ),
        education: fields.array(
          fields.object({
            org: fields.text({ label: 'Организация (сокращение)' }),
            desc: fields.text({ label: 'Описание' }),
          }),
          { label: 'Образование', itemLabel: (p) => p.fields.org.value || 'Организация' }
        ),
        approach: fields.array(
          fields.object({
            icon: fields.text({ label: 'Эмодзи-иконка' }),
            title: fields.text({ label: 'Заголовок' }),
            text: fields.text({ label: 'Описание', multiline: true }),
          }),
          { label: 'Подход к работе', itemLabel: (p) => p.fields.title.value || 'Карточка' }
        ),
        diplomas: fields.array(
          fields.object({
            src: fields.text({ label: 'Путь к изображению' }),
            alt: fields.text({ label: 'Описание' }),
          }),
          { label: 'Дипломы и сертификаты' }
        ),
        media: fields.array(
          fields.object({
            name: fields.text({ label: 'Название СМИ' }),
            url: fields.text({ label: 'Ссылка' }),
          }),
          { label: 'Публикации в СМИ', itemLabel: (p) => p.fields.name.value || 'СМИ' }
        ),
        quote: fields.text({ label: 'Цитата', multiline: true }),
        quote_author: fields.text({ label: 'Автор цитаты' }),
        cta_title: fields.text({ label: 'CTA заголовок' }),
        cta_subtitle: fields.text({ label: 'CTA подзаголовок' }),
      },
    }),

    therapyPage: singleton({
      label: 'Страница: Психотерапия',
      path: 'content/pages/therapy',
      format: { data: 'yaml' },
      schema: {
        badge: fields.text({ label: 'Бейдж' }),
        title: fields.text({ label: 'Заголовок героя' }),
        subtitle: fields.text({ label: 'Подзаголовок героя', multiline: true }),
        pains: fields.array(fields.text({ label: 'Пункт' }), {
          label: 'Это для вас, если...',
          itemLabel: (props) => (props.value as string) || 'Пункт',
        }),
        steps: fields.array(
          fields.object({
            title: fields.text({ label: 'Заголовок шага' }),
            desc: fields.text({ label: 'Описание', multiline: true }),
          }),
          { label: 'Этапы работы', itemLabel: (p) => p.fields.title.value || 'Шаг' }
        ),
        methods: fields.array(fields.text({ label: 'Метод' }), {
          label: 'Методы работы',
        }),
        results: fields.array(fields.text({ label: 'Результат' }), {
          label: 'Что изменится',
        }),
        child_therapy_badge: fields.text({ label: 'Бейдж: детская терапия' }),
        child_therapy_title: fields.text({ label: 'Заголовок: детская терапия' }),
        child_therapy_paragraphs: fields.array(
          fields.text({ label: 'Абзац', multiline: true }),
          { label: 'Абзацы о детской терапии' }
        ),
        format: fields.text({ label: 'Формат работы' }),
        price: fields.text({ label: 'Стоимость' }),
        cta_title: fields.text({ label: 'CTA заголовок' }),
        cta_subtitle: fields.text({ label: 'CTA подзаголовок' }),
        cta_button: fields.text({ label: 'CTA текст кнопки' }),
      },
    }),

    careerPage: singleton({
      label: 'Страница: Профнавигация',
      path: 'content/pages/career',
      format: { data: 'yaml' },
      schema: {
        badge: fields.text({ label: 'Бейдж' }),
        title: fields.text({ label: 'Заголовок героя' }),
        subtitle: fields.text({ label: 'Подзаголовок героя', multiline: true }),
        adults_title: fields.text({ label: 'Заголовок: для взрослых' }),
        adults_icon: fields.text({ label: 'Эмодзи: для взрослых' }),
        adults_items: fields.array(fields.text({ label: 'Пункт' }), {
          label: 'Для взрослых — пункты',
        }),
        teens_title: fields.text({ label: 'Заголовок: для подростков' }),
        teens_icon: fields.text({ label: 'Эмодзи: для подростков' }),
        teens_items: fields.array(fields.text({ label: 'Пункт' }), {
          label: 'Для подростков — пункты',
        }),
        pains: fields.array(fields.text({ label: 'Пункт' }), {
          label: 'Это для вас, если...',
          itemLabel: (props) => (props.value as string) || 'Пункт',
        }),
        steps: fields.array(
          fields.object({
            title: fields.text({ label: 'Заголовок шага' }),
            desc: fields.text({ label: 'Описание', multiline: true }),
          }),
          { label: 'Этапы работы', itemLabel: (p) => p.fields.title.value || 'Шаг' }
        ),
        results: fields.array(fields.text({ label: 'Результат' }), {
          label: 'Что вы получите',
        }),
        format: fields.text({ label: 'Формат работы' }),
        price: fields.text({ label: 'Стоимость' }),
        cta_title: fields.text({ label: 'CTA заголовок' }),
        cta_subtitle: fields.text({ label: 'CTA подзаголовок' }),
        cta_button: fields.text({ label: 'CTA текст кнопки' }),
      },
    }),

    coachingPage: singleton({
      label: 'Страница: Сопровождение бизнес-лидеров',
      path: 'content/pages/coaching',
      format: { data: 'yaml' },
      schema: {
        badge: fields.text({ label: 'Бейдж' }),
        title: fields.text({ label: 'Заголовок героя' }),
        subtitle: fields.text({ label: 'Подзаголовок героя', multiline: true }),
        hero_quote: fields.text({ label: 'Цитата в герое' }),
        comparison_title: fields.text({ label: 'Заголовок: сравнение' }),
        comparison_coaching_title: fields.text({ label: 'Колонка: сопровождение' }),
        comparison_coaching_items: fields.array(fields.text({ label: 'Пункт' }), {
          label: 'Пункты сопровождения',
        }),
        comparison_therapy_title: fields.text({ label: 'Колонка: психотерапия' }),
        comparison_therapy_items: fields.array(fields.text({ label: 'Пункт' }), {
          label: 'Пункты терапии',
        }),
        pains: fields.array(fields.text({ label: 'Пункт' }), {
          label: 'Это для вас, если...',
          itemLabel: (props) => (props.value as string) || 'Пункт',
        }),
        steps: fields.array(
          fields.object({
            title: fields.text({ label: 'Заголовок шага' }),
            desc: fields.text({ label: 'Описание', multiline: true }),
          }),
          { label: 'Этапы работы', itemLabel: (p) => p.fields.title.value || 'Шаг' }
        ),
        results: fields.array(fields.text({ label: 'Результат' }), {
          label: 'Что изменится',
        }),
        format: fields.text({ label: 'Формат работы' }),
        price: fields.text({ label: 'Стоимость' }),
        cta_title: fields.text({ label: 'CTA заголовок' }),
        cta_subtitle: fields.text({ label: 'CTA подзаголовок' }),
        cta_button: fields.text({ label: 'CTA текст кнопки' }),
      },
    }),

    bookingPage: singleton({
      label: 'Страница: Запись',
      path: 'content/pages/booking',
      format: { data: 'yaml' },
      schema: {
        badge: fields.text({ label: 'Бейдж' }),
        title: fields.text({ label: 'Заголовок' }),
        subtitle: fields.text({ label: 'Подзаголовок' }),
        form_title: fields.text({ label: 'Заголовок формы' }),
        form_subtitle: fields.text({ label: 'Подзаголовок формы' }),
        service_options: fields.array(fields.text({ label: 'Опция' }), {
          label: 'Варианты услуг',
        }),
        time_options: fields.array(fields.text({ label: 'Опция' }), {
          label: 'Варианты времени',
        }),
        submit_button: fields.text({ label: 'Текст кнопки отправки' }),
        error_message: fields.text({ label: 'Сообщение об ошибке', multiline: true }),
      },
    }),

    privacyPage: singleton({
      label: 'Страница: Конфиденциальность',
      path: 'content/pages/privacy',
      format: { contentField: 'content' },
      schema: {
        title: fields.text({ label: 'Заголовок' }),
        content: fields.markdoc({
          label: 'Текст политики',
          extension: 'md',
        }),
      },
    }),

    quiz: singleton({
      label: 'Квиз (тест)',
      path: 'content/quiz',
      format: { data: 'yaml' },
      schema: {
        start_title: fields.text({ label: 'Заголовок стартового экрана' }),
        start_description: fields.text({ label: 'Описание стартового экрана', multiline: true }),
        start_button: fields.text({ label: 'Текст кнопки "Начать"' }),
        questions: fields.array(
          fields.object({
            question: fields.text({ label: 'Вопрос' }),
            options: fields.array(
              fields.object({
                id: fields.text({ label: 'ID (A, B, C...)' }),
                text: fields.text({ label: 'Текст варианта' }),
                result: fields.select({
                  label: 'Привязка к результату',
                  options: [
                    { label: 'Нет', value: '' },
                    { label: 'Психотерапия', value: 'therapy' },
                    { label: 'Профнавигация', value: 'career' },
                    { label: 'Сопровождение', value: 'coaching' },
                  ],
                  defaultValue: '',
                }),
              }),
              { label: 'Варианты ответов', itemLabel: (p) => p.fields.text.value || 'Вариант' }
            ),
          }),
          { label: 'Вопросы', itemLabel: (p) => p.fields.question.value || 'Вопрос' }
        ),
        results: fields.object({
          therapy: fields.object({
            title: fields.text({ label: 'Заголовок' }),
            description: fields.text({ label: 'Описание', multiline: true }),
            cta: fields.text({ label: 'Текст кнопки' }),
            href: fields.text({ label: 'Ссылка' }),
          }),
          career: fields.object({
            title: fields.text({ label: 'Заголовок' }),
            description: fields.text({ label: 'Описание', multiline: true }),
            cta: fields.text({ label: 'Текст кнопки' }),
            href: fields.text({ label: 'Ссылка' }),
          }),
          coaching: fields.object({
            title: fields.text({ label: 'Заголовок' }),
            description: fields.text({ label: 'Описание', multiline: true }),
            cta: fields.text({ label: 'Текст кнопки' }),
            href: fields.text({ label: 'Ссылка' }),
          }),
        }),
      },
    }),
  },
})
