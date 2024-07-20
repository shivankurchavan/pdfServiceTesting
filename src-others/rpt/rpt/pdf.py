import csv
from templates.certificate_template import generate_certificate
import os
import time

def generate_bulk_certificates(csv_file, output_folder):
    # Open and read the CSV file
    with open(csv_file, 'r') as file:
        reader = csv.DictReader(file)

        # Track start time
        start_time = time.time()

        # Iterate over each row (each student) in the CSV file
        for row in reader:
            student_name = row['student_name'].strip()  # Assuming the column header is 'student_name'
            generate_certificate(student_name, output_folder)

        # Calculate elapsed time
        elapsed_time = time.time() - start_time
        print(f"Generated {reader.line_num - 1} certificates in {elapsed_time:.2f} seconds.")

# Example usage
if __name__ == "__main__":
    csv_file = 'names.csv'
    output_folder = 'certificates'
    generate_bulk_certificates(csv_file, output_folder)
