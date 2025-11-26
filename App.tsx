import React, { useState, useEffect, useCallback } from 'react';
import { Pokemon, Move, GameState } from './types';
import { POKEMON_DATA } from './constants';
import { calculateTurn } from './services/geminiService';
import HealthBar from './components/HealthBar';
import PokemonSprite from './components/PokemonSprite';
import BattleLog from './components/BattleLog';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.SELECTING);
  const [playerPokemon, setPlayerPokemon] = useState<Pokemon | null>(null);
  const [opponentPokemon, setOpponentPokemon] = useState<Pokemon | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Animation states
  const [playerDamaged, setPlayerDamaged] = useState(false);
  const [opponentDamaged, setOpponentDamaged] = useState(false);
  const [playerAttacking, setPlayerAttacking] = useState(false);
  const [opponentAttacking, setOpponentAttacking] = useState(false);

  const [winner, setWinner] = useState<'player' | 'opponent' | null>(null);

  const startGame = (pokemon: Pokemon) => {
    setPlayerPokemon({ ...pokemon });
    
    // Random opponent that isn't the player's choice
    const opponents = POKEMON_DATA.filter(p => p.id !== pokemon.id);
    const randomOpponent = opponents[Math.floor(Math.random() * opponents.length)];
    setOpponentPokemon({ ...randomOpponent });
    
    setLogs([`野生 ${randomOpponent.name} 出现了!`, `去吧! ${pokemon.name}!`]);
    setGameState(GameState.BATTLE);
    setWinner(null);
  };

  const handleAttack = useCallback(async (move: Move) => {
    if (!playerPokemon || !opponentPokemon || isProcessing || gameState !== GameState.BATTLE) return;

    setIsProcessing(true);
    setPlayerAttacking(true);
    setTimeout(() => setPlayerAttacking(false), 300);

    // Call Gemini
    const turnResult = await calculateTurn(playerPokemon, opponentPokemon, move);

    // Update Logs
    setLogs(prev => [...prev, turnResult.commentary]);

    // Apply Damage with delays for animation
    setTimeout(() => {
        // Player hits Opponent
        setOpponentDamaged(true);
        setTimeout(() => setOpponentDamaged(false), 500);

        setOpponentPokemon(prev => {
          if (!prev) return null;
          const newHp = Math.max(0, prev.hp - turnResult.playerDamage);
          return { ...prev, hp: newHp };
        });

        // If battle continues, Opponent hits Player
        // Fix: Compare against null value, not 'null' string, as TurnResult uses null for no winner
        if (turnResult.winner === null || turnResult.winner === 'opponent') {
            setTimeout(() => {
                setOpponentAttacking(true);
                setTimeout(() => setOpponentAttacking(false), 300);

                setTimeout(() => {
                    setPlayerDamaged(true);
                    setTimeout(() => setPlayerDamaged(false), 500);

                    setPlayerPokemon(prev => {
                        if (!prev) return null;
                        const newHp = Math.max(0, prev.hp - turnResult.opponentDamage);
                        return { ...prev, hp: newHp };
                    });
                }, 300);
            }, 800);
        }
    }, 500);

    // Check winner
    setTimeout(() => {
        // Fix: Compare against null value, not 'null' string
        if (turnResult.winner !== null) {
            setWinner(turnResult.winner);
            setGameState(GameState.GAME_OVER);
            const winMsg = turnResult.winner === 'player' ? '恭喜！你赢了！' : '很遗憾，你输了...';
            setLogs(prev => [...prev, winMsg]);
        }
        setIsProcessing(false);
    }, 2000);

  }, [playerPokemon, opponentPokemon, isProcessing, gameState]);

  const resetGame = () => {
    setGameState(GameState.SELECTING);
    setPlayerPokemon(null);
    setOpponentPokemon(null);
    setLogs([]);
    setWinner(null);
  };

  // --- RENDER FUNCTIONS ---

  const renderSelection = () => (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-slate-900 to-slate-800">
      <h1 className="text-4xl md:text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-500 drop-shadow-lg">
        AI 宝可梦对战
      </h1>
      <p className="text-slate-400 mb-8 text-lg">选择你的伙伴:</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl w-full">
        {POKEMON_DATA.map((p) => (
          <button
            key={p.id}
            onClick={() => startGame(p)}
            className={`
              relative group overflow-hidden rounded-xl border-2 border-slate-700 hover:border-white 
              transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl bg-slate-800
            `}
          >
            <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${p.color}`} />
            <div className="p-6 flex flex-col items-center">
              <img src={p.spriteFront} alt={p.name} className="w-24 h-24 object-contain mb-4 rendering-pixelated" style={{imageRendering: 'pixelated'}} />
              <h3 className="text-xl font-bold text-white">{p.name}</h3>
              <div className="flex gap-2 mt-2">
                {p.type.map(t => (
                  <span key={t} className="text-xs px-2 py-1 rounded bg-slate-700 text-slate-300 border border-slate-600">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </button>
        ))}
      </div>
      
      <div className="mt-12 text-slate-500 text-sm">
        Powered by Google Gemini
      </div>
    </div>
  );

  const renderBattle = () => {
    if (!playerPokemon || !opponentPokemon) return null;

    return (
      <div className="flex flex-col h-screen max-w-5xl mx-auto p-2 sm:p-4">
        {/* Header */}
        <header className="flex justify-between items-center py-2 sm:py-4 border-b border-slate-800">
          <button onClick={resetGame} className="text-slate-400 hover:text-white transition-colors text-sm">
            ← 逃跑
          </button>
          <h1 className="font-bold text-xl tracking-wider text-yellow-500">BATTLE ARENA</h1>
          <div className="w-10"></div>
        </header>

        {/* Battle Stage */}
        <div className="flex-1 relative bg-slate-800/50 rounded-xl mt-4 border border-slate-700 overflow-hidden flex flex-col justify-between p-6 sm:p-12 bg-[url('https://picsum.photos/1000/600?blur=5&grayscale')] bg-cover bg-center">
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>

            {/* Opponent Area (Top Right) */}
            <div className="relative z-10 flex flex-col items-end self-end w-full sm:w-2/3">
                <div className="flex flex-col items-end mb-4 w-full">
                    <HealthBar current={opponentPokemon.hp} max={opponentPokemon.maxHp} label={opponentPokemon.name} />
                </div>
                <div className="mr-8 sm:mr-16">
                    <PokemonSprite 
                        src={opponentPokemon.spriteFront} 
                        alt={opponentPokemon.name} 
                        isPlayer={false}
                        isTakingDamage={opponentDamaged}
                        isAttacking={opponentAttacking}
                    />
                </div>
            </div>

            {/* Player Area (Bottom Left) */}
            <div className="relative z-10 flex flex-col items-start self-start w-full sm:w-2/3 mt-8 sm:mt-0">
                 <div className="ml-8 sm:ml-16 mb-4">
                    <PokemonSprite 
                        src={playerPokemon.spriteBack} 
                        alt={playerPokemon.name} 
                        isPlayer={true}
                        isTakingDamage={playerDamaged}
                        isAttacking={playerAttacking}
                    />
                </div>
                <div className="flex flex-col items-start w-full">
                    <HealthBar current={playerPokemon.hp} max={playerPokemon.maxHp} label={playerPokemon.name} />
                </div>
            </div>
        </div>

        {/* Controls & Log */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 h-1/3 min-h-[250px]">
            {/* Log */}
            <div className="order-2 md:order-1 h-full">
                <BattleLog logs={logs} />
            </div>

            {/* Moves */}
            <div className="order-1 md:order-2 bg-slate-800 rounded-lg p-4 border border-slate-700 shadow-inner grid grid-cols-2 gap-3 h-full overflow-y-auto">
                {gameState === GameState.GAME_OVER ? (
                    <div className="col-span-2 flex flex-col items-center justify-center h-full">
                        <h2 className={`text-3xl font-bold mb-4 ${winner === 'player' ? 'text-yellow-400' : 'text-gray-400'}`}>
                           {winner === 'player' ? '胜利!' : '败北...'}
                        </h2>
                        <button 
                            onClick={resetGame}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold shadow-lg transition-transform transform hover:scale-105"
                        >
                            再次挑战
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="col-span-2 text-slate-400 text-sm mb-1 uppercase tracking-wider flex justify-between">
                            <span>选择招式</span>
                            {isProcessing && <span className="text-yellow-400 animate-pulse">Thinking...</span>}
                        </div>
                        {playerPokemon.moves.map((move, idx) => (
                            <button
                                key={idx}
                                disabled={isProcessing}
                                onClick={() => handleAttack(move)}
                                className={`
                                    relative p-4 rounded-lg text-left transition-all duration-200 border border-slate-600
                                    ${isProcessing 
                                        ? 'bg-slate-800 opacity-50 cursor-not-allowed' 
                                        : 'bg-slate-700 hover:bg-slate-600 hover:border-white hover:-translate-y-1 active:scale-95 shadow-md hover:shadow-xl'
                                    }
                                `}
                            >
                                <div className="font-bold text-lg text-white">{move.name}</div>
                                <div className="text-xs text-slate-400 mt-1 flex justify-between">
                                    <span>{move.type}</span>
                                    <span>PP ∞</span>
                                </div>
                            </button>
                        ))}
                    </>
                )}
            </div>
        </div>
      </div>
    );
  };

  return (
    <>
        {gameState === GameState.SELECTING && renderSelection()}
        {(gameState === GameState.BATTLE || gameState === GameState.GAME_OVER) && renderBattle()}
    </>
  );
};

export default App;