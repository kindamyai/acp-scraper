import React from 'react'; import { 
ExtractionMethod } from '../../types'; 
interface ExtractionMethodSelectorProps {
  selectedMethod: ExtractionMethod; 
  onSelectMethod: (method: ExtractionMethod) 
  => void;
}
const ExtractionMethodSelector: 
React.FC<ExtractionMethodSelectorProps> = ({
  selectedMethod, onSelectMethod
}) => {
  const methods = [ { id: 'visual', name: 
    'Visual Selector', description: 'Click on 
    elements in the page preview' }, { id: 
    'css', name: 'CSS Selector', description: 
    'Enter CSS selectors manually' }, { id: 
    'xpath', name: 'XPath', description: 'Use 
    XPath expressions for precise selection' 
    },
    { id: 'ai', name: 'AI-Powered', 
    description: 'Describe what data you need 
    in plain text' },
  ]; return ( <div className="my-6"> <label 
      className="block text-sm font-medium 
      text-gray-700 mb-2">
        Select Extraction Method </label> 
      <div className="grid grid-cols-1 
      md:grid-cols-2 lg:grid-cols-4 gap-4">
        {methods.map((method) => ( <div 
            key={method.id} onClick={() => 
            onSelectMethod(method.id as 
            ExtractionMethod)} 
            className={`p-4 rounded-lg 
            border-2 cursor-pointer 
            transition-all ${
              selectedMethod === method.id ? 
                'border-primary-500 
                bg-primary-50'
                : 'border-gray-200 
                : hover:border-gray-300'
            }`}
          >
            <h3 
            className="font-medium">{method.name}</h3> 
            <p className="text-sm 
            text-gray-500 
            mt-1">{method.description}</p>
          </div> ))} </div> </div> );
};
export default ExtractionMethodSelector;
