import React, { useState, useEffect } from 'react';
import MatchTracker from '../components/MatchTracker';
import Toast from '../components/Toast';
import Skeleton from '../components/Skeleton';
import { saveMatch, getMatchHistory, deleteMatch, formatMatchDate } from '../utils/matchUtils';
import { getUserName } from '../utils/userUtils';

const Matches = () => {
    const [matches, setMatches] = useState([]);
    const [toast, setToast] = useState({ show: false, message: '' });
    const [selectedMatch, setSelectedMatch] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadMatches = async () => {
            // Simulate network delay for smoother loading experience
            await new Promise(resolve => setTimeout(resolve, 1000));
            setMatches(getMatchHistory());
            setIsLoading(false);
        };
        loadMatches();
    }, []);

    const handleMatchComplete = (matchData) => {
        const savedMatch = saveMatch(matchData);
        setMatches(prev => [savedMatch, ...prev]);
    };

    const handleDeleteMatch = (matchId) => {
        deleteMatch(matchId);
        setMatches(prev => prev.filter(m => m.id !== matchId));
        setSelectedMatch(null);
        setToast({ show: true, message: 'Match deleted successfully' });
    };

    const MatchSkeleton = () => (
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-lg shadow p-4 animate-pulse">
            <div className="flex justify-between items-center">
                <div className="space-y-2">
                    <Skeleton variant="text" className="w-48 h-5" />
                    <Skeleton variant="text" className="w-32 h-4" />
                </div>
                <Skeleton variant="text" className="w-24 h-4" />
            </div>
        </div>
    );

    const MatchDetails = ({ match }) => (
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-lg shadow-lg p-6 mb-4 animate-fade-in">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold text-green-800 dark:text-green-200">
                        {match.winner} def. {match.loser}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatMatchDate(match.date)}
                    </p>
                </div>
                <button
                    onClick={() => handleDeleteMatch(match.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors tactile focus:outline-none focus:ring-2 focus:ring-red-400 rounded-lg p-1"
                    aria-label="Delete match"
                >
                    🗑️
                </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-2">
                    <h4 className="font-medium text-green-700 dark:text-green-300">Score Summary</h4>
                    <div className="bg-green-50 dark:bg-gray-800 rounded-lg p-3">
                        <p className="text-gray-600 dark:text-gray-300">
                            Sets: {match.score.player1.sets}-{match.score.player2.sets}
                        </p>
                    </div>
                </div>
                
                {match.stats && (
                    <>
                        <div className="space-y-2">
                            <h4 className="font-medium text-green-700 dark:text-green-300">
                                {match.winner}'s Performance
                            </h4>
                            <div className="bg-green-50 dark:bg-gray-800 rounded-lg p-3">
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    Aces: {match.stats[match.winner === getUserName() ? 'player1' : 'player2'].aces}<br />
                                    Winners: {match.stats[match.winner === getUserName() ? 'player1' : 'player2'].winners}
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            <section>
                <h2 className="text-2xl font-bold text-green-900 dark:text-green-200 mb-4">Current Match</h2>
                <MatchTracker
                    player1Name={getUserName()}
                    player2Name="Opponent"
                    onMatchComplete={handleMatchComplete}
                />
            </section>

            <section>
                <h2 className="text-2xl font-bold text-green-900 dark:text-green-200 mb-4">Match History</h2>
                <div className="space-y-4">
                    {isLoading ? (
                        Array(3).fill(0).map((_, i) => <MatchSkeleton key={i} />)
                    ) : matches.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 dark:text-gray-400 bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-lg shadow-lg">
                            <span className="text-5xl mb-2" aria-hidden="true">🎾</span>
                            <p className="text-lg font-semibold mb-1">No matches played yet</p>
                            <p className="text-sm">Start your first match above and track your progress!</p>
                        </div>
                    ) : (
                        matches.map(match => (
                            <div key={match.id} className="transition-all duration-300">
                                <div
                                    onClick={() => setSelectedMatch(selectedMatch?.id === match.id ? null : match)}
                                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-lg shadow p-4 flex items-center justify-between animate-fade-in cursor-pointer hover:bg-green-50 dark:hover:bg-gray-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                    tabIndex={0}
                                    role="button"
                                    aria-expanded={selectedMatch?.id === match.id}
                                    aria-label={`View match details: ${match.winner} vs ${match.loser}`}
                                >
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="font-medium text-green-800 dark:text-green-200">
                                                {match.winner} won vs {match.loser}
                                            </span>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                                {formatMatchDate(match.date)}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-300">
                                            Sets: {match.score.player1.sets}-{match.score.player2.sets}
                                        </div>
                                    </div>
                                    <span className="text-gray-400 ml-2 transition-transform duration-300" style={{
                                        transform: selectedMatch?.id === match.id ? 'rotate(180deg)' : 'none'
                                    }}>
                                        ▼
                                    </span>
                                </div>
                                {selectedMatch?.id === match.id && <MatchDetails match={match} />}
                            </div>
                        ))
                    )}
                </div>
            </section>
            
            <Toast message={toast.message} show={toast.show} onClose={() => setToast({ show: false, message: '' })} />
        </div>
    );
};

export default Matches;