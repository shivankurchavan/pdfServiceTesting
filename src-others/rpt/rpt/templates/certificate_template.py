from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
import os

def generate_certificate(student_name, output_folder):
    # Create the output folder if it doesn't exist
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Define the output file path
    output_file = os.path.join(output_folder, f"{student_name.replace(' ', '_')}_certificate.pdf")

    # Create a canvas (PDF document) with specified page size (letter size)
    c = canvas.Canvas(output_file, pagesize=letter)

    # Set coordinates for the center of the page
    width, height = letter
    center_x = width / 2
    center_y = height / 2

    # Absolute path to the image file
    current_dir = os.path.dirname(__file__)
    logo_path = os.path.join(current_dir, "../images/logo.png")

    try:
        # Draw the image
        c.drawImage(logo_path, center_x - 179, center_y + 180, width=359, height=136)
    except Exception as e:
        print(f"Error loading image: {e}")

    # Set up text for the certificate
    title_text = "Certificate of Achievement"
    name_text = student_name
    date_text = "July 17, 2024"  # Example date, replace with actual issue date

    # Title
    c.setFont("Helvetica-Bold", 36)
    c.drawCentredString(center_x, center_y + 130, title_text)

    # Name
    c.setFont("Helvetica-Bold", 30)
    c.drawCentredString(center_x, center_y + 50, name_text)

    # Appreciation lines
    appreciation_text = [
        "This is to certify that",
        name_text,
        "has successfully completed the course."
    ]
    text_y = center_y - 70
    c.setFont("Helvetica", 20)
    for line in appreciation_text:
        c.drawCentredString(center_x, text_y, line)
        text_y -= 30

    # Footer
    c.setFont("Helvetica", 15)
    c.drawCentredString(center_x, center_y - 210, f"Issued on: {date_text}")

    # Save the canvas (PDF document)
    c.save()
