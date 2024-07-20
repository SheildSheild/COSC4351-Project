import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import events from '../mockData/fake_event.json';
import dayjs from 'dayjs';
import './userEvents.css';
import skillMapping from '../mockData/skillmapping.json'; // Import skill mapping

const UserEventPage = () => {
  const [value, setValue] = useState(new Date());
  const [userEvents, setUserEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableEvents, setAvailableEvents] = useState([]);
  const user = JSON.parse(localStorage.getItem('loggedInUser'));

  useEffect(() => {
    if (user) {
      fetch('http://localhost:3000/api/events/all')
        .then(response => response.json())
        .then(events => {
          const filteredEvents = events.filter(event =>
            user.skills.some(skill => event.requiredSkills.includes(skill))
          );
          setUserEvents(filteredEvents);
        })
        .catch(error => console.error('Error fetching events:', error));
    }
  }, [user]);

  const onDateChange = (date) => {
    setValue(date);
    setSelectedDate(date);
    const userAvailableEvents = events.filter(event =>
      user.skills.some(skill => event.requiredSkills.includes(skill)) &&
      dayjs(event.date).isSame(date, 'day')
    );
    setAvailableEvents(userAvailableEvents);
  };

  const onEventClick = async (event) => {
    const matchedEvent = userEvents.find(e => e.id === event.id);
    if (matchedEvent) {
      const isInAvailability = user.availability.some(range => {
        const [start, end] = range.split(' - ');
        return dayjs(matchedEvent.date).isAfter(start) && dayjs(matchedEvent.date).isBefore(end);
      });

      if (!isInAvailability) {
        if (!window.confirm('This event is outside your availability. Are you sure you want to sign up?')) {
          return;
        }
      }

      const updatedUser = { ...user };
      if (!updatedUser.acceptedEvents) {
        updatedUser.acceptedEvents = [];
      }
      const currentTime = dayjs().format('MM-DD-YYYY HH');
      updatedUser.acceptedEvents.push({
        eventId: matchedEvent.id, signUpTime: currentTime
      });

      try {
        const response = await fetch(`http://localhost:3000/api/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            userId: user.id,
            eventId: matchedEvent.id,
          }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok: ' + response.statusText);
        }

        const data = await response.json();
        console.log('Sign-up successful:', data);

        localStorage.setItem('loggedInUser', JSON.stringify(updatedUser));

        const notifications = JSON.parse(localStorage.getItem('notifications')) || [];
        notifications.push({message: `${user.fullName} has signed up for the ${matchedEvent.name} job. | ${currentTime}`});
        localStorage.setItem('notifications', JSON.stringify(notifications));

        alert(`You have successfully signed up for ${matchedEvent.name}!`);
        setUserEvents(userEvents.map(e => e.id === matchedEvent.id ? { ...e, signedUp: true } : e));
      } catch (error) {
        console.error('Error signing up for event:', error);
        alert('There was an error signing up for the event. Please try again.');
      }
    }
  };

  const getSkillName = (skillId) => {
    return skillMapping[skillId] || 'Unknown skill';
  };

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const event = userEvents.find(e => e.date === dayjs(date).format('YYYY-MM-DD'));
      const signedUpEvent = user.acceptedEvents?.find(e => e.eventId === event?.id);

      if (event) {
        return (
          <div className={`event ${signedUpEvent ? 'signed-up' : ''}`}>
            <span>{event.name}</span>
            {signedUpEvent && <span className="signed-up-indicator">{'✔'}</span>}
          </div>
        );
      }
    }
  };

  return (
    <div className="user-event-page">
      <br />
      <br />
      <br />
      <br />
      <div className="calendar-container">
        <Calendar
          onChange={onDateChange}
          value={value}
          tileContent={tileContent}
          onClickDay={onEventClick}
        />
      </div>
      {selectedDate && availableEvents.length > 0 && (
        <div className="events-list">
          <h3>Events on {dayjs(selectedDate).format('MMMM D, YYYY')}</h3>
          <ul>
            {availableEvents.map(event => {
              const isSignedUp = user.acceptedEvents?.some(e => e.eventId === event.id);
              return (
                <li key={event.id}>
                  <strong>{event.name}</strong> - {event.description}
                  <br />
                  <span className="location">Location: {event.location}</span>
                  <br />
                  <span className="skills">Skills Required: {event.requiredSkills.map(getSkillName).join(', ')}</span>
                  <br />
                  <span className="urgency">Urgency: {event.urgency.name}</span>
                  <br />
                  {!isSignedUp && <button onClick={() => onEventClick(event)}>Sign Up</button>}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserEventPage;
