
import { useState } from 'react';
import { Header } from '../components/Header';
import { RoomBookingCalendar } from '../components/RoomBookingCalendar';
import { BookingForm } from '../components/BookingForm';
import { UpcomingBookings } from '../components/UpcomingBookings';
import { RoomStatus } from '../components/RoomStatus';

export interface Booking {
  id: string;
  title: string;
  organizer: string;
  startTime: string;
  endTime: string;
  date: string;
  participants: string[];
  status: 'confirmed' | 'pending' | 'cancelled';
}

const Index = () => {
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      title: 'Marketing Strategy Meeting',
      organizer: 'Sarah Johnson',
      startTime: '09:00',
      endTime: '10:30',
      date: new Date().toISOString().split('T')[0],
      participants: ['John Doe', 'Jane Smith', 'Mike Wilson'],
      status: 'confirmed'
    },
    {
      id: '2',
      title: 'Client Presentation',
      organizer: 'David Brown',
      startTime: '14:00',
      endTime: '15:00',
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      participants: ['Emily Davis', 'Tom Anderson'],
      status: 'confirmed'
    }
  ]);

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showBookingForm, setShowBookingForm] = useState(false);

  const handleBookingSubmit = (newBooking: Omit<Booking, 'id' | 'status'>) => {
    const booking: Booking = {
      ...newBooking,
      id: Math.random().toString(36).substr(2, 9),
      status: 'confirmed'
    };
    setBookings([...bookings, booking]);
    setShowBookingForm(false);
  };

  const handleDeleteBooking = (id: string) => {
    setBookings(bookings.filter(booking => booking.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Room Status & Quick Actions */}
          <div className="lg:col-span-1 space-y-6">
            <RoomStatus bookings={bookings} />
            
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => setShowBookingForm(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200"
                >
                  Book Meeting Room
                </button>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors duration-200">
                  View Team Calendars
                  <span className="block text-xs text-gray-500 mt-1">Google Calendar integration coming soon</span>
                </button>
              </div>
            </div>
          </div>

          {/* Middle Column - Calendar */}
          <div className="lg:col-span-1">
            <RoomBookingCalendar
              bookings={bookings}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          </div>

          {/* Right Column - Upcoming Bookings */}
          <div className="lg:col-span-1">
            <UpcomingBookings
              bookings={bookings}
              onDeleteBooking={handleDeleteBooking}
            />
          </div>
        </div>
      </main>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <BookingForm
          selectedDate={selectedDate}
          existingBookings={bookings}
          onSubmit={handleBookingSubmit}
          onClose={() => setShowBookingForm(false)}
        />
      )}
    </div>
  );
};

export default Index;
