import React from 'react'; import Input from 
'../common/Input'; interface UrlInputProps {
  url: string; setUrl: (url: string) => void; 
  validateUrl: () => boolean;
}
const UrlInput: React.FC<UrlInputProps> = ({ 
url, setUrl, validateUrl }) => {
  return ( <div className="mb-6"> <Input 
        label="Website URL" 
        placeholder="www.example.com" 
        value={url} onChange={(e) => 
        setUrl(e.target.value)} 
        onBlur={validateUrl}
      /> <p className="mt-2 text-sm 
      text-gray-500">
        Enter the full URL of the website you 
        want to scrape data from
      </p> <div className="mt-2"> <button 
          onClick={() => 
          window.open(`https://${url.replace(/^https?:\/\//, 
          '')}`, '_blank')} 
          className="inline-flex items-center 
          text-sm text-primary-600 
          hover:text-primary-500"
        >
          <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 mr-1" viewBox="0 
          0 20 20" fill="currentColor">
            <path d="M11 3a1 1 0 100 
            2h2.586l-6.293 6.293a1 1 0 
            101.414 1.414L15 6.414V9a1 1 0 
            102 0V4a1 1 0 00-1-1h-5z" /> 
            <path d="M5 5a2 2 0 00-2 2v8a2 2 
            0 002 2h8a2 2 0 002-2v-3a1 1 0 
            10-2 0v3H5V7h3a1 1 0 000-2H5z" />
          </svg> Visit website </button> 
      </div>
    </div> );
};
export default UrlInput;
