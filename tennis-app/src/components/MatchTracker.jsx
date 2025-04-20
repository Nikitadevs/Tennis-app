import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Toast from './Toast';
import Confetti from './Confetti';
import Skeleton from './Skeleton';
import Tooltip from './Tooltip';
import StatsChart from './StatsChart';
import ScoreBoard from './ScoreBoard';

const TENNIS_POINTS = ['0', '15', '30', '40', 'Ad'];

const MatchTracker = ({
    player1Name = 'Player 1',
    player2Name = 'Player 2',
    onMatchComplete
}) => {
    const [score, setScore] = useState({
        player1: { points: 0, games: 0, sets: 0, tiebreak: 0 },
        player2: { points: 0, games: 0, sets: 0, tiebreak: 0 }
    });
    const [stats, setStats] = useState({
        player1: { aces: 0, doubleFaults: 0, winners: 0 },
        player2: { aces: 0, doubleFaults: 0, winners: 0 }
    });
    const [isTiebreak, setIsTiebreak] = useState(false);
    const [winner, setWinner] = useState(null);
    const [toast, setToast] = useState({ show: false, message: '' });
    const [showConfetti, setShowConfetti] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

    useEffect(() => {
        // Simulate loading delay for better UX
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    const showToast = (message) => {
        setToast({ show: true, message });
        setTimeout(() => setToast({ show: false, message: '' }), 3000);
    };

    const handleStat = (player, statType) => {
        if (winner) return;
        setStats(prev => ({
            ...prev,
            [player]: {
                ...prev[player],
                [statType]: prev[player][statType] + 1
            }
        }));
        handlePoint(player);
    };

    const handlePoint = (player) => {
        if (winner) return;
        
        setScore(prev => {
            const newScore = { ...prev };
            const otherPlayer = player === 'player1' ? 'player2' : 'player1';
            
            if (isTiebreak) {
                newScore[player].tiebreak++;
                if (newScore[player].tiebreak >= 7 && 
                    (newScore[player].tiebreak - newScore[otherPlayer].tiebreak >= 2)) {
                    // Win tiebreak and set
                    newScore[player].games++;
                    newScore[player].sets++;
                    newScore[player].tiebreak = 0;
                    newScore[otherPlayer].tiebreak = 0;
                    setIsTiebreak(false);
                    
                    if (newScore[player].sets >= 2) {
                        handleMatchWin(player);
                    } else {
                        showToast(`${player === 'player1' ? player1Name : player2Name} wins the set!`);
                    }
                }
                return newScore;
            }

            // Regular game logic
            if (prev[player].points === 3 && prev[otherPlayer].points === 3) {
                newScore[player].points = 4; // Advantage
            } else if (prev[player].points === 4 && prev[otherPlayer].points === 4) {
                newScore[player].points = 3; // Back to deuce
                newScore[otherPlayer].points = 3;
            } else if (
                (prev[player].points === 3 && prev[otherPlayer].points < 3) ||
                (prev[player].points === 4 && prev[otherPlayer].points === 3)
            ) {
                // Win game
                newScore[player].points = 0;
                newScore[otherPlayer].points = 0;
                newScore[player].games += 1;

                // Check for tiebreak
                if (newScore[player].games === 6 && newScore[otherPlayer].games === 6) {
                    setIsTiebreak(true);
                    showToast('Tiebreak started!');
                    return newScore;
                }

                if (newScore[player].games >= 6 && 
                    (newScore[player].games - newScore[otherPlayer].games >= 2)) {
                    // Win set
                    newScore[player].games = 0;
                    newScore[otherPlayer].games = 0;
                    newScore[player].sets += 1;

                    if (newScore[player].sets >= 2) {
                        handleMatchWin(player);
                    } else {
                        showToast(`${player === 'player1' ? player1Name : player2Name} wins the set!`);
                    }
                } else {
                    showToast(`${player === 'player1' ? player1Name : player2Name} wins the game!`);
                }
            } else {
                newScore[player].points += 1;
            }
            
            return newScore;
        });
    };

    const handleMatchWin = (player) => {
        setWinner(player);
        setShowConfetti(true);
        showToast(`${player === 'player1' ? player1Name : player2Name} wins the match!`);
        if (onMatchComplete) {
            onMatchComplete({
                winner: player === 'player1' ? player1Name : player2Name,
                loser: player === 'player1' ? player2Name : player1Name,
                score,
                stats
            });
        }
    };

    const handleReset = () => {
        setScore({
            player1: { points: 0, games: 0, sets: 0, tiebreak: 0 },
            player2: { points: 0, games: 0, sets: 0, tiebreak: 0 }
        });
        setStats({
            player1: { aces: 0, doubleFaults: 0, winners: 0 },
            player2: { aces: 0, doubleFaults: 0, winners: 0 }
        });
        setIsTiebreak(false);
        setWinner(null);
        setShowConfetti(false);
    };

    const handleKeyDown = (e, player) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handlePoint(player);
        } else if (e.key === 'a' || e.key === 'A') {
            handleStat(player, 'aces');
        } else if (e.key === 'w' || e.key === 'W') {
            handleStat(player, 'winners');
        }
    };

    const getDisplayPoints = (playerPoints, playerTiebreak) => {
        if (isTiebreak) return playerTiebreak.toString();
        return TENNIS_POINTS[playerPoints] || '0';
    };

    const renderStatsChart = (player) => {
        const playerStats = stats[player];
        const data = [
            { label: 'Aces', value: playerStats.aces },
            { label: 'Winners', value: playerStats.winners }
        ];
        return (
            <div className="mt-4">
                <StatsChart data={data} height={80} />
            </div>
        );
    };

    const renderPlayerControls = (player, name) => (
        <div className="text-center flex-1">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">{name}</h3>
            <div className="space-x-4 text-green-700 dark:text-green-300">
                <Tooltip content="Sets won">
                    <span>{score[player].sets}</span>
                </Tooltip>
                <Tooltip content="Games won in current set">
                    <span>{score[player].games}</span>
                </Tooltip>
                <Tooltip content={isTiebreak ? "Tiebreak points" : "Current game points"}>
                    <span className="text-xl font-bold">
                        {getDisplayPoints(score[player].points, score[player].tiebreak)}
                    </span>
                </Tooltip>
            </div>
            <div className="flex gap-2 mt-4 justify-center">
                <Tooltip content="Record an ace serve (Press 'A')">
                    <button
                        onClick={() => handleStat(player, 'aces')}
                        onKeyDown={(e) => handleKeyDown(e, player)}
                        disabled={!!winner}
                        className="px-2 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50 hover:scale-105 active:scale-95 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
                        aria-label="Ace serve"
                    >
                        Ace
                    </button>
                </Tooltip>
                <Tooltip content="Add a point (Press Space/Enter)">
                    <button
                        onClick={() => handlePoint(player)}
                        onKeyDown={(e) => handleKeyDown(e, player)}
                        disabled={!!winner}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 hover:scale-105 active:scale-95 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
                        aria-label="Score point"
                    >
                        Point
                    </button>
                </Tooltip>
                <Tooltip content="Record a winning shot (Press 'W')">
                    <button
                        onClick={() => handleStat(player, 'winners')}
                        onKeyDown={(e) => handleKeyDown(e, player)}
                        disabled={!!winner}
                        className="px-2 py-1 bg-purple-500 text-white text-sm rounded hover:bg-purple-600 disabled:opacity-50 hover:scale-105 active:scale-95 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2"
                        aria-label="Winner shot"
                    >
                        Winner
                    </button>
                </Tooltip>
            </div>
            {renderStatsChart(player)}
        </div>
    );

    const renderKeyboardHelp = () => (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
             onClick={() => setShowKeyboardHelp(false)}>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md mx-4 animate-fade-in"
                 onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-4">Keyboard Shortcuts</h3>
                <div className="space-y-3">
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Add point</span>
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Space/Enter</kbd>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Record ace</span>
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">A</kbd>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-300">Record winner</span>
                        <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">W</kbd>
                    </div>
                </div>
                <button
                    className="mt-6 w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    onClick={() => setShowKeyboardHelp(false)}
                >
                    Got it
                </button>
            </div>
        </div>
    );

    if (isLoading) {
        return (
            <div className="w-full max-w-xl mx-auto bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl shadow-lg p-6 space-y-6">
                <div className="flex justify-between items-start">
                    <div className="flex-1 space-y-4">
                        <Skeleton variant="text" className="w-24 h-6" />
                        <Skeleton className="w-16 h-8" />
                        <Skeleton className="w-32 h-10" />
                    </div>
                    <div className="mx-4">
                        <Skeleton variant="text" className="w-8" />
                    </div>
                    <div className="flex-1 space-y-4">
                        <Skeleton variant="text" className="w-24 h-6" />
                        <Skeleton className="w-16 h-8" />
                        <Skeleton className="w-32 h-10" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-xl mx-auto bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-xl shadow-lg p-6 animate-fade-in hover-lift">
            {showConfetti && <Confetti />}
            
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-green-800 dark:text-green-200">Match Score</h2>
                <Tooltip content="View keyboard shortcuts">
                    <button
                        onClick={() => setShowKeyboardHelp(true)}
                        className="p-2 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-300 transition-colors"
                        aria-label="Show keyboard shortcuts"
                    >
                        ⌨️
                    </button>
                </Tooltip>
            </div>

            <ScoreBoard
                score={score}
                player1Name={player1Name}
                player2Name={player2Name}
            />

            <div className="flex justify-between items-start mb-6">
                {renderPlayerControls('player1', player1Name)}
                <div className="mx-4 text-xl font-bold text-gray-400 mt-8">VS</div>
                {renderPlayerControls('player2', player2Name)}
            </div>
            
            {isTiebreak && (
                <div className="text-center text-sm text-yellow-600 dark:text-yellow-400 mb-4">
                    Tiebreak in progress
                </div>
            )}
            
            {winner && (
                <div className="text-center mt-6">
                    <div className="text-xl font-bold text-green-600 dark:text-green-400 mb-4">
                        {winner === 'player1' ? player1Name : player2Name} wins!
                    </div>
                    <button
                        onClick={handleReset}
                        className="px-6 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
                    >
                        New Match
                    </button>
                </div>
            )}
            {showKeyboardHelp && renderKeyboardHelp()}
            <Toast message={toast.message} show={toast.show} onClose={() => setToast({ show: false, message: '' })} />
        </div>
    );
};

MatchTracker.propTypes = {
    player1Name: PropTypes.string,
    player2Name: PropTypes.string,
    onMatchComplete: PropTypes.func
};

export default MatchTracker;