import React, { useState, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';

const DidYouKnow: React.FC = () => {
  const [currentFactIndex, setCurrentFactIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const facts = [
    "Over 90% of data breaches start with a phishing attack.",
    "Phishing attempts increased by 220% during the COVID-19 pandemic.",
    "The average cost of a phishing attack for a mid-sized company is $1.6 million.",
    "The term 'phishing' originated in the 1990s among hackers stealing AOL accounts.",
    "Mobile users are 3x more likely to fall for phishing scams than desktop users.",
    "Financial institutions are the most impersonated industry in phishing attempts.",
    "More than 97% of users cannot identify a sophisticated phishing email.",
    "Phishers are increasingly using AI to create more convincing fake emails.",
    "The average phishing site is online for less than 24 hours to avoid detection.",
    "Over 75% of targeted phishing attacks start with an email."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      
      setTimeout(() => {
        setCurrentFactIndex((prevIndex) => 
          prevIndex === facts.length - 1 ? 0 : prevIndex + 1
        );
        setIsVisible(true);
      }, 500);
    }, 8000);

    return () => clearInterval(interval);
  }, [facts.length]);

  return (
    <div className="bg-gray-800/60 backdrop-blur-sm border border-gray-700 rounded-xl p-6">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <Lightbulb className="h-5 w-5 text-amber-400 mr-2" />
        Did You Know?
      </h3>
      <div className="h-24 flex items-center justify-center">
        <p 
          className={`text-gray-300 text-center transition-all duration-500 ${
            isVisible ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-4'
          }`}
        >
          {facts[currentFactIndex]}
        </p>
      </div>
      <div className="flex justify-center mt-4">
        {facts.map((_, index) => (
          <div 
            key={index}
            className={`h-1.5 w-8 mx-1 rounded-full transition-colors duration-300 ${
              index === currentFactIndex ? 'bg-amber-400' : 'bg-gray-600'
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default DidYouKnow;