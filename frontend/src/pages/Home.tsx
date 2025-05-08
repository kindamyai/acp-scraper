import { Link } from 'react-router-dom'; 
import { useAuthStore } from 
'../stores/authStore'; const Home = () => {
  const { user } = useAuthStore(); return ( 
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 
      sm:px-6 lg:px-8 py-16">
        <div className="text-center"> <h1 
          className="text-4xl font-extrabold 
          text-gray-900 sm:text-5xl 
          sm:tracking-tight lg:text-6xl">
            Extract Data from Any Website 
          </h1> <p className="mt-5 max-w-xl 
          mx-auto text-xl text-gray-500">
            Our powerful web scraper allows 
            you to easily extract data from 
            websites without coding.
          </p> <div className="mt-8 flex 
          justify-center">
            {user ? ( <Link to="/scraper/new" 
                className="btn btn-primary 
                px-8 py-3 text-base 
                font-medium"
              >
                Create New Scraper </Link> ) 
            : (
              <Link to="/register" 
                className="btn btn-primary 
                px-8 py-3 text-base 
                font-medium"
              >
                Get Started </Link> )} </div> 
        </div> <div className="mt-20">
          <h2 className="text-3xl 
          font-extrabold text-gray-900 
          text-center">
            Key Features </h2> <div 
          className="mt-12 grid gap-8 
          grid-cols-1 md:grid-cols-3">
            <div className="bg-gray-50 p-6 
            rounded-lg">
              <div 
              className="text-primary-600 
              mb-4">
                <svg className="h-8 w-8" 
                fill="currentColor" 
                viewBox="0 0 20 20" 
                xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" 
                  d="M10 18a8 8 0 100-16 8 8 
                  0 000 16zm1-11a1 1 0 10-2 
                  0v2H7a1 1 0 100 2h2v2a1 1 0 
                  102 0v-2h2a1 1 0 
                  100-2h-2V7z" 
                  clipRule="evenodd" />
                </svg> </div> <h3 
              className="text-lg font-medium 
              text-gray-900">Visual 
              Selection</h3> <p 
              className="mt-2 text-gray-600">
                Simply click on elements in 
                the page to select the data 
                you want to extract.
              </p> </div> <div 
            className="bg-gray-50 p-6 
            rounded-lg">
              <div 
              className="text-primary-600 
              mb-4">
                <svg className="h-8 w-8" 
                fill="currentColor" 
                viewBox="0 0 20 20" 
                xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" 
                  d="M14.243 5.757a6 6 0 
                  10-.986 9.284 1 1 0 111.087 
                  1.678A8 8 0 1118 10a3 3 0 
                  01-4.8 2.401A4 4 0 1114 
                  10a1 1 0 102 
                  0c0-1.537-.586-3.07-1.757-4.243zM12 
                  10a2 2 0 10-4 0 2 2 0 004 
                  0z" clipRule="evenodd" />
                </svg> </div> <h3 
              className="text-lg font-medium 
              text-gray-900">AI-Powered</h3> 
              <p className="mt-2 
              text-gray-600">
                Describe what data you need 
                in plain text, and let our AI 
                find it for you.
              </p> </div> <div 
            className="bg-gray-50 p-6 
            rounded-lg">
              <div 
              className="text-primary-600 
              mb-4">
                <svg className="h-8 w-8" 
                fill="currentColor" 
                viewBox="0 0 20 20" 
                xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" 
                  d="M3 17a1 1 0 011-1h12a1 1 
                  0 110 2H4a1 1 0 
                  01-1-1zm3.293-7.707a1 1 0 
                  011.414 0L9 10.586V3a1 1 0 
                  112 0v7.586l1.293-1.293a1 1 
                  0 111.414 1.414l-3 3a1 1 0 
                  01-1.414 0l-3-3a1 1 0 
                  010-1.414z" 
                  clipRule="evenodd" />
                </svg> </div> <h3 
              className="text-lg font-medium 
              text-gray-900">Multiple 
              Formats</h3> <p className="mt-2 
              text-gray-600">
                Export your data in CSV, 
                JSON, or directly to Google 
                Sheets.
              </p> </div> </div> </div> 
      </div>
    </div> );
};
export default Home;
