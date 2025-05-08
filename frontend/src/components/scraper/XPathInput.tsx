import React from 'react'; import Input from 
'../common/Input'; interface XPathInputProps 
{
  xpathExpression: string; 
  setXpathExpression: (xpath: string) => 
  void;
}
const XPathInput: React.FC<XPathInputProps> = 
({
  xpathExpression, setXpathExpression
}) => {
  return ( <div className="my-6"> <Input 
        label="XPath Expression" 
        placeholder="//div[@class='product']/h2" 
        value={xpathExpression} onChange={(e) 
        => 
        setXpathExpression(e.target.value)}
      /> <div className="mt-2 text-sm 
      text-gray-500">
        <p>Enter an XPath expression to 
        identify the elements you want to 
        extract.</p> <p 
        className="mt-1">Examples:</p> <ul 
        className="list-disc pl-5 mt-1 
        space-y-1">
          <li><code>//div[@class='product']</code> 
          - selects all div elements with 
          class "product"</li> 
          <li><code>//table//tr</code> - 
          selects all table rows</li> 
          <li><code>//h1[@id='title']/text()</code> 
          - selects the text content of h1 
          with ID "title"</li> 
          <li><code>//a[@href]</code> - 
          selects all links with href 
          attribute</li>
        </ul> </div> </div> );
};
export default XPathInput;
