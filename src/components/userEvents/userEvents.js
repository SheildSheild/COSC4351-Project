import React, { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './userEvents.css';
import eventsData from '/Users/mahiralam/COSC4353-Project-2/src/components/mockData/fake_event.json';

const localizer = momentLocalizer(moment);

const UserEventPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Transform events data to match the calendar's expected format
    const transformedEvents = eventsData.map(event => ({
      title: event.name,
      start: new Date(event.date),
      end: new Date(event.date),
      allDay: true,
      description: event.description,
      location: event.location,
      urgency: event.urgency.name,
      participants: event.participants,
    }));
    setEvents(transformedEvents);
  }, []);

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3174ad';
    if (event.urgency === 'High') backgroundColor = '#d9534f';
    if (event.urgency === 'Medium') backgroundColor = '#f0ad4e';
    return {
      style: {
        backgroundColor,
        borderRadius: '0px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  return (
    <div className="user-event-page">
      <h2>User Event Page</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={(event) => alert(`Event: ${event.title}\nDescription: ${event.description}\nLocation: ${event.location}\nUrgency: ${event.urgency}\nParticipants: ${event.participants.join(', ')}`)}
      />
    </div>
  );
};

export default UserEventPage;
