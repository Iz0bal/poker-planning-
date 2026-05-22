import { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import CardDeck from '../components/CardDeck.jsx';
import PlayerList from '../components/PlayerList.jsx';
import ResultsDisplay from '../components/ResultsDisplay.jsx';

export default function PokerPage() {
  const { teamId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const socketRef = useRef(null);
  const prevRevealedRef = useRef(false);

  const [roomState, setRoomState] = useState({ users: [], revealed: false, teamLabel: '' });
  const [selectedCard, setSelectedCard] = useState(null);
  const [connected, setConnected] = useState(false);

  const name = state?.name;

  useEffect(() => {
    if (!name) {
      navigate('/', { replace: true });
      return;
    }

    const socket = io({ transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnected(true);
      socket.emit('join', { team: teamId, name });
    });

    socket.on('room_update', (data) => {
      // Only clear selection on reset (revealed → not revealed), not after voting
      if (prevRevealedRef.current && !data.revealed) setSelectedCard(null);
      prevRevealedRef.current = data.revealed;
      setRoomState(data);
    });

    socket.on('disconnect', () => setConnected(false));

    return () => socket.disconnect();
  }, [teamId, name, navigate]);

  function handleVote(value) {
    setSelectedCard(value);
    socketRef.current?.emit('vote', { value });
  }

  function handleReveal() {
    socketRef.current?.emit('reveal');
  }

  function handleReset() {
    setSelectedCard(null);
    socketRef.current?.emit('reset');
  }

  if (!name) return null;

  return (
    <div className="poker-page">
      <header className="poker-header">
        <button className="btn-back" onClick={() => navigate('/')}>← Teams</button>
        <h2 className="poker-team-title">{roomState.teamLabel || teamId}</h2>
        <span className={`connection-dot ${connected ? 'connection-dot--on' : 'connection-dot--off'}`} title={connected ? 'Connected' : 'Disconnected'} />
      </header>

      <div className="poker-layout">
        <aside className="poker-sidebar">
          <PlayerList users={roomState.users} revealed={roomState.revealed} />
        </aside>

        <main className="poker-main">
          {!roomState.revealed ? (
            <>
              <p className="poker-instruction">
                {selectedCard
                  ? `You voted: ${selectedCard} — waiting for reveal`
                  : 'Pick a card to cast your vote'}
              </p>
              <CardDeck
                selectedCard={selectedCard}
                onVote={handleVote}
                disabled={roomState.revealed}
              />
              <button className="btn btn-reveal" onClick={handleReveal}>
                Reveal cards
              </button>
            </>
          ) : (
            <>
              <ResultsDisplay users={roomState.users} />
              <button className="btn btn-reset" onClick={handleReset}>
                New vote
              </button>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
