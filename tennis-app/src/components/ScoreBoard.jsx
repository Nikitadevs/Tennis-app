import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from './Tooltip';

const ScoreBoard = ({ score, player1Name, player2Name }) => {
    return (
        <div className="bg-green-50 dark:bg-gray-800 rounded-lg p-4 mb-6 animate-fade-in hover:shadow-lg transition-shadow">
            <table className="w-full border-collapse">
                <thead>
                    <tr className="border-b border-green-200 dark:border-gray-700">
                        <th className="text-left p-2 text-gray-500 dark:text-gray-400">Player</th>
                        <th className="w-16 text-center p-2 text-gray-500 dark:text-gray-400">Sets</th>
                        <th className="w-16 text-center p-2 text-gray-500 dark:text-gray-400">Games</th>
                        <th className="w-16 text-center p-2 text-gray-500 dark:text-gray-400">Points</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="border-b border-green-100 dark:border-gray-700">
                        <td className="p-2 font-medium text-green-800 dark:text-green-200">{player1Name}</td>
                        <td className="text-center p-2">
                            <Tooltip content="Sets won">
                                <span className="font-bold text-green-700 dark:text-green-300">
                                    {score.player1.sets}
                                </span>
                            </Tooltip>
                        </td>
                        <td className="text-center p-2">
                            <Tooltip content="Games in current set">
                                <span className="font-bold text-green-700 dark:text-green-300">
                                    {score.player1.games}
                                </span>
                            </Tooltip>
                        </td>
                        <td className="text-center p-2">
                            <Tooltip content="Current game points">
                                <span className="font-bold text-green-700 dark:text-green-300">
                                    {score.player1.points}
                                </span>
                            </Tooltip>
                        </td>
                    </tr>
                    <tr>
                        <td className="p-2 font-medium text-green-800 dark:text-green-200">{player2Name}</td>
                        <td className="text-center p-2">
                            <Tooltip content="Sets won">
                                <span className="font-bold text-green-700 dark:text-green-300">
                                    {score.player2.sets}
                                </span>
                            </Tooltip>
                        </td>
                        <td className="text-center p-2">
                            <Tooltip content="Games in current set">
                                <span className="font-bold text-green-700 dark:text-green-300">
                                    {score.player2.games}
                                </span>
                            </Tooltip>
                        </td>
                        <td className="text-center p-2">
                            <Tooltip content="Current game points">
                                <span className="font-bold text-green-700 dark:text-green-300">
                                    {score.player2.points}
                                </span>
                            </Tooltip>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

ScoreBoard.propTypes = {
    score: PropTypes.shape({
        player1: PropTypes.shape({
            sets: PropTypes.number.isRequired,
            games: PropTypes.number.isRequired,
            points: PropTypes.number.isRequired
        }).isRequired,
        player2: PropTypes.shape({
            sets: PropTypes.number.isRequired,
            games: PropTypes.number.isRequired,
            points: PropTypes.number.isRequired
        }).isRequired
    }).isRequired,
    player1Name: PropTypes.string.isRequired,
    player2Name: PropTypes.string.isRequired
};

export default ScoreBoard;