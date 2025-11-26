import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Pokemon, TurnResult, Move } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const turnSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    playerDamage: { type: Type.INTEGER, description: "Damage dealt to the opponent Pokemon (0-100)" },
    opponentDamage: { type: Type.INTEGER, description: "Damage dealt to the player Pokemon (0-100)" },
    commentary: { type: Type.STRING, description: "Exciting commentary of the turn in Chinese. Describe both moves." },
    opponentMove: { type: Type.STRING, description: "The name of the move the opponent used." },
    playerCrit: { type: Type.BOOLEAN, description: "Did the player land a critical hit?" },
    opponentCrit: { type: Type.BOOLEAN, description: "Did the opponent land a critical hit?" },
    effectiveness: { 
      type: Type.STRING, 
      enum: ['neutral', 'super', 'not_very'],
      description: "Effectiveness of the player's move against the opponent."
    },
    winner: { 
      type: Type.STRING, 
      enum: ['player', 'opponent', 'null'],
      description: "Who won this turn? Only set if HP drops to 0. Use 'null' (string) if battle continues."
    }
  },
  required: ["playerDamage", "opponentDamage", "commentary", "opponentMove", "playerCrit", "opponentCrit", "effectiveness", "winner"]
};

export const calculateTurn = async (
  player: Pokemon, 
  opponent: Pokemon, 
  move: Move
): Promise<TurnResult> => {
  
  const prompt = `
    Simulate a turn in a Pokemon battle. 
    
    Current State:
    Player: ${player.name} (Type: ${player.type.join('/')}) - HP: ${player.hp}/${player.maxHp}
    Opponent: ${opponent.name} (Type: ${opponent.type.join('/')}) - HP: ${opponent.hp}/${opponent.maxHp}
    Opponent Moves Available: ${opponent.moves.map(m => m.name).join(', ')}

    Action:
    Player uses move: "${move.name}" (Type: ${move.type}).

    Task:
    1. Determine the effectiveness of the player's move against the opponent's type.
    2. Calculate realistic damage (roughly 10-40 depending on effectiveness) to the Opponent.
    3. Select a move for the Opponent to use back.
    4. Calculate realistic damage to the Player.
    5. Provide exciting commentary in Chinese (Simplified Chinese).
    6. If any HP drops to 0 or below, declare a winner.

    Rules:
    - Be fair but dramatic.
    - Type advantages matter (Water > Fire, Fire > Grass, Electric > Water, etc.).
    - If Player HP reaches 0, winner is 'opponent'.
    - If Opponent HP reaches 0, winner is 'player'.
    - If neither, winner is 'null'.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: turnSchema,
        temperature: 0.7, // Add some randomness to damage rolls
      },
    });

    const result = JSON.parse(response.text);
    
    // Safety check to ensure winner is handled correctly if JSON returns generic string
    let winner: 'player' | 'opponent' | null = null;
    if (result.winner === 'player') winner = 'player';
    if (result.winner === 'opponent') winner = 'opponent';

    // Double check HP logic locally to prevent hallucinations where damage > HP but no winner declared
    if (opponent.hp - result.playerDamage <= 0) winner = 'player';
    else if (player.hp - result.opponentDamage <= 0) winner = 'opponent';

    return {
      ...result,
      winner
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback in case of API failure to prevent crash
    return {
      playerDamage: 10,
      opponentDamage: 10,
      commentary: "通讯故障... 但战斗还在继续！双方都受到了一点伤害。",
      opponentMove: "挣扎",
      playerCrit: false,
      opponentCrit: false,
      effectiveness: 'neutral',
      winner: null
    };
  }
};
