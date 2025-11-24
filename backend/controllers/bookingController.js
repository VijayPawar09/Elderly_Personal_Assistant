import Booking from '../models/Booking.js';
import Notification from '../models/Notification.js';

export const bookService = async (req, res) => {
  try {
    const { assistantId, serviceType, date } = req.body;
    const customerId = req.user._id;

    const booking = await Booking.create({
      customer: customerId,
      assistant: assistantId,
      serviceType,
      date
    });

    // Send notification to assistant
    await Notification.create({
      user: assistantId,
      message: `New service booking from a customer for ${serviceType} on ${new Date(date).toLocaleDateString()}`,
      link: `/assistant/bookings/${booking._id}`
    });

    res.status(201).json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
};
