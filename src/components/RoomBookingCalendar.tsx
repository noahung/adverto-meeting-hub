import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Booking } from '../pages/Index';

interface RoomBookingCalendarProps {
  bookings: Booking[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  onBookingClick?: (booking: Booking) => void;
}

export const RoomBookingCalendar = ({ bookings, selectedDate, onDateSelect, onBookingClick }: RoomBookingCalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  function toLocalDateString(date: Date) {
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  }
  
  // Get bookings for selected date
  const selectedDateStr = toLocalDateString(selectedDate);
  const dayBookings = bookings.filter(booking => booking.date === selectedDateStr);
  
  // Create a map of dates that have bookings
  const bookingDates = new Set(bookings.map(booking => booking.date));
  
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Calendar</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-medium px-3">
              {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onDateSelect(date)}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          className="rounded-md border-0"
          modifiers={{
            hasBookings: (date) => bookingDates.has(toLocalDateString(date))
          }}
          modifiersStyles={{
            hasBookings: {
              backgroundColor: '#dbeafe',
              color: '#1e40af',
              fontWeight: 'bold'
            }
          }}
        />
      </div>
      
      {/* Day Schedule */}
      <div className="border-t p-6">
        <h3 className="font-semibold text-gray-900 mb-4">
          Schedule for {selectedDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </h3>
        
        {dayBookings.length === 0 ? (
          <p className="text-gray-500 text-sm">No meetings scheduled</p>
        ) : (
          <div className="space-y-3">
            {dayBookings
              .sort((a, b) => a.startTime.localeCompare(b.startTime))
              .map((booking) => (
                <div key={booking.id} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg cursor-pointer" onClick={() => onBookingClick && onBookingClick(booking)}>
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{booking.title}</p>
                    <p className="text-sm text-gray-600">
                      {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                    </p>
                    <p className="text-xs text-gray-500">{booking.organizer}</p>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
