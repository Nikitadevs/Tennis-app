/**
 * Utility functions for tennis match calculations and formatting.
 */

const MATCH_HISTORY_KEY = 'tennis_match_history';
const MAX_MATCHES = 100; // Keep last 100 matches

/**
 * Calculates the winner of a match based on set scores.
 * @param {Array<{player1: number, player2: number}>} sets - Array of set scores.
 * @returns {'player1' | 'player2' | null} Winner or null if undecided.
 */
export function getMatchWinner(sets) {
    let player1Sets = 0;
    let player2Sets = 0;

    sets.forEach(set => {
        if (set.player1 > set.player2) player1Sets++;
        else if (set.player2 > set.player1) player2Sets++;
    });

    if (player1Sets > sets.length / 2) return 'player1';
    if (player2Sets > sets.length / 2) return 'player2';
    return null;
}

/**
 * Formats a set score as a string.
 * @param {{player1: number, player2: number}} set
 * @returns {string}
 */
export function formatSetScore(set) {
    return `${set.player1}-${set.player2}`;
}

/**
 * Calculate additional match statistics
 * @param {Object} matchData - Raw match data
 * @returns {Object} Enhanced match data with statistics
 */
function enhanceMatchStats(matchData) {
    const stats = matchData.stats || {
        player1: { aces: 0, winners: 0 },
        player2: { aces: 0, winners: 0 }
    };

    // Calculate winning percentage for each player
    const totalPoints = Object.values(stats.player1).reduce((a, b) => a + b, 0) +
                       Object.values(stats.player2).reduce((a, b) => a + b, 0);
    
    if (totalPoints > 0) {
        stats.player1.winningPercentage = Math.round((stats.player1.winners / totalPoints) * 100);
        stats.player2.winningPercentage = Math.round((stats.player2.winners / totalPoints) * 100);
    }

    return {
        ...matchData,
        stats,
        date: matchData.date || new Date().toISOString(),
        id: matchData.id || Date.now()
    };
}

export const saveMatch = (matchData) => {
    const history = getMatchHistory();
    const enhancedMatch = enhanceMatchStats(matchData);
    
    // Add to start of array and limit to MAX_MATCHES
    history.unshift(enhancedMatch);
    if (history.length > MAX_MATCHES) {
        history.length = MAX_MATCHES;
    }
    
    localStorage.setItem(MATCH_HISTORY_KEY, JSON.stringify(history));
    return enhancedMatch;
};

export const getMatchHistory = () => {
    try {
        const history = JSON.parse(localStorage.getItem(MATCH_HISTORY_KEY)) || [];
        // Ensure all matches have enhanced stats
        return history.map(match => enhanceMatchStats(match));
    } catch {
        return [];
    }
};

export const deleteMatch = (matchId) => {
    const history = getMatchHistory();
    const newHistory = history.filter(match => match.id !== matchId);
    localStorage.setItem(MATCH_HISTORY_KEY, JSON.stringify(newHistory));
};

export const formatMatchDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Get aggregate statistics for a player
 * @param {string} playerName - Name of the player
 * @returns {Object} Aggregate statistics
 */
export const getPlayerStats = (playerName) => {
    const matches = getMatchHistory();
    
    return matches.reduce((stats, match) => {
        const isPlayer1 = match.winner === playerName;
        const playerStats = match.stats[isPlayer1 ? 'player1' : 'player2'];
        
        return {
            matches: stats.matches + 1,
            wins: stats.wins + (match.winner === playerName ? 1 : 0),
            totalAces: stats.totalAces + (playerStats?.aces || 0),
            totalWinners: stats.totalWinners + (playerStats?.winners || 0),
            winningPercentage: playerStats?.winningPercentage || 0
        };
    }, {
        matches: 0,
        wins: 0,
        totalAces: 0,
        totalWinners: 0,
        winningPercentage: 0
    });
};