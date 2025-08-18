import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Trophy, Target, Users, Star, Zap, Circle } from 'lucide-react';

const GameRules = () => {
  const [activeFormat, setActiveFormat] = useState('T20');
  const [activeSport, setActiveSport] = useState('Cricket');
  const [expandedSections, setExpandedSections] = useState({});

  const sports = ['Cricket', 'Football'];
  const formats = ['T20', 'ODI', 'Test', 'T10'];

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const battingRules = {
    T20: [
      { rule: 'Runs', points: 1 },
      { rule: 'Four Bonus', points: 4 },
      { rule: 'Six Bonus', points: 6 },
      { rule: '25 Runs Bonus', points: 4 },
      { rule: '50 Runs Bonus', points: 8 },
      { rule: '75 Runs Bonus', points: 12 },
      { rule: '100 Runs Bonus', points: 16 },
      { rule: 'Dismissal for Duck (excluding bowlers)', points: -2 },
      { rule: 'Strike Rate (Min 10 balls)', points: 'Variable' }
    ],
    ODI: [
      { rule: 'Runs', points: 1 },
      { rule: 'Four Bonus', points: 4 },
      { rule: 'Six Bonus', points: 6 },
      { rule: '50 Runs Bonus', points: 8 },
      { rule: '100 Runs Bonus', points: 16 },
      { rule: 'Dismissal for Duck (excluding bowlers)', points: -2 },
      { rule: 'Strike Rate (Min 20 balls)', points: 'Variable' }
    ],
    Test: [
      { rule: 'Runs', points: 1 },
      { rule: 'Four Bonus', points: 4 },
      { rule: 'Six Bonus', points: 6 },
      { rule: '50 Runs Bonus', points: 8 },
      { rule: '100 Runs Bonus', points: 16 },
      { rule: 'Dismissal for Duck (excluding bowlers)', points: -4 }
    ],
    T10: [
      { rule: 'Runs', points: 1 },
      { rule: 'Four Bonus', points: 4 },
      { rule: 'Six Bonus', points: 6 },
      { rule: '25 Runs Bonus', points: 4 },
      { rule: '50 Runs Bonus', points: 8 },
      { rule: 'Dismissal for Duck (excluding bowlers)', points: -2 }
    ]
  };

  const bowlingRules = {
    T20: [
      { rule: 'Wickets', points: 25 },
      { rule: 'LBW/Bowled Bonus', points: 8 },
      { rule: '3 Wicket Bonus', points: 4 },
      { rule: '4 Wicket Bonus', points: 8 },
      { rule: '5+ Wicket Bonus', points: 16 },
      { rule: 'Maiden Over', points: 12 },
      { rule: 'Economy Rate (Min 2 overs)', points: 'Variable' }
    ],
    ODI: [
      { rule: 'Wickets', points: 25 },
      { rule: 'LBW/Bowled Bonus', points: 8 },
      { rule: '3 Wicket Bonus', points: 4 },
      { rule: '4 Wicket Bonus', points: 8 },
      { rule: '5+ Wicket Bonus', points: 16 },
      { rule: 'Maiden Over', points: 12 },
      { rule: 'Economy Rate (Min 5 overs)', points: 'Variable' }
    ],
    Test: [
      { rule: 'Wickets', points: 16 },
      { rule: 'LBW/Bowled Bonus', points: 8 },
      { rule: '5+ Wicket Bonus (Innings)', points: 8 },
      { rule: '10+ Wicket Bonus (Match)', points: 16 },
      { rule: 'Maiden Over', points: 4 }
    ],
    T10: [
      { rule: 'Wickets', points: 25 },
      { rule: 'LBW/Bowled Bonus', points: 8 },
      { rule: '2 Wicket Bonus', points: 4 },
      { rule: '3+ Wicket Bonus', points: 8 },
      { rule: 'Maiden Over', points: 16 }
    ]
  };

  const fieldingRules = [
    { rule: 'Catch', points: 8 },
    { rule: 'Stumping', points: 12 },
    { rule: 'Run Out (Direct Hit)', points: 12 },
    { rule: 'Run Out (Indirect)', points: 6 }
  ];

  const othersRules = [
    { rule: 'Playing XI', points: 4 },
    { rule: 'Captain', points: '2x points' },
    { rule: 'Vice Captain', points: '1.5x points' }
  ];

  return (
    <>
      {/* Schema markup for Game Rules page */}
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Game Rules - MySeries11",
            "description": "Learn how to play fantasy cricket on MySeries11. Complete guide to scoring points, batting rules, bowling rules, fielding points, and captain selection for T20, ODI, Test, and T10 formats.",
            "url": "https://myseries11.com/game-rules",
            "mainEntity": {
              "@type": "HowTo", 
              "name": "How to Play Fantasy Cricket on MySeries11",
              "description": "Complete guide to fantasy cricket scoring system and game rules",
              "step": [
                {
                  "@type": "HowToStep",
                  "name": "Understanding Batting Points",
                  "text": "Players earn points for runs, boundaries, milestones like 50s and 100s, with bonus points for strike rate performance"
                },
                {
                  "@type": "HowToStep", 
                  "name": "Understanding Bowling Points",
                  "text": "Bowlers earn points for wickets, bowling figures like 3-wicket hauls, maiden overs, and economy rate bonuses"
                },
                {
                  "@type": "HowToStep",
                  "name": "Understanding Fielding Points", 
                  "text": "Players earn points for catches, run-outs, and stumpings during the match"
                },
                {
                  "@type": "HowToStep",
                  "name": "Captain and Vice-Captain Selection",
                  "text": "Choose captain (2x points) and vice-captain (1.5x points) to maximize your fantasy team score"
                }
              ]
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://myseries11.com/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Game Rules",
                  "item": "https://myseries11.com/game-rules"
                }
              ]
            }
          })
        }}
      />
      
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 via-slate-900 to-black py-6 px-6 shadow-xl">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                <Trophy className="w-6 h-6 text-yellow-300" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-wide">FANTASY POINTS SYSTEM</h1>
            </div>
            <p className="text-gray-300">Complete guide to scoring points</p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Sport Selection */}
        <div className="flex justify-center">
          <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
            <div className="flex space-x-4">
              {sports.map((sport) => (
                <button
                  key={sport}
                  onClick={() => setActiveSport(sport)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${
                    activeSport === sport
                      ? 'bg-red-100 text-red-600 border border-red-200'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activeSport === sport ? 'bg-red-500' : 'bg-gray-400'
                  }`}>
                    {sport === 'Cricket' ? (
                      <Zap className="w-4 h-4 text-white" />
                    ) : (
                      <Circle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className="font-semibold">{sport}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Format Selection */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex space-x-2 overflow-x-auto">
            {formats.map((format) => (
              <button
                key={format}
                onClick={() => setActiveFormat(format)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                  activeFormat === format
                    ? 'bg-red-100 text-red-600 border border-red-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {format}
              </button>
            ))}
          </div>
        </div>

        {/* Batting Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => toggleSection('batting')}
            className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-gray-100 p-2 rounded-lg">
                <Target className="w-5 h-5 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Batting</h3>
            </div>
            {expandedSections.batting ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          
          {expandedSections.batting && (
            <div className="px-5 pb-4 border-t border-gray-100">
              <div className="space-y-3 pt-4">
                {battingRules[activeFormat]?.map((rule, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <span className="text-gray-700">{rule.rule}</span>
                    <span className={`font-bold ${
                      typeof rule.points === 'number' 
                        ? rule.points > 0 ? 'text-green-600' : 'text-red-600'
                        : 'text-blue-600'
                    }`}>
                      {typeof rule.points === 'number' && rule.points > 0 ? '+' : ''}{rule.points}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bowling Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => toggleSection('bowling')}
            className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-gray-100 p-2 rounded-lg">
                <div className="w-5 h-5 rounded-full border-2 border-gray-600"></div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Bowling</h3>
            </div>
            {expandedSections.bowling ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          
          {expandedSections.bowling && (
            <div className="px-5 pb-4 border-t border-gray-100">
              <div className="space-y-3 pt-4">
                {bowlingRules[activeFormat]?.map((rule, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <span className="text-gray-700">{rule.rule}</span>
                    <span className={`font-bold ${
                      typeof rule.points === 'number' 
                        ? rule.points > 0 ? 'text-green-600' : 'text-red-600'
                        : 'text-blue-600'
                    }`}>
                      {typeof rule.points === 'number' && rule.points > 0 ? '+' : ''}{rule.points}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Fielding Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => toggleSection('fielding')}
            className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-gray-100 p-2 rounded-lg">
                <Users className="w-5 h-5 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Fielding</h3>
            </div>
            {expandedSections.fielding ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          
          {expandedSections.fielding && (
            <div className="px-5 pb-4 border-t border-gray-100">
              <div className="space-y-3 pt-4">
                {fieldingRules.map((rule, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <span className="text-gray-700">{rule.rule}</span>
                    <span className="font-bold text-green-600">+{rule.points}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Others Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <button
            onClick={() => toggleSection('others')}
            className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="bg-gray-100 p-2 rounded-lg">
                <Star className="w-5 h-5 text-gray-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800">Others</h3>
            </div>
            {expandedSections.others ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>
          
          {expandedSections.others && (
            <div className="px-5 pb-4 border-t border-gray-100">
              <div className="space-y-3 pt-4">
                {othersRules.map((rule, index) => (
                  <div key={index} className="flex justify-between items-center py-2">
                    <span className="text-gray-700">{rule.rule}</span>
                    <span className="font-bold text-green-600">+{rule.points}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Points to Remember */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="font-semibold text-yellow-800 mb-3">Points to Remember:</h4>
          <ul className="text-sm text-yellow-700 space-y-2">
            <li>• Points are updated in real-time during matches</li>
            <li>• Captain gets 2x points, Vice Captain gets 1.5x points</li>
            <li>• Strike Rate and Economy Rate bonuses vary based on performance</li>
            <li>• All players in playing XI get 4 points automatically</li>
            <li>• Negative points are awarded for poor performance</li>
          </ul>
        </div>

        {/* Bottom padding for navigation */}
        <div className="h-20"></div>
      </div>
      </div>
    </>
  );
};

export default GameRules;
