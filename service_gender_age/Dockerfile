FROM tensorflow/tensorflow
RUN apt-get update -y
RUN apt-get install ffmpeg libsm6 libxext6  -y
WORKDIR /app
COPY . /app
COPY requirements.txt /app

RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt
EXPOSE 5000


# Switching to a non-root user, please refer to https://aka.ms/vscode-docker-python-user-rights
RUN useradd appuser && chown -R appuser /app
USER appuser

ENTRYPOINT [ "python" ]
CMD [ "app.py" ]