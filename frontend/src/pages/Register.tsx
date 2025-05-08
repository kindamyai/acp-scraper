import { useState } from 'react'; import { 
useNavigate, Link } from 'react-router-dom'; 
import { useAuthStore } from 
'../stores/authStore'; import Input from 
'../components/common/Input'; import Button 
from '../components/common/Button'; const 
Register = () => {
  const [username, setUsername] = 
  useState(''); const [email, setEmail] = 
  useState(''); const [password, setPassword] 
  = useState(''); const [confirmPassword, 
  setConfirmPassword] = useState(''); const 
  [error, setError] = useState(''); const 
  [isLoading, setIsLoading] = 
  useState(false);
  
  const { register } = useAuthStore(); const 
  navigate = useNavigate(); const 
  handleSubmit = async (e: React.FormEvent) 
  => {
    e.preventDefault(); setError('');
    
    if (password !== confirmPassword) { 
      setError('Passwords do not match'); 
      return;
    }
    
    setIsLoading(true);
    
    try { await register(username, email, 
      password); navigate('/dashboard');
    } catch (error) {
      setError(error instanceof Error ? 
      error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };
  return ( <div className="min-h-screen flex 
    items-center justify-center bg-gray-50 
    py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full 
      space-y-8">
        <div> <h2 className="mt-6 text-center 
          text-3xl font-extrabold 
          text-gray-900">
            Create a new account </h2> <p 
          className="mt-2 text-center text-sm 
          text-gray-600">
            Or{' '} <Link to="/login" 
            className="font-medium 
            text-primary-600 
            hover:text-primary-500">
              sign in to your existing 
              account
            </Link> </p> </div>
        
        {error && ( <div className="bg-red-50 
          border-l-4 border-red-500 p-4">
            <div className="flex"> <div 
              className="flex-shrink-0">
                <svg className="h-5 w-5 
                text-red-500" viewBox="0 0 20 
                20" fill="currentColor">
                  <path fillRule="evenodd" 
                  d="M18 10a8 8 0 11-16 0 8 8 
                  0 0116 0zm-7 4a1 1 0 11-2 0 
                  1 1 0 012 0zm-1-9a1 1 0 
                  00-1 1v4a1 1 0 102 0V6a1 1 
                  0 00-1-1z" 
                  clipRule="evenodd" />
                </svg> </div> <div 
              className="ml-3">
                <p className="text-sm 
                text-red-700">{error}</p>
              </div> </div> </div> )}
        
        <form className="mt-8 space-y-6" 
        onSubmit={handleSubmit}>
          <div className="rounded-md 
          shadow-sm -space-y-px">
            <Input label="Username" 
              id="username" name="username" 
              type="text" 
              autoComplete="username" 
              required value={username} 
              onChange={(e) => 
              setUsername(e.target.value)}
            /> <Input label="Email address" 
              id="email" name="email" 
              type="email" 
              autoComplete="email" required 
              value={email} onChange={(e) => 
              setEmail(e.target.value)}
            /> <Input label="Password" 
              id="password" name="password" 
              type="password" 
              autoComplete="new-password" 
              required value={password} 
              onChange={(e) => 
              setPassword(e.target.value)}
            /> <Input label="Confirm 
              Password" id="confirmPassword" 
              name="confirmPassword" 
              type="password" 
              autoComplete="new-password" 
              required 
              value={confirmPassword} 
              onChange={(e) => 
              setConfirmPassword(e.target.value)}
            /> </div> <div> <Button 
              type="submit" 
              isLoading={isLoading} 
              className="w-full py-2"
            >
              Create account </Button> </div> 
        </form>
      </div> </div> );
};
export default Register;
