import React, { useState, useEffect, useRef } from 'react'
import api from '../../api/axios'
import { Send, Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

export default function StudentMessages() {
  const { user } = useAuth()
  const [conversations, setConversations] = useState([])
  const [activeReservation, setActiveReservation] = useState(null)
  const [messages, setMessages] = useState([])
  const [typedText, setTypedText] = useState('')
  const [loading, setLoading] = useState(true)
  const chatEndRef = useRef(null)

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get('/messages/conversations')
        setConversations(res.data)
        if (res.data.length > 0) setActiveReservation(res.data[0])
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    fetchConversations()
  }, [])

  useEffect(() => {
    if (!activeReservation) return
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/messages/${activeReservation.id_reservation}`)
        setMessages(res.data)
      } catch (e) { console.error(e) }
    }
    fetchMessages()
  }, [activeReservation])

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const handleSend = async (e) => {
    e.preventDefault()
    if (!typedText.trim() || !activeReservation) return
    const enseignantId = activeReservation.creneau?.enseignant?.utilisateur_id || activeReservation.creneau?.id_enseignant
    try {
      const res = await api.post('/messages', {
        contenu: typedText,
        id_destinataire: enseignantId,
        id_reservation: activeReservation.id_reservation,
      })
      setMessages((prev) => [...prev, res.data.data])
      setTypedText('')
    } catch (e) { alert(e.response?.data?.message || 'Erreur envoi message.') }
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-canvas">
      <div className="max-w-7xl mx-auto px-6 space-y-8 animate-in fade-in duration-300">
        <div className="border-b border-hairline-strong pb-6 space-y-1">
          <span className="text-[10px] uppercase font-bold font-mono text-accent-orange tracking-widest block">LEARNECT PLATFORM</span>
          <h1 className="text-3xl font-black text-ink tracking-tight">Messagerie Sécurisée</h1>
          <p className="text-charcoal text-xs">Échangez de manière sécurisée avec vos professeurs de soutien scolaire.</p>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <StudentNavigationActive activeTab="messages" />
          <div className="flex-1 bg-surface-card border border-hairline-strong rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
            {/* Sidebar conversations */}
            <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-hairline-strong flex flex-col bg-surface-deep/20">
              <div className="p-4 border-b border-hairline-strong bg-surface-card flex items-center gap-2">
                <Search className="h-4 w-4 text-mute" />
                <input type="text" placeholder="Rechercher..." className="bg-transparent border-none text-xs text-ink outline-none placeholder:text-stone/60 w-full" />
              </div>
              <div className="flex-grow divide-y divide-hairline overflow-y-auto">
                {loading ? (
                  <p className="text-xs text-mute text-center p-6 animate-pulse font-mono">Chargement...</p>
                ) : conversations.length > 0 ? conversations.map((conv) => {
                  const enseignant = conv.creneau?.enseignant?.user
                  const isActive = activeReservation?.id_reservation === conv.id_reservation
                  return (
                    <button key={conv.id_reservation} onClick={() => setActiveReservation(conv)}
                      className={`w-full text-left p-4 flex gap-3 transition-colors cursor-pointer ${isActive ? 'bg-surface-elevated border-l-4 border-accent-orange' : 'hover:bg-surface-deep/35'}`}>
                      <div className="h-10 w-10 rounded-full bg-accent-orange/20 flex items-center justify-center shrink-0 text-accent-orange font-bold text-sm">
                        {enseignant?.prenom?.[0]}{enseignant?.nom?.[0]}
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-xs font-bold text-ink truncate">{enseignant?.prenom} {enseignant?.nom}</p>
                        <p className="text-[10px] text-mute font-mono">Réservation #{conv.id_reservation}</p>
                        <p className="text-[10px] text-charcoal truncate">{conv.date}</p>
                      </div>
                    </button>
                  )
                }) : (
                  <p className="text-xs text-mute text-center p-6 font-mono">Aucune conversation.<br />Réservez un cours d'abord.</p>
                )}
              </div>
            </div>
            {/* Chat window */}
            <div className="lg:col-span-8 flex flex-col bg-surface-card justify-between">
              {activeReservation ? (
                <>
                  <div className="p-4 border-b border-hairline-strong flex items-center gap-3 bg-surface-deep/10">
                    <div className="h-9 w-9 rounded-full bg-accent-orange/20 flex items-center justify-center text-accent-orange font-bold text-sm">
                      {activeReservation.creneau?.enseignant?.user?.prenom?.[0]}
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-ink">{activeReservation.creneau?.enseignant?.user?.prenom} {activeReservation.creneau?.enseignant?.user?.nom}</h4>
                      <p className="text-[10px] text-mute font-mono">Cours du {activeReservation.date}</p>
                    </div>
                  </div>
                  <div className="p-6 flex-grow space-y-4 max-h-[350px] overflow-y-auto flex flex-col">
                    {messages.map((msg, idx) => {
                      const isMe = msg.id_expediteur === user?.utilisateur_id
                      return (
                        <div key={idx} className={`flex flex-col max-w-[80%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                          <div className={`p-3.5 rounded-2xl text-xs font-medium leading-relaxed ${isMe ? 'bg-accent-orange text-canvas rounded-br-none' : 'bg-surface-deep/50 border border-hairline text-ink rounded-bl-none'}`}>
                            {msg.contenu}
                          </div>
                          <span className="text-[8px] text-mute font-mono mt-1">{new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      )
                    })}
                    <div ref={chatEndRef} />
                  </div>
                  <form onSubmit={handleSend} className="p-4 border-t border-hairline-strong bg-surface-deep/15 flex gap-3">
                    <input required type="text" value={typedText} onChange={(e) => setTypedText(e.target.value)}
                      placeholder="Tapez votre message..."
                      className="w-full bg-surface-card border border-hairline-strong text-ink rounded-xl px-4 py-3 text-xs outline-none focus:ring-1 focus:ring-accent-orange placeholder:text-stone/60" />
                    <button type="submit" className="bg-ink text-canvas hover:bg-accent-orange hover:text-white px-5 rounded-xl text-xs font-bold transition-all flex items-center justify-center cursor-pointer shrink-0">
                      <Send className="h-4 w-4" />
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-mute text-xs font-mono p-8 text-center">
                  Sélectionnez une conversation pour commencer à échanger.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}