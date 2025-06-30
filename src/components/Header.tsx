
import { Calendar, LogOut, User } from 'lucide-react';
import { useAuth } from './AuthProvider';

export const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10">
              <img 
                src="https://xcmhsneyivchstmkbbla.supabase.co/storage/v1/object/public/images//logo.png?w=40&h=40&fit=crop&crop=center" 
                alt="Advertomedia Logo" 
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Meeting Room Booking</h1>
              <p className="text-sm text-gray-600">Advertomedia Internal Platform</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {user.user_metadata?.full_name || user.email}
                  </p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-orange-600" />
                  </div>
                  <button
                    onClick={signOut}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
