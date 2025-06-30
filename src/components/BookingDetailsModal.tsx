import React from "react";
import { Booking } from "../pages/Index";
import { X } from "lucide-react";

interface BookingDetailsModalProps {
  booking: Booking | null;
  onClose: () => void;
}

export const BookingDetailsModal: React.FC<BookingDetailsModalProps> = ({ booking, onClose }) => {
  if (!booking) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Meeting Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-lg mb-1">{booking.title}</h3>
            <p className="text-sm text-gray-500 mb-2">{booking.status}</p>
            <p className="text-sm text-gray-700 mb-2">{booking.date} • {booking.startTime} - {booking.endTime}</p>
            <p className="text-sm text-gray-700 mb-2">Organizer: {booking.organizer}</p>
            <p className="text-sm text-gray-700 mb-2">Participants: {booking.participants.join(", ")}</p>
            {booking.description && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">Description:</p>
                <p className="text-sm text-gray-700 whitespace-pre-line">{booking.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
