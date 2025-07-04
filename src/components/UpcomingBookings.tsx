import React, { useState } from 'react';
import { Clock, Users, Trash2, Pencil } from 'lucide-react';
import { Booking } from '../pages/Index';
import { BookingDetailsModal } from './BookingDetailsModal';
import { useAuth } from './AuthProvider';

interface UpcomingBookingsProps {
  bookings: Booking[];
  onDeleteBooking: (id: string) => void;
  onEditBooking: (booking: Booking) => void;
}

export const UpcomingBookings = ({ bookings, onDeleteBooking, onEditBooking }: UpcomingBookingsProps) => {
  const { user } = useAuth();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const now = new Date();
  const currentDate = now.toISOString().split('T')[0];
  const currentTime = now.toTimeString().slice(0, 5);
  
  // Filter and sort upcoming bookings
  const upcomingBookings = bookings
    .filter(booking => {
      if (booking.date > currentDate) return true;
      if (booking.date === currentDate && booking.startTime > currentTime) return true;
      return false;
    })
    .sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date);
      return a.startTime.localeCompare(b.startTime);
    })
    .slice(0, 5);

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date().toDateString();
    const tomorrow = new Date(Date.now() + 86400000).toDateString();
    
    if (date.toDateString() === today) return 'Today';
    if (date.toDateString() === tomorrow) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      weekday: 'short'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Upcoming Bookings</h2>
      </div>
      
      <div className="divide-y">
        {upcomingBookings.length === 0 ? (
          <div className="p-6 text-center">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No upcoming bookings</p>
          </div>
        ) : (
          upcomingBookings.map((booking) => (
            <div
              key={booking.id}
              className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => setSelectedBooking(booking)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{booking.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        {formatDate(booking.date)} • {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>
                        {booking.organizer} • {booking.participants.length} participants
                      </span>
                    </div>
                  </div>
                  
                  {booking.participants.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-500 mb-1">Participants:</p>
                      <div className="flex flex-wrap gap-1">
                        {booking.participants.slice(0, 3).map((participant, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-xs rounded-md">
                            {participant}
                          </span>
                        ))}
                        {booking.participants.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-xs rounded-md">
                            +{booking.participants.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-end space-y-2">
                  {user && booking.user_id === user.id && (
                    <button
                      onClick={e => { e.stopPropagation(); onEditBooking(booking); }}
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit booking"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={e => { e.stopPropagation(); onDeleteBooking(booking.id); }}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Cancel booking"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      <BookingDetailsModal booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
    </div>
  );
};
