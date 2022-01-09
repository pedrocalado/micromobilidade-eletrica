#!/usr/bin/env python
# coding: utf-8

# remove warning message
# get_ipython().run_line_magic('load_ext', 'autoreload')
# get_ipython().run_line_magic('autoreload', '2')
# import os

import matplotlib.pyplot as plt
import matplotlib.image as mpimage
import pandas as pd
import numpy as np
import seaborn as sns
import os
from PIL import Image, ImageOps
from sklearn.model_selection import train_test_split

from tensorflow import keras
from keras.models import Sequential
from keras.layers import Conv2D, MaxPooling2D, Activation, Dropout, Flatten, Dense
from keras import optimizers
from keras.preprocessing.image import ImageDataGenerator
from keras.preprocessing import image
import tensorflow as tf

from flask import Flask, request, redirect, url_for, flash, jsonify
from flasgger import Swagger
import flasgger
import glob


def process_and_predict(file):
#     im = Image.open(file)
#     width, height = im.size
#     if width == height:
#         im = im.resize((200,200), Image.ANTIALIAS)
#     else:
#         if width > height:
#             left = width/2 - height/2
#             right = width/2 + height/2
#             top = 0
#             bottom = height
#             im = im.crop((left,top,right,bottom))
#             im = im.resize((200,200), Image.ANTIALIAS)
#         else:
#             left = 0
#             right = width
#             top = 0
#             bottom = width
#             im = im.crop((left,top,right,bottom))
#             im = im.resize((200,200), Image.ANTIALIAS)
            
#     ar = np.asarray(im)
#     ar = ar.astype('float32')
#     ar /= 255.0
#     ar = ar.reshape(-1, 200, 200, 3)
    
#     age = agemodel.predict(ar)
#     gender = np.round(genmodel.predict(ar))

    # Retirado de função load_image

    img = image.load_img(file, target_size=(200,200))
    img_tensor = image.img_to_array(img)                    # (height, width, channels)
    img_tensor = np.expand_dims(img_tensor, axis=0)         # (1, height, width, channels), add a dimension because the model expects this shape: (batch_size, height, width, channels)
    img_tensor /= 255.                                      # imshow expects values in the range [0, 1]
    
    # print
    plt.imshow(img_tensor[0])
    plt.axis('off')
    plt.show()
    
    age = agemodel.predict(img_tensor)
    gender = np.round(genmodel.predict(img_tensor))
    if gender == 0:
        gender = 'Masculino'
    elif gender == 1:
        gender = 'Feminino'
        
    print('Idade:', int(age), '\n Genero:', gender)
    return jsonify({'age': int(age), 'gender': gender})
#     return im.resize((300,300), Image.ANTIALIAS)

# Carregar os modelos
genmodel = keras.models.load_model('models/genero_modelo.h5')
agemodel = keras.models.load_model('models/idade_modelo.h5')

# Definições / Webservice / Upload

UPLOAD_FOLDER = 'dev/'
ALLOWED_EXTENSIONS = set(['tif', 'png', 'jpg', 'jpeg', 'gif','undefined'])

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS

# Criar o servidor flask

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

swagger = Swagger(app)

# Rota do serviço

@app.route('/api/predict', methods=['POST'])
def predict():
    """Endpoint para reconhecimento de género e idade
    ---
    parameters:
      - name: image
        in: formData
        type: file
        required: true
        
    definitions:
      Predict:
        type: object
        properties:
          age:
            type: number
          gender:
            type: string
            
    responses:
      200:
        description: Resultado da previsão da imagem
        schema:
          $ref: '#/definitions/Predict'
    """
    # check if the post request has the file part
    if 'image' not in request.files:
        return jsonify({'error':'No posted image. Should be attribute named image.'}), 400
    file = request.files['image']

    if file.filename == '':
        return jsonify({'error':'Empty filename submitted.'}), 400
    if file and allowed_file(file.filename):
        filename = file.filename

        # Verificar se a pasta UPLOAD_FOLDER existe

        folderExists = os.path.exists(app.config['UPLOAD_FOLDER'])

        # Criar a pasta UPLOAD_FOLDER, se não existir

        if not folderExists:
            os.makedirs(app.config['UPLOAD_FOLDER'])
        
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
        
        # result = process_and_predict('thisperson4.jpg')
        
        # return result

        print(app.config['UPLOAD_FOLDER'] + file.filename)
        
        result = process_and_predict(app.config['UPLOAD_FOLDER'] + file.filename)
        # result = process_and_predict(img)
        
        return result
    else:
        return jsonify({'error':'File has invalid extension'}), 400


# Servir a API

if __name__ == '__main__':
    app.run(host= '0.0.0.0',port=9000)