export interface QuizOption {
  id: string
  text: string
  result: 'therapy' | 'career' | 'coaching' | null
}

export interface QuizQuestion {
  id: number
  question: string
  options: QuizOption[]
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: 'Что вас беспокоит больше всего прямо сейчас?',
    options: [
      { id: 'A', text: 'Тревога, страхи, панические атаки', result: 'therapy' },
      { id: 'B', text: 'Усталость, апатия, нет сил', result: 'therapy' },
      { id: 'C', text: 'Конфликты в отношениях или на работе', result: 'therapy' },
      { id: 'D', text: 'Не понимаю куда двигаться в профессии', result: 'career' },
      { id: 'E', text: 'Знаю чего хочу, но не могу осуществить', result: 'coaching' },
    ],
  },
  {
    id: 2,
    question: 'Как давно это вас беспокоит?',
    options: [
      { id: 'A', text: 'Недавно — последний месяц', result: null },
      { id: 'B', text: 'Несколько месяцев', result: null },
      { id: 'C', text: 'Больше года', result: null },
      { id: 'D', text: 'Всегда так было', result: null },
    ],
  },
  {
    id: 3,
    question: 'Как это влияет на вашу жизнь?',
    options: [
      { id: 'A', text: 'Мешает работать и концентрироваться', result: null },
      { id: 'B', text: 'Мешает отношениям с близкими', result: null },
      { id: 'C', text: 'Мешает отдыхать и спать', result: null },
      { id: 'D', text: 'Мешает принимать решения', result: null },
    ],
  },
  {
    id: 4,
    question: 'Что для вас важнее прямо сейчас?',
    options: [
      { id: 'A', text: 'Разобраться в себе и своём прошлом', result: 'therapy' },
      { id: 'B', text: 'Помочь своему ребёнку', result: 'therapy' },
      { id: 'C', text: 'Найти профессиональный путь', result: 'career' },
      { id: 'D', text: 'Достичь конкретной цели', result: 'coaching' },
    ],
  },
  {
    id: 5,
    question: 'Как вам удобнее работать?',
    options: [
      { id: 'A', text: 'Онлайн — из любого места', result: null },
      { id: 'B', text: 'Очно в Москве', result: null },
      { id: 'C', text: 'Не важно, главное результат', result: null },
    ],
  },
]

export const quizResults = {
  therapy: {
    title: 'Вам подойдёт психотерапия',
    description:
      'Судя по ответам, вы переживаете что-то, что требует внимания к вашему внутреннему состоянию. Психотерапия поможет разобраться в причинах и найти устойчивость.',
    cta: 'Записаться на психотерапию',
    href: '/zapis/',
  },
  career: {
    title: 'Вам подойдёт карьерное консультирование',
    description:
      'Вы ищете свой путь или следующий шаг в профессии. Карьерное консультирование поможет прояснить цели и найти направление.',
    cta: 'Записаться на карьерную сессию',
    href: '/zapis/',
  },
  coaching: {
    title: 'Вам подойдёт бизнес-коучинг',
    description:
      'У вас есть цель, и вы хотите её достичь. Коучинг поможет выстроить стратегию и убрать то, что мешает двигаться вперёд.',
    cta: 'Записаться на коучинг',
    href: '/zapis/',
  },
}
