import { Link, useNavigate } from 
'react-router-dom'; import { useAuthStore } 
from '../../stores/authStore'; const Header = 
() => {
  const { user, logout } = useAuthStore(); 
  const navigate = useNavigate(); const 
  handleLogout = () => {
    logout(); navigate('/');
  };
  return ( <header className="bg-white 
    shadow">
      <div className="max-w-7xl mx-auto px-4 
      sm:px-6 lg:px-8">
        <div className="flex justify-between 
        h-16">
          <div className="flex"> <div 
            className="flex-shrink-0 flex 
            items-center">
              <Link to="/" className="text-xl 
              font-bold text-primary-600">
                Web Scraper </Link> </div> 
            <nav className="ml-6 flex 
            space-x-8">
              <Link to="/" 
                className="inline-flex 
                items-center px-1 pt-1 
                border-b-2 border-transparent 
                text-sm font-medium 
                text-gray-500 
                hover:text-gray-700 
                hover:border-gray-300"
              >
                Home </Link> {user && ( <> 
                  <Link
                    to="/dashboard" 
                    className="inline-flex 
                    items-center px-1 pt-1 
                    border-b-2 
                    border-transparent 
                    text-sm font-medium 
                    text-gray-500 
                    hover:text-gray-700 
                    hover:border-gray-300"
                  >
                    Dashboard </Link> <Link 
                    to="/scraper/new" 
                    className="inline-flex 
                    items-center px-1 pt-1 
                    border-b-2 
                    border-transparent 
                    text-sm font-medium 
                    text-gray-500 
                    hover:text-gray-700 
                    hover:border-gray-300"
                  >
                    New Scraper </Link> </> 
              )}
            </nav> </div> <div 
          className="flex items-center">
            {user ? ( <div className="flex 
              items-center space-x-4">
                <span className="text-sm 
                text-gray-700">
                  Hello, {user.username} 
                </span> <button
                  onClick={handleLogout} 
                  className="btn 
                  btn-secondary text-sm"
                >
                  Logout </button> </div> ) : 
            (
              <div className="flex 
              items-center space-x-4">
                <Link to="/login" 
                className="btn btn-secondary 
                text-sm">
                  Login </Link> <Link 
                to="/register" className="btn 
                btn-primary text-sm">
                  Register </Link> </div> )} 
          </div>
        </div> </div> </header> );
};
export default Header;
