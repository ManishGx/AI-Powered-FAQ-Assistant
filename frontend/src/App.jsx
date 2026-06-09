import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [question, setQuestion] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const loadHistory = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/chat/history')
      const conversations = Array.isArray(response.data) ? response.data : []
      const historyMessages = conversations
        .slice()
        .reverse()
        .flatMap((conversation) => [
          {
            role: 'user',
            text: conversation.question,
            timestamp: conversation.timestamp,
          },
          {
            role: 'ai',
            text: conversation.answer,
            timestamp: conversation.timestamp,
          },
        ])

      setMessages(historyMessages)
    } catch (err) {
      console.error('Failed to load chat history:', err)
    }
  }

  useEffect(() => {
    loadHistory()
  }, [])

  const sendQuestion = async (event) => {
    event.preventDefault()
    if (!question.trim()) {
      return
    }

    const userMessage = { role: 'user', text: question.trim() }
    setMessages((prev) => [...prev, userMessage])
    setError(null)
    setLoading(true)

    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        question: question.trim(),
      })

      const answer = response.data?.answer || 'Sorry, I could not generate an answer.'
      const aiMessage = { role: 'ai', text: answer }
      setMessages((prev) => [...prev, aiMessage])
      setQuestion('')
    } catch (err) {
      console.error(err)
      setError('Unable to reach the AI service. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/95 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-sky-300/80">
                AI FAQ Assistant
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
                Ask a question and get an instant answer.
              </h1>
              <p className="mt-3 max-w-2xl text-slate-400">
                Type a question below, get an AI-generated response, and keep your chat history saved in MongoDB.
              </p>
            </div>
            <div className="rounded-3xl bg-slate-950/90 px-4 py-3 text-sm text-slate-300 ring-1 ring-slate-700">
              <p>Tailwind + Axios</p>
              <p className="mt-2 text-slate-400">Responsive, modern chat interface.</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/90 shadow-2xl shadow-black/20">
          <div className="border-b border-slate-800 px-6 py-5 sm:px-8">
            <h2 className="text-xl font-medium text-white">Chat history</h2>
            <p className="mt-1 text-sm text-slate-400">
              Previous conversations are fetched from the backend and preserved across refreshes.
            </p>
          </div>

          <div className="flex h-[58vh] flex-col overflow-hidden lg:h-[62vh]">
            <div className="flex-1 overflow-y-auto px-6 py-5 sm:px-8">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="rounded-3xl border border-dashed border-slate-700 bg-slate-950/80 p-8 text-center text-slate-500">
                    No messages yet. Ask your first question.
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={`rounded-3xl p-4 shadow-sm ${
                        message.role === 'user'
                          ? 'bg-slate-800 text-slate-100'
                          : 'bg-slate-950/90 border border-slate-800 text-slate-200'
                      }`}
                    >
                      <p className="text-sm uppercase tracking-[0.24em] text-slate-500">
                        {message.role === 'user' ? 'You' : 'AI'}
                      </p>
                      <p className="mt-3 whitespace-pre-line text-sm leading-7">
                        {message.text}
                      </p>
                      {message.timestamp && (
                        <p className="mt-2 text-xs text-slate-500">
                          {new Date(message.timestamp).toLocaleString()}
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="border-t border-slate-800 bg-slate-950/95 px-4 py-5 sm:px-6">
              <form className="grid gap-3 sm:grid-cols-[1fr_auto]" onSubmit={sendQuestion}>
                <label htmlFor="question" className="sr-only">
                  Ask a question
                </label>
                <input
                  id="question"
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="Ask something about AI, FAQs, or your app..."
                  className="min-h-[3.5rem] rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-500/10"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-3xl bg-sky-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-700"
                >
                  {loading ? 'Sending...' : 'Send'}
                </button>
              </form>
              {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}
              <p className="mt-3 text-xs text-slate-500">
                Note: this UI sends requests to <span className="text-slate-300">http://localhost:5000/api/chat</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
