'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const GREETING =
  'Здравствуйте! Я — виртуальный помощник Светланы Поповой. Расскажите, что вас беспокоит, и я постараюсь помочь разобраться. Если нужна более глубокая работа — подскажу, как записаться к Светлане.'

const MAX_MESSAGES = 15

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: GREETING },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [contactName, setContactName] = useState('')
  const [contactPhone, setContactPhone] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [consentGiven, setConsentGiven] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)
  const [showCloseConfirm, setShowCloseConfirm] = useState(false)
  const [transcriptSent, setTranscriptSent] = useState(false)
  const [showBubble, setShowBubble] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const userMessageCount = messages.filter((m) => m.role === 'user').length
  const hasConversation = userMessageCount > 0

  // Show bubble hint after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowBubble(true), 5000)
    return () => clearTimeout(timer)
  }, [])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || isLoading) return

    const newMessages: Message[] = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setInput('')
    setIsLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages.slice(1) }), // skip greeting
      })

      if (!res.ok) {
        const data = await res.json()
        if (data.limitReached) {
          setMessages([...newMessages, { role: 'assistant', content: data.message }])
          return
        }
        throw new Error(data.error)
      }

      // Stream response
      const reader = res.body?.getReader()
      if (!reader) throw new Error('No reader')

      let assistantContent = ''
      setMessages([...newMessages, { role: 'assistant', content: '' }])

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || !trimmed.startsWith('data: ')) continue
          const data = trimmed.slice(6)
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            if (parsed.content) {
              assistantContent += parsed.content
              setMessages((prev) => {
                const updated = [...prev]
                updated[updated.length - 1] = {
                  role: 'assistant',
                  content: assistantContent,
                }
                return updated
              })
            }
          } catch {
            // skip
          }
        }
      }
    } catch {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'Извините, произошла ошибка. Попробуйте ещё раз или напишите Светлане в WhatsApp: +79035698984',
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, messages])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const sendTranscript = useCallback(async () => {
    if (transcriptSent || !hasConversation) return

    try {
      await fetch('/api/chat/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.slice(1), // skip greeting
          contactName: contactName || undefined,
          contactPhone: contactPhone || undefined,
          contactEmail: contactEmail || undefined,
          consentGiven,
        }),
      })
      setTranscriptSent(true)
    } catch {
      // silent fail
    }
  }, [messages, contactName, contactPhone, contactEmail, consentGiven, transcriptSent, hasConversation])

  const handleClose = () => {
    if (!hasConversation) {
      setIsOpen(false)
      return
    }

    if (consentGiven) {
      sendTranscript()
      setIsOpen(false)
      return
    }

    setShowCloseConfirm(true)
  }

  const confirmCloseWithConsent = () => {
    setConsentGiven(true)
    setShowCloseConfirm(false)
    // send transcript then close
    fetch('/api/chat/transcript', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: messages.slice(1),
        contactName: contactName || undefined,
        contactPhone: contactPhone || undefined,
        contactEmail: contactEmail || undefined,
        consentGiven: true,
      }),
    }).catch(() => {})
    setTranscriptSent(true)
    setIsOpen(false)
  }

  const confirmCloseWithout = () => {
    setShowCloseConfirm(false)
    setIsOpen(false)
  }

  const limitReached = userMessageCount >= MAX_MESSAGES

  return (
    <>
      {/* Chat toggle button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true)
            setShowBubble(false)
          }}
          className="fixed bottom-6 right-24 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 bg-brand-primary text-white group"
          title="Задать вопрос"
        >
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>

          {/* Bubble hint */}
          {showBubble && (
            <span className="absolute right-16 bg-white text-brand-dark text-sm px-3 py-2 rounded-lg shadow-md whitespace-nowrap animate-fade-in pointer-events-none">
              Есть вопрос? Спросите!
            </span>
          )}
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-[360px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-2rem)] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="bg-brand-primary text-white px-4 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-semibold">
                СП
              </div>
              <div>
                <div className="font-semibold text-sm">Помощник Светланы</div>
                <div className="text-xs text-white/70">Онлайн</div>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
              title="Закрыть"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-brand-bg/30">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === 'user'
                      ? 'bg-brand-primary text-white rounded-br-sm'
                      : 'bg-white text-brand-dark shadow-sm rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.content === '' && (
              <div className="flex justify-start">
                <div className="bg-white text-brand-muted px-3 py-2 rounded-2xl rounded-bl-sm shadow-sm text-sm">
                  <span className="inline-flex gap-1">
                    <span className="w-2 h-2 bg-brand-muted/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-brand-muted/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-brand-muted/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Contact form (collapsible) */}
          {showContactForm && (
            <div className="px-4 py-3 bg-brand-light/50 border-t border-gray-100 shrink-0">
              <div className="text-xs text-brand-muted mb-2">
                Оставьте контакт — Светлана сможет связаться с вами:
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Ваше имя"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full text-sm px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:border-brand-primary"
                />
                <input
                  type="tel"
                  placeholder="Телефон или WhatsApp"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full text-sm px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:border-brand-primary"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full text-sm px-3 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:border-brand-primary"
                />
                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="mt-0.5 accent-brand-primary"
                  />
                  <span className="text-xs text-brand-muted leading-tight">
                    Я согласен(а) на отправку переписки Светлане для подготовки к консультации
                  </span>
                </label>
              </div>
              <button
                onClick={() => setShowContactForm(false)}
                className="text-xs text-brand-muted hover:text-brand-dark mt-1"
              >
                Скрыть
              </button>
            </div>
          )}

          {/* Contact prompt after a few messages */}
          {userMessageCount >= 3 && !showContactForm && !consentGiven && !limitReached && (
            <button
              onClick={() => setShowContactForm(true)}
              className="mx-4 mb-1 text-xs text-brand-primary hover:text-brand-accent transition-colors text-left shrink-0"
            >
              📋 Оставить контакт для Светланы
            </button>
          )}

          {/* Input area */}
          <div className="px-3 py-2 border-t border-gray-100 bg-white shrink-0">
            {limitReached ? (
              <div className="text-center py-2">
                <a
                  href="/zapis/"
                  className="inline-block bg-brand-accent text-white text-sm px-4 py-2 rounded-lg hover:bg-brand-accent/90 transition-colors"
                >
                  Записаться к Светлане
                </a>
              </div>
            ) : (
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Напишите сообщение..."
                  rows={1}
                  className="flex-1 text-sm px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-brand-primary resize-none max-h-20"
                  disabled={isLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="w-9 h-9 rounded-full bg-brand-primary text-white flex items-center justify-center hover:bg-brand-primary/90 transition-colors disabled:opacity-40 shrink-0"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19V5m0 0l-7 7m7-7l7 7" />
                  </svg>
                </button>
              </div>
            )}
            <div className="text-center mt-1">
              <span className="text-[10px] text-brand-muted">
                {userMessageCount}/{MAX_MESSAGES} · ИИ-помощник, не заменяет специалиста
              </span>
            </div>
          </div>

          {/* Close confirmation overlay */}
          {showCloseConfirm && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-4 z-10">
              <div className="bg-white rounded-xl p-5 shadow-xl max-w-[280px] w-full">
                <p className="text-sm text-brand-dark font-medium mb-1">Сохранить переписку?</p>
                <p className="text-xs text-brand-muted mb-4">
                  Светлана сможет ознакомиться с вашим запросом до консультации — это поможет подготовиться к встрече.
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={confirmCloseWithConsent}
                    className="w-full text-sm bg-brand-primary text-white py-2 rounded-lg hover:bg-brand-primary/90 transition-colors"
                  >
                    Да, отправить Светлане
                  </button>
                  <button
                    onClick={confirmCloseWithout}
                    className="w-full text-sm text-brand-muted py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Нет, просто закрыть
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}
