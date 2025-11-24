import React, { useState, useEffect, useRef } from 'react';
import { 
  Plane, TowerControl, User, Plus, Trash2, Edit, RefreshCw, 
  AlertCircle, CheckCircle, XCircle, MapPin, Clock, Shield, 
  Send, Menu, MessageSquare, LogOut 
} from 'lucide-react';

// --- CONFIGURATION SUPABASE (Veuillez utiliser les variables d'environnement en production) ---
const SUPABASE_URL = 'https://nhbyljfdxegvbvbxvdyb.supabase.co';
// WARNING: This key is public. Use Vercel Environment Variables for production secrets!
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5oYnlsamZkeGVndmJ2Ynh2ZHliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5Mzc4MjksImV4cCI6MjA3OTUxMzgyOX0.4cZueWKXBFhfBkgOsN6jFWuU9Tqcqe3hfgvGKlBdxjc';
const API_URL = `${SUPABASE_URL}/rest/v1`;

const App = () => {
  // --- État Global ---
  const [view, setView] = useState('client'); // 'client', 'pilot', 'tower'
  const [flights, setFlights] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPilot, setCurrentPilot] = useState('Capt. Maverick');
  const [isChatVisible, setIsChatVisible] = useState(false);
  const messagesEndRef = useRef(null);
  
  // --- API HELPER (Utilisation du REST API comme demandé) ---
  const sbFetch = async (endpoint, method = 'GET', body = null) => {
    const headers = {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation' 
    };

    const config = { method, headers };
    if (body) config.body = JSON.stringify(body);

    try {
      const res = await fetch(`${API_URL}/${endpoint}`, config);
      if (!res.ok) throw new Error(`Erreur API: ${res.status} ${res.statusText}`);
      return method === 'DELETE' ? null : await res.json();
    } catch (err) {
      console.error("Supabase Error:", err);
      setError(err.message);
      setLoading(false); // S'assurer que le chargement s'arrête en cas d'erreur
      return null;
    }
  };

  // --- Actions Données ---

  const fetchFlights = async () => {
    setLoading(true);
    setError(null);
    // Assurez-vous d'utiliser 'flights' comme nom de table (sans guillemets)
    const data = await sbFetch('flights?select=*&order=id.asc');
    if (data) setFlights(data);
    setLoading(false);
  };
  
  const fetchMessages = async () => {
    // Assurez-vous d'utiliser 'messages' comme nom de table
    const data = await sbFetch('messages?select=*&order=id.asc');
    if (data) setMessages(data);
  };

  // Chargement initial des deux jeux de données
  useEffect(() => {
    fetchFlights();
    fetchMessages();
    // Utilisation du Polling simple pour simuler le temps réel du Realtime
    const flightInterval = setInterval(fetchFlights, 5000);
    const messageInterval = setInterval(fetchMessages, 2000);
    return () => {
      clearInterval(flightInterval);
      clearInterval(messageInterval);
    };
  }, []);
  
  // Scroll automatique du chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Pilote : Demande un changement de statut
  const requestStatusChange = async (id, newStatus) => {
    // Envoi de la requête au serveur
    const updated = await sbFetch(`flights?id=eq.${id}`, 'PATCH', { pending_status: newStatus });
    if (updated) fetchFlights(); // Rafraîchir
  };

  // Tour : Approuve le changement
  const approveChange = async (flight) => {
    // Application du pending_status au status réel et remise à zéro du pending
    const updated = await sbFetch(`flights?id=eq.${flight.id}`, 'PATCH', { 
      status: flight.pending_status,
      pending_status: null 
    });
    if (updated) fetchFlights();
  };

  // Tour : Rejette le changement
  const rejectChange = async (id) => {
    // Remise à zéro du pending_status
    const updated = await sbFetch(`flights?id=eq.${id}`, 'PATCH', { pending_status: null });
    if (updated) fetchFlights();
  };

  const addFlight = async (newFlight) => {
    await sbFetch('flights', 'POST', newFlight);
    fetchFlights();
  };

  const deleteFlight = async (id) => {
    if (window.confirm('Supprimer ce plan de vol ?')) {
      await sbFetch(`flights?id=eq.${id}`, 'DELETE');
      fetchFlights();
    }
  };
  
  const sendMessage = async (content) => {
    if (!content.trim()) return;
    const role = view === 'tower' ? 'ATC' : 'PILOT';
    await sbFetch('messages', 'POST', { 
      content, 
      sender_callsign: view === 'client' ? 'PASSENGER' : currentPilot, 
      role 
    });
    fetchMessages(); // Rafraîchir les messages
  };

  // --- Composants UI ---

  const StatusBadge = ({ status, pending = false }) => {
    const styles = {
      'ON_TIME': 'bg-green-100 text-green-800 border-green-200',
      'DELAYED': 'bg-red-100 text-red-800 border-red-200',
      'BOARDING': 'bg-blue-100 text-blue-800 border-blue-200',
      'IN_FLIGHT': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'LANDED': 'bg-gray-100 text-gray-800 border-gray-200',
      'CANCELLED': 'bg-gray-800 text-white border-gray-700',
    };
    
    const labels = {
      'ON_TIME': 'À l\'heure',
      'DELAYED': 'Retardé',
      'BOARDING': 'Embarquement',
      'IN_FLIGHT': 'En Vol',
      'LANDED': 'Atterri',
      'CANCELLED': 'Annulé',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${styles[status] || styles['ON_TIME']} ${pending ? 'opacity-70 border-dashed' : ''}`}>
        {pending && <Clock className="w-3 h-3 animate-pulse" />}
        {labels[status] || status}
      </span>
    );
  };
  
  const ChatSidebar = () => {
    const [inputMessage, setInputMessage] = useState('');
    
    const handleSubmit = (e) => {
      e.preventDefault();
      sendMessage(inputMessage);
      setInputMessage('');
    };
    
    const canChat = view !== 'client';

    return (
      <div className={`fixed inset-y-0 right-0 w-full md:w-80 bg-slate-900 z-40 flex flex-col transition-transform duration-300 ${isChatVisible ? 'translate-x-0' : 'translate-x-full md:translate-x-0'} md:relative md:translate-x-0 md:border-l border-slate-700`}>
        <div className="p-4 flex justify-between items-center border-b border-slate-700 bg-slate-800">
          <h3 className="font-bold text-blue-400 flex items-center gap-2">
            <MessageSquare className="w-5 h-5"/> Fréquence Radio {view === 'tower' ? '(ATC)' : (view === 'pilot' ? '(PILOTE)' : '')}
          </h3>
          <button onClick={() => setIsChatVisible(false)} className="md:hidden text-slate-400 hover:text-white">
            <XCircle className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm">
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.sender_callsign === currentPilot ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg shadow-md ${
                m.sender_callsign === currentPilot ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-100'
              }`}>
                <div className="text-xs font-bold mb-1 opacity-80">{m.sender_callsign} ({m.role})</div>
                <p>{m.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        {canChat ? (
          <form onSubmit={handleSubmit} className="p-3 border-t border-slate-700 bg-slate-800">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={inputMessage} 
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Votre message..."
                className="flex-1 bg-slate-900 border border-slate-700 text-white p-2 rounded focus:ring-blue-500 outline-none"
                disabled={!canChat}
              />
              <button type="submit" disabled={!canChat} className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded transition-colors disabled:opacity-50">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 text-center text-xs text-slate-500 border-t border-slate-700 bg-slate-800">Connectez-vous pour utiliser la radio.</div>
        )}
      </div>
    );
  };

  const ClientView = () => (
    <div className="flex-1 p-4 md:p-8 overflow-y-auto">
      <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow-lg border border-slate-200 relative">
          <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Plane className="w-6 h-6 text-blue-600" /> Tableau des Vols Public
          </h2>
          
          {loading && <div className="absolute top-6 right-6 text-blue-500"><RefreshCw className="w-5 h-5 animate-spin"/></div>}

          <div className="grid gap-4">
            {flights.map(flight => (
              <div key={flight.id} className="group flex flex-col md:flex-row items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100 shadow-sm">
                <div className="flex items-center gap-4 w-full md:w-auto">
                  <div className="bg-slate-800 text-white p-3 rounded-md font-mono font-bold text-lg w-20 text-center tracking-wider">
                    {flight.time}
                  </div>
                  <div>
                    <div className="text-xl font-black text-slate-900">{flight.code}</div>
                    <div className="text-sm text-slate-500 flex items-center gap-1">
                       {flight.origin} <span className="text-blue-400">✈</span> {flight.destination}
                    </div>
                  </div>
                </div>
                <div className="mt-4 md:mt-0 w-full md:w-auto flex justify-between md:justify-end items-center gap-4">
                  <StatusBadge status={flight.status} />
                </div>
              </div>
            ))}
            {flights.length === 0 && !loading && <div className="text-center text-slate-400 py-8">Aucun vol programmé.</div>}
          </div>
        </div>
      </div>
    </div>
  );

  const PilotView = () => {
    const myFlights = flights.filter(f => f.pilot === currentPilot);
    const pilotsList = [...new Set(flights.map(f => f.pilot))].filter(p => p); // Unique, non null/empty
    
    // Ajout du pilote actuel s'il n'est pas dans la liste (pour la démo)
    if (!pilotsList.includes(currentPilot)) pilotsList.push(currentPilot);

    return (
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto">
          {/* Header Cockpit */}
          <div className="flex flex-col md:flex-row justify-between items-center bg-slate-900 text-white p-4 rounded-xl shadow-lg border-b-4 border-blue-500">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="bg-blue-600 p-2 rounded-full"><User className="w-6 h-6"/></div>
              <div>
                <div className="text-xs text-blue-200 uppercase tracking-wider font-bold">Cockpit Access</div>
                <div className="font-bold text-lg">{currentPilot}</div>
              </div>
            </div>
            <select 
              value={currentPilot} 
              onChange={(e) => setCurrentPilot(e.target.value)}
              className="bg-slate-800 text-sm border border-slate-700 rounded px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {pilotsList.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <h3 className="text-xl font-bold text-slate-700 flex items-center gap-2">
            <Send className="w-5 h-5 text-blue-500"/> Console de Vol
          </h3>
          
          {myFlights.length === 0 ? (
            <div className="text-center p-12 bg-white rounded-xl border-2 border-dashed border-slate-200 text-slate-400">
              Aucun plan de vol actif pour ce pilote ({currentPilot}).
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {myFlights.map(flight => (
                <div key={flight.id} className="bg-white p-6 rounded-xl shadow-md border border-slate-200 flex flex-col justify-between relative overflow-hidden">
                  {flight.pending_status && (
                    <div className="absolute top-0 left-0 right-0 bg-yellow-100 text-yellow-800 text-xs font-bold text-center py-1 flex justify-center items-center gap-2 border-b border-yellow-200">
                      <Clock className="w-3 h-3" /> Demande "{flight.pending_status}" en attente d'approbation tour
                    </div>
                  )}
                  
                  <div className="mt-4 flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-3xl font-black text-slate-800">{flight.code}</h4>
                      <div className="text-sm font-mono text-slate-500 mt-1">
                        DÉPART: {flight.time}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-slate-400 uppercase font-bold">Actuel</span>
                      <StatusBadge status={flight.status} />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between bg-slate-50 p-3 rounded-lg mb-6 border border-slate-100">
                    <div className="font-bold text-slate-700">{flight.origin}</div>
                    <div className="text-blue-300">✈</div>
                    <div className="font-bold text-slate-700">{flight.destination}</div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-400 uppercase">Demander changement statut</div>
                    <div className="grid grid-cols-2 gap-2">
                      {['BOARDING', 'IN_FLIGHT', 'LANDED', 'DELAYED'].map((status) => (
                         <button 
                          key={status}
                          onClick={() => requestStatusChange(flight.id, status)} 
                          disabled={flight.pending_status || flight.status === status}
                          className={`px-3 py-2 text-xs rounded font-bold transition-all border
                            ${flight.status === status ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' : 
                              flight.pending_status ? 'bg-yellow-100 text-yellow-700 border-yellow-300 animate-pulse' :
                              'bg-white hover:bg-blue-50 text-slate-600 border-slate-200 hover:border-blue-300 shadow-sm'}
                          `}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const TowerView = () => {
    const [newFlight, setNewFlight] = useState({ code: '', origin: '', destination: '', time: '00:00', pilot: 'ATC', status: 'ON_TIME' });
    const pendingRequests = flights.filter(f => f.pending_status);

    const handleAdd = (e) => {
      e.preventDefault();
      if(!newFlight.code || !newFlight.time) return;
      addFlight(newFlight);
      setNewFlight({ code: '', origin: '', destination: '', time: '00:00', pilot: 'ATC', status: 'ON_TIME' });
    };

    return (
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
          
          <h2 className="text-3xl font-black text-slate-800 flex items-center gap-2">
            <TowerControl className="w-7 h-7 text-red-500"/> Console Tour de Contrôle
          </h2>

          {/* Section Alertes / Approbations */}
          {pendingRequests.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-md">
              <h3 className="text-red-800 font-bold flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5"/> {pendingRequests.length} Demande(s) de Changement en attente
              </h3>
              <div className="grid gap-3">
                {pendingRequests.map(req => (
                  <div key={req.id} className="bg-white p-4 rounded-lg shadow-sm flex flex-col md:flex-row justify-between items-center border border-red-100">
                    <div className="flex items-center gap-4 mb-3 md:mb-0">
                      <span className="font-black text-slate-800 text-lg">{req.code}</span>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-400 line-through">{req.status}</span>
                        <span className="text-slate-300">➔</span>
                        <StatusBadge status={req.pending_status} pending={true} />
                      </div>
                      <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">Par: {req.pilot}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => approveChange(req)} className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-bold shadow-sm transition-colors">
                        <CheckCircle className="w-4 h-4" /> Approuver
                      </button>
                      <button onClick={() => rejectChange(req.id)} className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-md text-sm font-bold transition-colors">
                        <XCircle className="w-4 h-4" /> Rejeter
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formulaire Ajout Rapide */}
          <div className="bg-slate-800 p-6 rounded-xl text-white shadow-lg">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-blue-400"><Plus className="w-5 h-5"/> Création Plan de Vol</h3>
            <form onSubmit={handleAdd} className="grid grid-cols-2 md:grid-cols-6 gap-3">
              <input placeholder="Code (AF123)" className="bg-slate-700 border-slate-600 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none transition-colors" value={newFlight.code} onChange={e => setNewFlight({...newFlight, code: e.target.value})} required />
              <input placeholder="Origine" className="bg-slate-700 border-slate-600 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none transition-colors" value={newFlight.origin} onChange={e => setNewFlight({...newFlight, origin: e.target.value})} />
              <input placeholder="Destination" className="bg-slate-700 border-slate-600 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none transition-colors" value={newFlight.destination} onChange={e => setNewFlight({...newFlight, destination: e.target.value})} />
              <input type="time" className="bg-slate-700 border-slate-600 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none transition-colors" value={newFlight.time} onChange={e => setNewFlight({...newFlight, time: e.target.value})} required />
              <input placeholder="Pilote" className="bg-slate-700 border-slate-600 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none transition-colors" value={newFlight.pilot} onChange={e => setNewFlight({...newFlight, pilot: e.t
