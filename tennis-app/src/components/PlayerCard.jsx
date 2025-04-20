import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from './Tooltip';

const PlayerCard = React.memo(({ player }) => {
    const StatItem = ({ label, value, tooltip }) => (
        <Tooltip content={tooltip}>
            <div className="flex-1 group hover:transform hover:scale-105 transition-transform">
                <div className="text-lg font-semibold text-green-700 dark:text-green-300 group-hover:text-green-600 dark:group-hover:text-green-200 transition-colors">
                    {value}
                </div>
                <div className="text-xs text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                    {label}
                </div>
            </div>
        </Tooltip>
    );

    return (
        <div className="player-card w-full max-w-xs mx-auto bg-white/70 dark:bg-gray-900/70 backdrop-blur-md rounded-xl shadow-lg p-6 flex flex-col items-center border border-green-100 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:-translate-y-1" 
            aria-label={`Player card for ${player.name}`}
        > 
            <Tooltip content="Player Avatar" position="top">
                <img
                    src={player.avatar}
                    alt={player.name}
                    className="w-24 h-24 rounded-full border-4 border-green-200 dark:border-green-800 mb-4 object-cover shadow-lg hover:border-green-300 dark:hover:border-green-700 transition-colors"
                />
            </Tooltip>
            <h2 className="text-xl font-bold text-green-800 dark:text-green-200 mb-1 hover:text-green-700 dark:hover:text-green-100 transition-colors">
                {player.name}
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {player.country} • Rank #{player.rank}
            </div>
            <div className="flex w-full justify-between mt-2 text-center space-x-4">
                <StatItem 
                    label="Matches" 
                    value={player.matches} 
                    tooltip={`Total matches played: ${player.matches}`}
                />
                <StatItem 
                    label="Wins" 
                    value={player.wins} 
                    tooltip={`Total wins: ${player.wins}`}
                />
                <StatItem 
                    label="Losses" 
                    value={player.losses} 
                    tooltip={`Total losses: ${player.losses}`}
                />
            </div>
            <div className="mt-4 w-full bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                <Tooltip content={`Win rate: ${Math.round((player.wins / player.matches) * 100)}%`}>
                    <div 
                        className="bg-green-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(player.wins / player.matches) * 100}%` }}
                    />
                </Tooltip>
            </div>
        </div>
    );
});

PlayerCard.propTypes = {
    player: PropTypes.shape({
        avatar: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        rank: PropTypes.number.isRequired,
        country: PropTypes.string.isRequired,
        matches: PropTypes.number.isRequired,
        wins: PropTypes.number.isRequired,
        losses: PropTypes.number.isRequired,
    }).isRequired,
};

PlayerCard.displayName = 'PlayerCard';

export default PlayerCard;