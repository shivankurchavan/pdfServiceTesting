import random
import csv

def generate_names(num_names):
    first_names = ["John", "Jane", "Michael", "Emily", "William", "Olivia", "James", "Sophia", "Alexander", "Isabella",
                   "Daniel", "Mia", "Matthew", "Charlotte", "David", "Amelia", "Joseph", "Ella", "Andrew", "Grace",
                   "Ryan", "Chloe", "Samuel", "Lucas", "Gabriel", "Benjamin", "Luke", "Ava", "Nathan", "Ethan",
                   "Jacob", "Emma", "Joshua", "Madison", "Christopher", "Abigail", "Isaac", "Aiden", "Dylan", "Liam",
                   "Logan", "Jackson", "Elijah", "Caleb", "Jayden", "Hannah", "Mason", "Elizabeth", "Evan", "Mason",
                   "Sophie", "Grace", "Zoe", "Avery", "Addison", "Lily", "Natalie", "Aria", "Aurora", "Ellie", "Leah",
                   "Willow", "Harper", "Scarlett", "Claire", "Anna", "Victoria", "Skylar", "Bella", "Naomi", "Maya",
                   "Aaliyah", "Savannah", "Audrey", "Julia", "Lydia", "Aubrey", "Peyton", "Stella", "Lucy", "Isabelle",
                   "Sophia", "Mila", "Gabriella", "Alice", "Katherine", "Alexa", "Eleanor", "Hazel", "Violet", "Lillian",
                   "Caroline", "Penelope", "Brooklyn", "Samantha", "Sadie", "Nora", "Ruby", "Eva", "Reagan", "Clara",
                   "Jasmine", "Elliana", "Gianna", "Quinn", "Delilah", "Josephine", "Isla", "Charlie", "Everly", "Emilia",
                   "Holly", "Emerson", "Elise", "Mackenzie", "Ivy", "Callie", "Elena", "Adeline", "Kinsley", "Miranda",
                   "Hayden", "Lyla", "Faith", "Summer", "Daisy", "Juliana", "Luna", "Emery", "Georgia", "River", "Tessa",
                   "Madeleine", "Lola", "Melanie", "Molly", "Sienna", "Nevaeh", "Eden", "Paige", "Anastasia", "Juliette",
                   "Lyric", "Annabelle", "Athena", "Rose", "Gabrielle", "Fiona", "Hope", "Brielle", "Jessica", "Amy",
                   "Zara", "Eliza", "Mariana", "Heidi", "Liliana", "Phoebe", "Harmony", "Jane", "Maggie", "Leilani",
                   "Joy", "Eloise", "Lena", "Annie", "Elaina", "Presley", "Nicole", "Diana", "Rosalie", "Genevieve",
                   "Zoey", "Layla", "Alana", "Keira", "Juliet", "Adelaide", "Nina", "Rylee", "Raegan", "Morgan",
                   "Makayla", "Piper", "Charlie", "Alyssa", "Reese", "Diana", "Myla", "Camilla", "Leia"]

    last_names = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor",
                  "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson",
                  "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "Hernandez", "King", "Wright",
                  "Lopez", "Hill", "Scott", "Green", "Adams", "Baker", "Gonzalez", "Nelson", "Carter", "Mitchell", "Perez",
                  "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards", "Collins", "Stewart", "Sanchez",
                  "Morris", "Rogers", "Reed", "Cook", "Morgan", "Bell", "Murphy", "Bailey", "Rivera", "Cooper", "Richardson",
                  "Cox", "Howard", "Ward", "Torres", "Peterson", "Gray", "Ramirez", "James", "Watson", "Brooks", "Kelly",
                  "Sanders", "Price", "Bennett", "Wood", "Barnes", "Ross", "Henderson", "Coleman", "Jenkins", "Perry", "Powell",
                  "Long", "Patterson", "Hughes", "Flores", "Washington", "Butler", "Simmons", "Foster", "Gonzales", "Bryant",
                  "Alexander", "Russell", "Griffin", "Diaz", "Hayes", "Myers", "Ford", "Hamilton", "Graham", "Sullivan", "Wallace",
                  "Woods", "Cole", "West", "Jordan", "Owens", "Reynolds", "Fisher", "Ellis", "Harrison", "Gibson", "Mcdonald",
                  "Cruz", "Marshall", "Ortiz", "Gomez", "Murray", "Freeman", "Wells", "Webb", "Simpson", "Stevens", "Tucker",
                  "Porter", "Hunter", "Hicks", "Crawford", "Henry", "Boyd", "Mason", "Morales", "Kennedy", "Warren", "Dixon",
                  "Ramos", "Reyes", "Burns", "Gordon", "Shaw", "Holmes", "Rice", "Robertson", "Hunt", "Black", "Daniels", "Palmer",
                  "Mills", "Nichols", "Grant", "Knight", "Ferguson", "Rose", "Stone", "Hawkins", "Dunn", "Perkins", "Hudson",
                  "Spencer", "Gardner", "Stephens", "Payne", "Pierce", "Berry", "Matthews", "Arnold", "Wagner", "Willis",
                  "Ray", "Watkins", "Olson", "Carroll", "Duncan", "Snyder", "Hart", "Cunningham", "Bradley", "Lane", "Andrews",
                  "Ruiz", "Harper", "Fox", "Riley", "Armstrong", "Carpenter", "Weaver", "Greene", "Lawrence", "Elliott", "Chavez",
                  "Sims", "Austin", "Peters", "Kelley", "Franklin", "Lawson"]

    # Generate a list of random names
    names = []
    for _ in range(num_names):
        first_name = random.choice(first_names)
        last_name = random.choice(last_names)
        full_name = f"{first_name} {last_name}"
        names.append(full_name)

    return names

def write_to_csv(names, filename):
    # Write the names list to a CSV file
    with open(filename, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(['student_name'])  # Write header
        for name in names:
            writer.writerow([name])

# Generate 200 random names
names_list = generate_names(1000)

# Write names to CSV file
write_to_csv(names_list, 'names.csv')

print("Generated 1000 names and saved them to names.csv.")
