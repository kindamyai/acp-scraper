import React from 'react'; interface 
AiDescriptionInputProps {
  aiDescription: string; setAiDescription: 
  (description: string) => void;
}
const AiDescriptionInput: 
React.FC<AiDescriptionInputProps> = ({
  aiDescription, setAiDescription
}) => {
  return ( <div className="my-6"> <label 
      className="block text-sm font-medium 
      text-gray-700 mb-2">
        Describe What Data You Want to 
        Extract
      </label> <textarea 
        value={aiDescription} onChange={(e) 
        => setAiDescription(e.target.value)} 
        rows={4} className="w-full px-3 py-2 
        text-gray-700 border rounded-lg 
        focus:outline-none focus:ring-2 
        focus:ring-primary-500" 
        placeholder="Describe in detail what 
        data you want to extract from the 
        page. For example: 'Extract all 
        product names, prices, and images 
        from the product listing page.'"
      ></textarea>
      <div className="mt-2 text-sm 
      text-gray-500">
        <p>Be as specific as possible about 
        what kind of data you want to 
        extract.</p> <p className="mt-1">Good 
        examples:</p> <ul 
        className="list-disc pl-5 mt-1 
        space-y-1">
          <li>"Extract all product titles, 
          prices, and image URLs from the 
          product cards"</li> <li>"Get the 
          table data with columns: Company, 
          Revenue, Employees, and Year 
          Founded"</li> <li>"Extract all 
          article headlines, publication 
          dates, and author names"</li>
        </ul> </div> </div> );
};
export default AiDescriptionInput;
