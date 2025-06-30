
import { Clock, Users, CheckCircle } from 'lucide-react';
import { Booking } from '../pages/Index';

interface RoomStatusProps {
  bookings: Booking[];
}

export const RoomStatus = ({ bookings }: RoomStatusProps) => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().slice(0, 5);
  
  const todayBookings = bookings.filter(booking => booking.date === today);
  
  // Find current meeting
  const currentMeeting = todayBookings.find(booking => {
    return currentTime >= booking.startTime && currentTime <= booking.endTime;
  });
  
  // Find next meeting
  const nextMeeting = todayBookings
    .filter(booking => booking.startTime > currentTime)
    .sort((a, b) => a.startTime.localeCompare(b.startTime))[0];

  const isAvailable = !currentMeeting;
  
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      <div className={`p-6 ${isAvailable ? 'bg-green-50' : 'bg-red-50'}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Room Status</h2>
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            isAvailable 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {isAvailable ? 'Available' : 'Occupied'}
          </div>
        </div>
        
        {currentMeeting && (
          <div className="mb-4 p-3 bg-white rounded-lg border">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-900">Current Meeting</span>
            </div>
            <p className="font-semibold text-gray-900">{currentMeeting.title}</p>
            <p className="text-sm text-gray-600">
              {currentMeeting.startTime} - {currentMeeting.endTime}
            </p>
            <p className="text-sm text-gray-600">Organized by {currentMeeting.organizer}</p>
          </div>
        )}
        
        {nextMeeting && (
          <div className="p-3 bg-white rounded-lg border">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-900">Next Meeting</span>
            </div>
            <p className="font-semibold text-gray-900">{nextMeeting.title}</p>
            <p className="text-sm text-gray-600">
              {nextMeeting.startTime} - {nextMeeting.endTime}
            </p>
            <p className="text-sm text-gray-600">Organized by {nextMeeting.organizer}</p>
          </div>
        )}
        
        {!currentMeeting && !nextMeeting && (
          <div className="flex items-center space-x-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Room is free for the rest of the day</span>
          </div>
        )}
      </div>
      
      <div className="p-4 bg-gray-50 border-t">
        <p className="text-sm text-gray-600">
          <strong>{todayBookings.length}</strong> meetings scheduled today
        </p>
      </div>
    </div>
  );
};
