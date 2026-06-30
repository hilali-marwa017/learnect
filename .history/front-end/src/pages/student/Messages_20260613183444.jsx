import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import { Send, Search, CheckCheck } from 'lucide-react';

export default function StudentMessages() {
  const { user } = useAuth();
  const [activePartner, setActivePartner] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [typedText, setTypedText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(function() {
    chargerConversations();
  }, []);

  async function chargerConversations() {
    try {
      const response = await api.get('/messages/conversations');
      setConversations(response.data);
      if (response.data.length > 0) {
        setActivePartner(response.data[0]);
        chargerMessages(response.data[0].id_reservation);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function chargerMessages(idReservation) {
    try {
      const response = await api.get(`/messages/conversations/${idReservation}`);
      setMessages(response.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!typedText.trim() || !activePartner) return;

    try {
      const response = await api.post('/messages', {
        contenu: typedText,
        id_destinataire: activePartner.id_destinataire,
        id_reservation: activePartner.id_reservation
      });
      setMessages([...messages, response.data.data]);
      setTypedText('');
    } catch (err) {
      console.error(err);
    }
  }

  function selectConversation(conv) {
    setActivePartner(conv);
    chargerMessages(conv.id_reservation);
  }

  if (loading) {
    return (
      <div className="pt-24 pb-16 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="spinner-border text-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Messagerie</h1>
          <p className="text-gray-500 text-sm">Échangez avec vos professeurs</p>
        </div>

        <div className="bg-white border rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-3 min-h-[500px]">
          
          {/* Liste des conversations */}
          <div className="lg:col-span-1 border-r">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input type="text" placeholder="Rechercher..." className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm" />
              </div>
            </div>
            <div className="divide-y">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-500">Aucune conversation</div>
              ) : (
                conversations.map(function(conv) {
                  const isActive = activePartner?.id_reservation === conv.id_reservation;
                  return (
                    <button key={conv.id_reservation} onClick={function() { selectConversation(conv); }} className={`w-full text-left p-4 flex gap-3 hover:bg-gray-50 transition-colors ${isActive ? 'bg-orange-50' : ''}`}>
                      <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <i className="bi bi-person text-orange-500"></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">{conv.creneau?.enseignant?.user?.prenom} {conv.creneau?.enseignant?.user?.nom}</p>
                        <p className="text-xs text-gray-500 truncate">{conv.last_message || 'Nouvelle conversation'}</p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Zone de chat */}
          <div className="lg:col-span-2 flex flex-col h-[600px]">
            {activePartner ? (
              <>
                <div className="p-4 border-b bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center">
                      <i className="bi bi-person text-orange-500"></i>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{activePartner.creneau?.enseignant?.user?.prenom} {activePartner.creneau?.enseignant?.user?.nom}</h3>
                      <p className="text-xs text-green-600">En ligne</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map(function(msg) {
                    const isMe = msg.id_expediteur === user?.utilisateur_id;
                    return (
                      <div key={msg.id_message} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-3 rounded-2xl ${isMe ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-900'}`}>
                          <p className="text-sm">{msg.contenu}</p>
                          <span className={`text-[10px] mt-1 block ${isMe ? 'text-orange-200' : 'text-gray-400'}`}>
                            {new Date(msg.created_at).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t flex gap-2">
                  <input type="text" value={typedText} onChange={function(e) { setTypedText(e.target.value); }} placeholder="Écrivez votre message..." className="flex-1 border rounded-lg px-4 py-2 text-sm" />
                  <button type="submit" disabled={!typedText.trim()} className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 disabled:opacity-50">
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-400">
                <p>Sélectionnez une conversation</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}