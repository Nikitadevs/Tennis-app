import React from 'react';
import { getUserName, getUserAvatar } from '../utils/userUtils';
import { getMatchHistory, getPlayerStats } from '../utils/matchUtils';

const Home = () => {
    const user = {
        avatar: getUserAvatar(),
        name: getUserName(),
    };

    const stats = getPlayerStats(user.name);
    const recentMatches = getMatchHistory().slice(0, 5);

    const motivationalQuotes = [
        "Every champion was once a contender that refused to give up.",
        "Success is no accident. It is hard work, perseverance, and love of what you are doing.",
        "The difference between a successful person and others is not a lack of strength, but a lack of will.",
        "You miss 100% of the shots you don't take.",
        "Champions keep playing until they get it right."
    ];
    const quote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

    const TrendIndicator = ({ value, threshold = 50 }) => (
        <span className={`ml-1 ${value >= threshold ? 'text-green-500' : 'text-yellow-500'}`}>
            {value >= threshold ? '↗' : '↘'}
        </span>
    );

    const StatBox = ({ label, value, trend, icon }) => (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 dark:text-gray-400">{label}</span>
                <span className="text-xl">{icon}</span>
            </div>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {value}
                {trend !== undefined && <TrendIndicator value={trend} />}
            </div>
        </div>
    );

    return (
        <div className="w-full max-w-xl mx-auto p-4 space-y-8 animate-fade-in">
            {/* Profile Summary */}
            <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl shadow-xl p-8 flex flex-col items-center gap-4">
                <img 
                    src={user.avatar} 
                    alt={user.name} 
                    className="w-24 h-24 rounded-full border-4 border-green-300 shadow mb-2 transition-transform duration-300 hover:scale-105" 
                />
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-green-900 dark:text-green-200">
                        Welcome back, {user.name}!
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Ready for your next match?
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mt-6">
                    <StatBox 
                        label="Win Rate" 
                        value={`${Math.round((stats.wins / stats.matches) * 100) || 0}%`}
                        trend={stats.winningPercentage}
                        icon="🏆"
                    />
                    <StatBox 
                        label="Matches" 
                        value={stats.matches}
                        icon="🎾"
                    />
                    <StatBox 
                        label="Total Aces" 
                        value={stats.totalAces}
                        icon="🎯"
                    />
                    <StatBox 
                        label="Winners" 
                        value={stats.totalWinners}
                        icon="💫"
                    />
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-4">
                    Recent Matches
                </h2>
                <div className="space-y-4">
                    {recentMatches.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center text-gray-500 dark:text-gray-400">
                            <span className="text-5xl mb-2" aria-hidden="true">🎾</span>
                            <p className="text-lg font-semibold mb-1">No matches yet</p>
                            <p className="text-sm">Start your tennis journey by playing your first match!</p>
                        </div>
                    ) : (
                        recentMatches.map(match => (
                            <div 
                                key={match.id}
                                className="flex items-center justify-between p-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-lg tactile shadow hover:shadow-lg transition-all duration-200 mb-2"
                                tabIndex={0}
                                role="button"
                                aria-label={`View match vs ${match.winner === user.name ? match.loser : match.winner}`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className={`text-xl ${
                                        match.winner === user.name 
                                            ? 'text-green-500' 
                                            : 'text-gray-400'
                                    }`}>
                                        {match.winner === user.name ? '🏆' : '●'}
                                    </span>
                                    <div>
                                        <div className="font-medium text-green-800 dark:text-green-200">
                                            vs {match.winner === user.name ? match.loser : match.winner}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {match.score.player1.sets}-{match.score.player2.sets} sets
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(match.date).toLocaleDateString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4 mt-2 sm:mt-0">
                <a 
                    href="/matches" 
                    className="bg-green-100 dark:bg-gray-800 rounded-xl p-6 text-center hover:bg-green-200 dark:hover:bg-gray-700 transition-colors cursor-pointer group focus:outline-none focus:ring-2 focus:ring-green-400 tactile shadow-md hover:shadow-xl"
                    tabIndex={0}
                    role="button"
                >
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2 group-hover:text-green-900 dark:group-hover:text-green-100">
                        New Match
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Start tracking a new game
                    </p>
                </a>
                <a 
                    href="/profile" 
                    className="bg-green-100 dark:bg-gray-800 rounded-xl p-6 text-center hover:bg-green-200 dark:hover:bg-gray-700 transition-colors cursor-pointer group focus:outline-none focus:ring-2 focus:ring-green-400 tactile shadow-md hover:shadow-xl"
                    tabIndex={0}
                    role="button"
                >
                    <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2 group-hover:text-green-900 dark:group-hover:text-green-100">
                        View Stats
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Check your detailed statistics
                    </p>
                </a>
            </div>

            {/* Motivational Quote */}
            <div className="mt-8 text-center animate-slide-fade-in">
                <p className="italic text-green-700 dark:text-green-300 text-lg animate-fade-in-slow">
                    "{quote}"
                </p>
            </div>
        </div>
    );
};

export default Home;