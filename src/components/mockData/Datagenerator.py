from faker import Faker
import json

def generate_fake_users(num_users, num_admins):
    fake = Faker()
    users = []

    # Generate regular users
    for i in range(1, num_users + 1):
        user = {
            'id': i,
            'username': fake.user_name(),
            'password': f'user{i}pass',  # Generate a simple password based on user ID
            'email': fake.email(),
            'role': 'user',  # Assuming all generated users are regular users
            'fullName': fake.name(),
            'address1': fake.street_address(),
            'address2': fake.secondary_address(),
            'city': fake.city(),
            'state': fake.state_abbr(),
            'zipCode': fake.zipcode(),
            'skills': generate_skills(),
            'preferences': f'User {i} preferences',  # Example preferences
            'availability': generate_availability()
        }
        users.append(user)

    # Generate admin users
    for i in range(num_users + 1, num_users + num_admins + 1):
        admin = {
            'id': i,
            'username': fake.user_name(),
            'password': f'admin{i}pass',  # Generate a simple password for admin based on ID
            'email': fake.email(),
            'role': 'admin',  # Role set to 'admin' for admin users
            'fullName': fake.name(),
            'address1': fake.street_address(),
            'address2': fake.secondary_address(),
            'city': fake.city(),
            'state': fake.state_abbr(),
            'zipCode': fake.zipcode(),
            'skills': generate_skills(),
            'preferences': f'Admin {i} preferences',  # Example preferences
            'availability': generate_availability()
        }
        users.append(admin)

    return users

def generate_skills():
    fake = Faker()
    skills = [fake.word() for _ in range(fake.random_int(min=1, max=5))]  # Random number of skills per user
    return skills

def generate_availability():
    fake = Faker()
    availability = [fake.date_between(start_date='-1y', end_date='+1y').isoformat() for _ in range(fake.random_int(min=1, max=5))]  # Random number of dates
    return availability

def save_to_json(users, filename):
    with open(filename, 'w') as f:
        json.dump(users, f, indent=2)

if __name__ == '__main__':
    num_users = 4  # Number of regular users to generate
    num_admins = 1  # Number of admin users to generate
    fake_users = generate_fake_users(num_users, num_admins)
    save_to_json(fake_users, './src/components/mockData/fake_users.json')
    print(f'Generated {num_users} regular users and {num_admins} admin users, and saved to fake_users.json')
