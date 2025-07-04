import { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { Booking } from '../pages/Index';

interface BookingFormProps {
  selectedDate: Date;
  existingBookings: Booking[];
  onSubmit: (booking: Omit<Booking, 'id' | 'status'>) => void;
  onClose: () => void;
  initialBooking?: Booking;
}

function toLocalDateString(date: Date) {
  const pad = (n: number) => n.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export const BookingForm = ({ selectedDate, existingBookings, onSubmit, onClose, initialBooking }: BookingFormProps) => {
  const [title, setTitle] = useState(initialBooking ? initialBooking.title : '');
  const [organizer, setOrganizer] = useState(initialBooking ? initialBooking.organizer : '');
  const [startTime, setStartTime] = useState(initialBooking ? initialBooking.startTime : '09:00');
  const [endTime, setEndTime] = useState(initialBooking ? initialBooking.endTime : '10:00');
  const [participants, setParticipants] = useState<string[]>(initialBooking ? initialBooking.participants : ['']);
  const [date, setDate] = useState(initialBooking ? initialBooking.date : toLocalDateString(selectedDate));
  const [description, setDescription] = useState(initialBooking ? initialBooking.description || '' : '');

  const dayBookings = existingBookings.filter(booking => booking.date === date);

  const addParticipant = () => {
    setParticipants([...participants, '']);
  };

  const removeParticipant = (index: number) => {
    setParticipants(participants.filter((_, i) => i !== index));
  };

  const updateParticipant = (index: number, value: string) => {
    const updated = [...participants];
    updated[index] = value;
    setParticipants(updated);
  };

  const isTimeSlotConflicted = (start: string, end: string) => {
    return dayBookings.some(booking => {
      return (start < booking.endTime && end > booking.startTime);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isTimeSlotConflicted(startTime, endTime)) {
      alert('This time slot conflicts with an existing booking. Please choose a different time.');
      return;
    }

    onSubmit({
      title,
      organizer,
      startTime,
      endTime,
      date,
      participants: participants.filter(p => p.trim() !== ''),
      description
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">{initialBooking ? 'Edit Booking' : 'Book Meeting Room'}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meeting Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter meeting title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Organizer *
            </label>
            <input
              type="text"
              value={organizer}
              onChange={(e) => setOrganizer(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Your name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time *
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time *
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          {isTimeSlotConflicted(startTime, endTime) && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">
                ⚠️ This time slot conflicts with an existing booking. Please choose a different time.
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Participants
            </label>
            <div className="space-y-2">
              {participants.map((participant, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={participant}
                    onChange={(e) => updateParticipant(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Participant name"
                  />
                  {participants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeParticipant(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addParticipant}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add participant</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter meeting description (optional)"
              rows={3}
            />
          </div>

          {/* Existing bookings for the day */}
          {dayBookings.length > 0 && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900 mb-2">Existing bookings for this day:</p>
              <div className="space-y-1">
                {dayBookings.map((booking) => (
                  <p key={booking.id} className="text-xs text-blue-700">
                    {booking.startTime} - {booking.endTime}: {booking.title}
                  </p>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isTimeSlotConflicted(startTime, endTime)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Book Room
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
