import React, { useState } from 'react';
import { Mail, CreditCard, Gift, MessageSquare, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Scenario {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  steps: {
    content: string;
    isPhishing: boolean;
    explanation: string;
  }[];
}

const Scenarios: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showResult, setShowResult] = useState<boolean>(false);

  const scenarios: Scenario[] = [
    {
      id: 1,
      title: "The Urgent Email",
      description: "Learn how scammers try to trick you with fake urgent emails",
      icon: <Mail className="h-6 w-6 text-blue-400" />,
      steps: [
        {
          content: "You receive an email: 'URGENT: Your account will be locked! Click here to verify now!'",
          isPhishing: true,
          explanation: "Real companies don't use scary messages to make you act quickly. They give you time to think!"
        },
        {
          content: "The email address is 'security@bank-secure-verify.com' instead of your actual bank's domain",
          isPhishing: true,
          explanation: "Always check the email address! Real banks use their official domain names, not similar-looking ones."
        },
        {
          content: "The message has spelling mistakes: 'Dear Costumer' instead of 'Customer'",
          isPhishing: true,
          explanation: "Professional companies double-check their spelling. Mistakes are a big warning sign!"
        }
      ]
    },
    {
      id: 2,
      title: "The Free Gift Card",
      description: "See how scammers use fake prizes to steal information",
      icon: <Gift className="h-6 w-6 text-purple-400" />,
      steps: [
        {
          content: "You see a pop-up: 'Congratulations! You've won a $1000 gift card! Click to claim!'",
          isPhishing: true,
          explanation: "If it sounds too good to be true, it probably is! Real prizes don't pop up randomly."
        },
        {
          content: "They ask for your credit card to 'verify your identity' for a free prize",
          isPhishing: true,
          explanation: "A real free prize would never need your credit card information!"
        }
      ]
    },
    {
      id: 3,
      title: "The Payment Trap",
      description: "Discover how scammers try to steal your payment information",
      icon: <CreditCard className="h-6 w-6 text-green-400" />,
      steps: [
        {
          content: "You get a text: 'Your recent payment failed. Update payment info here'",
          isPhishing: true,
          explanation: "Real companies ask you to log into your account directly, not through text links."
        },
        {
          content: "The website looks like PayPal but the URL is 'paypal-secure-verify.com'",
          isPhishing: true,
          explanation: "Always check the website address! Scammers use similar-looking URLs to trick you."
        }
      ]
    },
    {
      id: 4,
      title: "The Chat Message",
      description: "Learn about scams that come through chat and social media",
      icon: <MessageSquare className="h-6 w-6 text-pink-400" />,
      steps: [
        {
          content: "A friend's account sends: 'Check out this funny video of you!'",
          isPhishing: true,
          explanation: "Scammers hack accounts to send fake messages. Always verify with your friend through another method!"
        },
        {
          content: "The link asks you to log in to watch the video",
          isPhishing: true,
          explanation: "Real video sites don't need your social media login to watch videos. This is a trick!"
        }
      ]
    }
  ];

  const handleScenarioSelect = (id: number) => {
    setSelectedScenario(id);
    setCurrentStep(0);
    setShowResult(false);
  };

  const handleNextStep = () => {
    if (!selectedScenario) return;
    
    const scenario = scenarios.find(s => s.id === selectedScenario);
    if (!scenario) return;
    
    if (currentStep < scenario.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
    }
  };

  const handleReset = () => {
    setSelectedScenario(null);
    setCurrentStep(0);
    setShowResult(false);
  };

  return (
    <section className="py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Learn Through Stories</h2>
        <p className="text-gray-300 mb-8">
          Explore these interactive scenarios to understand how phishing attacks work and how to stay safe!
        </p>

        {!selectedScenario ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scenarios.map((scenario) => (
              <button
                key={scenario.id}
                onClick={() => handleScenarioSelect(scenario.id)}
                className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-left hover:bg-gray-700/30 transition-colors duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-gray-700/50 rounded-lg">
                    {scenario.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{scenario.title}</h3>
                </div>
                <p className="text-gray-300">{scenario.description}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
            {showResult ? (
              <div className="text-center py-8">
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-green-900/30 rounded-full">
                    <CheckCircle2 className="h-12 w-12 text-green-400" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">Great job!</h3>
                <p className="text-gray-300 mb-6">
                  You've learned how to spot this type of phishing attack. Remember these tips to stay safe online!
                </p>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors duration-300"
                >
                  Try Another Scenario
                </button>
              </div>
            ) : (
              <>
                {selectedScenario && (
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-6">
                      {scenarios.find(s => s.id === selectedScenario)?.icon}
                      <h3 className="text-xl font-bold">
                        {scenarios.find(s => s.id === selectedScenario)?.title}
                      </h3>
                    </div>
                    
                    <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 mb-6">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <AlertTriangle className="h-5 w-5 text-amber-400" />
                        </div>
                        <p className="text-lg">
                          {scenarios.find(s => s.id === selectedScenario)?.steps[currentStep].content}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gray-700/30 border border-gray-600 rounded-lg p-6">
                      <h4 className="font-semibold mb-2">Why this is dangerous:</h4>
                      <p className="text-gray-300">
                        {scenarios.find(s => s.id === selectedScenario)?.steps[currentStep].explanation}
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    ← Back to Scenarios
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors duration-300"
                  >
                    {currentStep < (scenarios.find(s => s.id === selectedScenario)?.steps.length || 0) - 1 
                      ? 'Next Tip →' 
                      : 'Complete Scenario →'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Scenarios;