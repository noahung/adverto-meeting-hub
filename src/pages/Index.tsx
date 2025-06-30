
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { RoomBookingCalendar } from '../components/RoomBookingCalendar';
import { BookingForm } from '../components/BookingForm';
import { UpcomingBookings } from '../components/UpcomingBookings';
import { RoomStatus } from '../components/RoomStatus';
import { useAuth } from '../components/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Booking {
  id: string;
  title: string;
  organizer: string;
  startTime: string;
  endTime: string;
  date: string;
  participants: string[];
  status: 'confirmed' | 'pending' | 'cancelled';
  user_id?: string;
}

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Redirect to auth if not authenticated
  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Load bookings from Supabase
  useEffect(() => {
    if (user) {
      loadBookings();
    }
  }, [user]);

  const loadBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) throw error;

      const formattedBookings: Booking[] = data.map((booking) => ({
        id: booking.id,
        title: booking.title,
        organizer: booking.organizer,
        startTime: booking.start_time,
        endTime: booking.end_time,
        date: booking.date,
        participants: booking.participants || [],
        status: booking.status as 'confirmed' | 'pending' | 'cancelled',
        user_id: booking.user_id
      }));

      setBookings(formattedBookings);
    } catch (error: any) {
      toast({
        title: "Error loading bookings",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleBookingSubmit = async (newBooking: Omit<Booking, 'id' | 'status'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          title: newBooking.title,
          organizer: newBooking.organizer,
          start_time: newBooking.startTime,
          end_time: newBooking.endTime,
          date: newBooking.date,
          participants: newBooking.participants,
          status: 'confirmed'
        })
        .select()
        .single();

      if (error) throw error;

      const formattedBooking: Booking = {
        id: data.id,
        title: data.title,
        organizer: data.organizer,
        startTime: data.start_time,
        endTime: data.end_time,
        date: data.date,
        participants: data.participants || [],
        status: data.status,
        user_id: data.user_id
      };

      setBookings([...bookings, formattedBooking]);
      setShowBookingForm(false);
      
      toast({
        title: "Booking created!",
        description: "Your meeting room has been successfully booked.",
      });
    } catch (error: any) {
      toast({
        title: "Error creating booking",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteBooking = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setBookings(bookings.filter(booking => booking.id !== id));
      
      toast({
        title: "Booking cancelled",
        description: "The booking has been successfully cancelled.",
      });
    } catch (error: any) {
      toast({
        title: "Error cancelling booking",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Show loading state
  if (loading || loadingBookings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!user) {
    return null;
  }

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
