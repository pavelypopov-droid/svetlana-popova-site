export const metadata = {
  title: 'Политика конфиденциальности | Светлана Попова',
  description: 'Политика обработки персональных данных',
}

export default function PrivacyPage() {
  return (
    <section className="py-16 md:py-24 bg-brand-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-brand-dark mb-8" style={{ fontFamily: 'Georgia, serif' }}>
          Политика конфиденциальности
        </h1>
        <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] p-8 prose prose-sm max-w-none text-brand-dark/70 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-brand-dark">1. Общие положения</h2>
            <p>
              Настоящая политика конфиденциальности регулирует порядок обработки персональных данных пользователей сайта iofm.ru (далее — Сайт), принадлежащего Поповой Светлане.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-brand-dark">2. Какие данные мы собираем</h2>
            <p>При заполнении форм на Сайте вы можете предоставить следующие данные:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Имя</li>
              <li>Номер телефона</li>
              <li>Адрес электронной почты</li>
              <li>Другие сведения, добровольно указанные вами</li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-bold text-brand-dark">3. Цели обработки данных</h2>
            <p>Персональные данные используются исключительно для:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Связи с вами для организации консультаций</li>
              <li>Ответа на ваши вопросы</li>
              <li>Улучшения качества сервиса</li>
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-bold text-brand-dark">4. Хранение данных</h2>
            <p>
              Ваши данные хранятся в защищённом виде и не передаются третьим лицам без вашего согласия. Мы не продаём и не передаём ваши персональные данные кому-либо.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-brand-dark">5. Ваши права</h2>
            <p>Вы можете в любой момент:</p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Запросить информацию о хранящихся данных</li>
              <li>Потребовать удаления ваших данных</li>
              <li>Отказаться от получения уведомлений</li>
            </ul>
            <p>Для этого напишите нам в WhatsApp или Telegram.</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-brand-dark">6. Cookies</h2>
            <p>
              Сайт использует cookies для аналитики и улучшения работы. Вы можете отключить cookies в настройках браузера.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-brand-dark">7. Контакты</h2>
            <p>
              По вопросам обработки персональных данных: <a href="https://t.me/svet_psv_uz" className="text-brand-primary hover:underline">@svet_psv_uz</a>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
