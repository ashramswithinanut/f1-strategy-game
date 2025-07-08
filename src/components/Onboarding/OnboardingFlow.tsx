import React, { useState } from 'react';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "🏁 WELCOME TO THE SEASON FINALE",
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-6xl mb-4">🏎️</div>
            <h2 className="text-2xl font-bold text-volley-yellow mb-2">
              British Grand Prix
            </h2>
            <p className="text-f1-silver">
              The final race of the season - everything is on the line!
            </p>
          </div>
          
          <div className="bg-f1-red/20 border border-f1-red/50 rounded p-4">
            <div className="text-f1-red font-bold mb-2">🚨 SEASON FINALE PRESSURE</div>
            <p className="text-f1-silver text-sm">
              This is it! The last race of the championship season. Every point matters,
              every decision counts. The pressure is maximum and the stakes couldn't be higher.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "🏆 CHAMPIONSHIP STANDINGS",
      content: (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">🥇</div>
            <h2 className="text-xl font-bold text-volley-yellow">
              Scuderia Volley in P1!
            </h2>
          </div>
          
          <div className="bg-volley-yellow/20 border border-volley-yellow/50 rounded p-4">
            <div className="text-volley-yellow font-bold mb-3">📊 CONSTRUCTOR STANDINGS</div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-volley-yellow rounded-full"></div>
                  <span className="font-bold">1. Scuderia Volley</span>
                </div>
                <span className="text-volley-yellow font-bold">387 pts</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-600 rounded-full"></div>
                  <span>2. Storm Racing</span>
                </div>
                <span className="text-f1-silver">372 pts</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                  <span>3. Valkyrie GP</span>
                </div>
                <span className="text-f1-silver">359 pts</span>
              </div>
            </div>
          </div>
          
          <div className="bg-f1-yellow/20 border border-f1-yellow/50 rounded p-3">
            <div className="text-f1-yellow font-bold text-sm mb-1">⚠️ TIGHT CHAMPIONSHIP</div>
            <p className="text-f1-silver text-xs">
              Only 15 points separate you from Storm Racing! A bad race could cost you the championship.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "🏃‍♂️ DRIVER CHAMPIONSHIP BATTLE",
      content: (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">🥊</div>
            <h2 className="text-xl font-bold text-volley-yellow">
              Internal Team Battle
            </h2>
          </div>
          
          <div className="bg-volley-yellow/20 border border-volley-yellow/50 rounded p-4">
            <div className="text-volley-yellow font-bold mb-3">👥 YOUR DRIVERS</div>
            <div className="space-y-3">
              <div className="bg-black/30 rounded p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-2xl">🏁</div>
                  <div>
                    <div className="font-bold text-f1-silver">Marco Rossi</div>
                    <div className="text-xs text-f1-silver/70">Veteran Driver</div>
                  </div>
                </div>
                <p className="text-xs text-f1-silver">
                  Former champion with something to prove. Expensive but experienced.
                  Knows how to handle pressure in crucial moments.
                </p>
              </div>
              
              <div className="bg-black/30 rounded p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-2xl">⚡</div>
                  <div>
                    <div className="font-bold text-f1-silver">Alex Thunder</div>
                    <div className="text-xs text-f1-silver/70">Young Talent</div>
                  </div>
                </div>
                <p className="text-xs text-f1-silver">
                  Rising star with incredible speed but can crack under pressure.
                  Ambitious and eager to prove himself.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-f1-blue/20 border border-f1-blue/50 rounded p-3">
            <div className="text-f1-blue font-bold text-sm mb-1">🎯 DRIVER DYNAMICS</div>
            <p className="text-f1-silver text-xs">
              Your drivers are competing against each other for the individual championship too!
              Managing team orders will be crucial.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "🎯 YOUR MISSION",
      content: (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">🎯</div>
            <h2 className="text-xl font-bold text-volley-yellow">
              Race Objectives
            </h2>
          </div>
          
          <div className="bg-f1-green/20 border border-f1-green/50 rounded p-4">
            <div className="text-f1-green font-bold mb-3">✅ RACE GOALS</div>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="text-f1-green">🏆</div>
                <div>
                  <div className="font-bold text-sm">Get at least one driver on the podium</div>
                  <div className="text-xs text-f1-silver/70">Top 3 finish essential for championship points</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="text-f1-green">🔟</div>
                <div>
                  <div className="font-bold text-sm">Both drivers must finish in top 10</div>
                  <div className="text-xs text-f1-silver/70">Every point matters in this tight championship</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-f1-red/20 border border-f1-red/50 rounded p-4">
            <div className="text-f1-red font-bold mb-2">⚠️ FAIL CONDITIONS</div>
            <p className="text-f1-silver text-sm">
              If you fail to meet these objectives, you risk losing the constructor's championship
              to Storm Racing. Don't let the team down!
            </p>
          </div>
        </div>
      )
    },
    {
      title: "🎤 VOICE COMMANDS",
      content: (
        <div className="space-y-4">
          <div className="text-center mb-4">
            <div className="text-4xl mb-2">🎤</div>
            <h2 className="text-xl font-bold text-volley-yellow">
              You Are The Team Principal
            </h2>
          </div>
          
          <div className="bg-f1-blue/20 border border-f1-blue/50 rounded p-4">
            <div className="text-f1-blue font-bold mb-3">📻 VOICE COMMANDS</div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <div className="font-bold text-f1-silver mb-1">Pit Commands:</div>
                <ul className="text-xs text-f1-silver/70 space-y-1">
                  <li>• "Box driver 1"</li>
                  <li>• "Pit both drivers"</li>
                  <li>• "Box for mediums"</li>
                </ul>
              </div>
              
              <div>
                <div className="font-bold text-f1-silver mb-1">Race Commands:</div>
                <ul className="text-xs text-f1-silver/70 space-y-1">
                  <li>• "Push push push"</li>
                  <li>• "Conserve fuel"</li>
                  <li>• "Swap positions"</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-volley-yellow/20 border border-volley-yellow/50 rounded p-3">
            <div className="text-volley-yellow font-bold text-sm mb-1">💡 PRO TIP</div>
            <p className="text-f1-silver text-xs">
              Watch your drivers' morale! Happy drivers perform better, but pushing too hard
              can backfire. Balance is key to championship success.
            </p>
          </div>
        </div>
      )
    }
  ];

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-pit-wall to-track-green border border-f1-silver/30 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="text-xs text-f1-silver">Step {currentStep + 1} of {steps.length}</div>
            <div className="text-xs text-f1-silver">Season Finale Briefing</div>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-volley-yellow h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-volley-yellow mb-4 text-center">
            {steps[currentStep].title}
          </h1>
          <div className="text-f1-silver">
            {steps[currentStep].content}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="racing-button secondary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Back
          </button>
          
          <div className="flex gap-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentStep ? 'bg-volley-yellow' : 
                  index < currentStep ? 'bg-f1-green' : 'bg-gray-600'
                }`}
              />
            ))}
          </div>
          
          <button
            onClick={nextStep}
            className="racing-button primary px-4 py-2"
          >
            {currentStep === steps.length - 1 ? 'Start Race!' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow; 