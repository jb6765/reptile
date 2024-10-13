from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow import keras
import cv2
import numpy as np
import os

app = Flask(__name__)
CORS(app)  # Enable CORS to allow requests from your frontend
UPLOAD_FOLDER = 'static/uploader/'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
SIZE = 24  # Change this according to your model's input size

# Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/')
def home():
    return "Flask API is running"

@app.route('/predict', methods=['POST'])  # Ensure 'POST' is included
def predict():
    if 'imagefile' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['imagefile']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # Save the uploaded file
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], '1.png')
    file.save(file_path)

    # Load the model
    model = keras.models.load_model(r'model\model1.h5')  # Update this path
    categories = ['Banded Racer', 'Checkered Keelback', 'Green Tree Vine',
                  'Common Rat Snake', 'Common Krait', 'King Cobra',
                  'Spectacled Cobra']

    # Process the image
    nimage = cv2.imread(file_path, cv2.IMREAD_GRAYSCALE)
    if nimage is None:
        return jsonify({'error': 'Image not found or could not be read'}), 400

    image = cv2.resize(nimage, (SIZE, SIZE))
    image = image / 255.0  # Normalize the image
    prediction = model.predict(np.array(image).reshape(-1, SIZE, SIZE, 1))
    predicted_class_index = np.argmax(prediction)
    predicted_class_label = categories[predicted_class_index]

    # Check venomous status
    venomous_classes = ['King Cobra', 'Spectacled Cobra', 'Common Krait']
    venomous_status = "Venomous" if predicted_class_label in venomous_classes else "Non-Venomous"

    # Return results as JSON
    return jsonify({
        'predicted_class': predicted_class_label,
        'venomous_status': venomous_status,
        'image_url': f"file://{os.path.join(app.config['UPLOAD_FOLDER'], file.filename)}"   # URL for the uploaded image
    })

if __name__ == "__main__":
    app.run(port=5000, debug=True)  # Ensure the server runs on port 5000
