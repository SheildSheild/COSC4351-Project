import json
import random
from faker import Faker

fake = Faker()

# Assuming you have this function from your previous request
def save_to_json(data, filename):
    with open(filename, 'w') as f:
        json.dump(data, f, indent=2)

def generate_fake_events(num_events, urgency_levels):
    fake_events = []
    
    for i in range(1, num_events + 1):
        event = {
            "id": i,
            "name": f"Event {i}",
            "description": f"Event {i} description",
            "location": fake.address(),
            "date": fake.date_between(start_date="today", end_date="+1y").isoformat(),
            "urgency": random.choice(urgency_levels)
        }
        fake_events.append(event)
    
    return fake_events

# Define urgency levels
urgency_levels = [
    {"id": 1, "name": "Low"},
    {"id": 2, "name": "Medium"},
    {"id": 3, "name": "High"}
]

# Generate 10 fake events
fake_events = generate_fake_events(10, urgency_levels)

# Save the generated events to a JSON file
save_to_json(fake_events, './src/components/mockData/fake_event.json')
