import React, { useEffect, useState } from 'react';
import { getUserName, getUserAvatar } from '../utils/userUtils';
import { getMatchHistory } from '../utils/matchUtils';
import Skeleton from '../components/Skeleton';
import StatsChart from '../components/StatsChart';

const Profile = () => {
    const [stats, setStats] = useState({
        matches: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        lastMatch: null,
        aces: 0,
        winners: 0,
        lastFiveResults: Array(5).fill(0)
    });
    const [isLoading, setIsLoading] = useState(true);
    const [avatarFile, setAvatarFile] = useState(null);

    useEffect(() => {
        const loadStats = async () => {
            const matches = getMatchHistory();
            const userName = getUserName();
            const matchStats = matches.reduce((acc, match) => {
                acc.matches++;
                const isWinner = match.winner === userName;
                const playerStats = match.stats[isWinner ? 'player1' : 'player2'];

                if (isWinner) {
                    acc.wins++;
                } else {
                    acc.losses++;
                }

                acc.aces += playerStats?.aces || 0;
                acc.winners += playerStats?.winners || 0;

                return acc;
            }, { matches: 0, wins: 0, losses: 0, aces: 0, winners: 0 });

            matchStats.winRate = matchStats.matches > 0
                ? Math.round((matchStats.wins / matchStats.matches) * 100)
                : 0;

            matchStats.lastMatch = matches[0] || null;

            matches.slice(0, 5).forEach((match, index) => {
                if (match.winner === userName) {
                    matchStats.lastFiveResults[index] = 1;
                }
            });

            // Simulate network delay for better UX
            await new Promise(resolve => setTimeout(resolve, 1000));
            setStats(matchStats);
            setIsLoading(false);
        };

        loadStats();
    }, []);

    useEffect(() => {
        if (avatarFile) {
            const reader = new FileReader();
            reader.onload = e => {
                localStorage.setItem('customAvatar', e.target.result);
                setAvatarFile(null);
                setIsLoading(false);
            };
            reader.readAsDataURL(avatarFile);
        }
    }, [avatarFile]);

    const renderStatCard = (label, value, icon, animate) => {
        if (isLoading) {
            return (
                <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-xl p-4 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                        <Skeleton variant="text" className="w-20" />
                        <Skeleton variant="text" className="w-8" />
                    </div>
                    <Skeleton variant="text" className="w-16 h-8" />
                </div>
            );
        }

        return (
            <div className={`bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-xl p-4 shadow-lg hover:shadow-xl transition-shadow tactile hover-lift ${animate ? 'animate-fade-in' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</span>
                    <span className="text-xl">{icon}</span>
                </div>
                <div className="text-2xl font-bold text-green-700 dark:text-green-300">{value}</div>
            </div>
        );
    };

    const renderProfileSkeleton = () => (
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl p-8 text-center shadow-xl">
            <div className="relative inline-block">
                <Skeleton variant="circular" className="w-24 h-24 mx-auto mb-4" />
            </div>
            <Skeleton variant="text" className="w-32 h-6 mx-auto mb-2" />
            <Skeleton variant="text" className="w-24 h-4 mx-auto" />
        </div>
    );

    const renderPerformanceChart = () => {
        if (isLoading) {
            return <Skeleton className="h-40 w-full" />;
        }

        const performanceData = [
            { label: 'Matches', value: stats.matches },
            { label: 'Wins', value: stats.wins },
            { label: 'Losses', value: stats.losses },
            { label: 'Aces', value: stats.aces },
            { label: 'Winners', value: stats.winners }
        ];

        return (
            <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-xl p-6 shadow-lg animate-fade-in hover-lift">
                <h2 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-6">Performance Overview</h2>
                <StatsChart data={performanceData} className="mb-4" />
            </div>
        );
    };

    return (
        <div className="w-full max-w-2xl mx-auto animate-slide-fade-in space-y-8">
            {/* Profile Header */}
            {isLoading ? renderProfileSkeleton() : (
                <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-2xl p-8 text-center shadow-xl animate-fade-in hover-lift">
                    <div className="relative inline-block">
                        <img
                            src={localStorage.getItem('customAvatar') || getUserAvatar()}
                            alt={getUserName()}
                            className="w-24 h-24 rounded-full border-4 border-green-200 dark:border-green-800 shadow-lg mb-4 object-cover"
                        />
                        <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-green-500 hover:bg-green-600 text-white rounded-full p-2 cursor-pointer shadow-lg border-2 border-white dark:border-gray-800 transition-all" title="Upload avatar">
                            <input
                                id="avatar-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={e => {
                                    if (e.target.files && e.target.files[0]) {
                                        setIsLoading(true);
                                        setAvatarFile(e.target.files[0]);
                                    }
                                }}
                                aria-label="Upload avatar"
                            />
                            <span className="text-lg" aria-hidden="true">📷</span>
                        </label>
                        <div className="absolute bottom-4 right-0 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-bold">
                            {stats.winRate}%
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">
                        {getUserName()}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {stats.matches} matches played
                    </p>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {renderStatCard('Total Matches', stats.matches, '🎾', true)}
                {renderStatCard('Wins', stats.wins, '🏆', true)}
                {renderStatCard('Losses', stats.losses, '📉', true)}
                {renderStatCard('Win Rate', `${stats.winRate}%`, '📊', true)}
            </div>

            {/* Performance Chart */}
            {renderPerformanceChart()}

            {/* Recent Activity */}
            <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-xl p-6 shadow-lg animate-fade-in hover-lift">
                <h2 className="text-xl font-semibold text-green-800 dark:text-green-200 mb-4">Recent Activity</h2>
                {isLoading ? (
                    <div className="space-y-4">
                        <Skeleton variant="text" className="w-3/4" />
                        <Skeleton variant="text" className="w-1/2" />
                    </div>
                ) : stats.lastMatch ? (
                    <div className="text-gray-600 dark:text-gray-300">
                        <p className="mb-2">
                            Last match: {stats.lastMatch.winner === getUserName() ? 'Won' : 'Lost'} against{' '}
                            {stats.lastMatch.winner === getUserName() 
                                ? stats.lastMatch.loser 
                                : stats.lastMatch.winner}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Score: {stats.lastMatch.score.player1.sets}-{stats.lastMatch.score.player2.sets}
                        </p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-6 text-center text-gray-500 dark:text-gray-400">
                        <span className="text-4xl mb-2" aria-hidden="true">🎾</span>
                        <p className="text-base font-semibold mb-1">No matches played yet</p>
                        <p className="text-xs">Play your first match to see your stats!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;