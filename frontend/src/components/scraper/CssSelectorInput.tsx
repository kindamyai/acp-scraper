import React from 'react'; import Input from 
'../common/Input'; interface 
CssSelectorInputProps {
  cssSelector: string; setCssSelector: 
  (selector: string) => void;
}
const CssSelectorInput: 
React.FC<CssSelectorInputProps> = ({
  cssSelector, setCssSelector
}) => {
  return ( <div className="my-6"> <Input 
        label="CSS Selector" 
        placeholder=".product-card, 
        #main-content .item"
        value={cssSelector} onChange={(e) => 
        setCssSelector(e.target.value)}
      /> <div className="mt-2 text-sm 
      text-gray-500">
        <p>Enter a CSS selector to identify 
        the elements you want to extract.</p> 
        <p className="mt-1">Examples:</p> <ul 
        className="list-disc pl-5 mt-1 
        space-y-1">
          <li><code>.product-title</code> - 
          selects elements with class 
          "product-title"</li> 
          <li><code>#main-content</code> - 
          selects the element with ID 
          "main-content"</li> <li><code>table 
          tr</code> - selects all table 
          rows</li> <li><code>.products 
          .product:nth-child(1)</code> - 
          selects the first product</li>
        </ul> </div> </div> );
};
export default CssSelectorInput;
