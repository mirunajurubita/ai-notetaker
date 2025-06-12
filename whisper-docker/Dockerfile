FROM nvidia/cuda:11.7.1-runtime-ubuntu22.04

WORKDIR /usr/local/src/whisper.cpp

RUN apt-get update && apt-get install -y \
    build-essential cmake git wget python3 python3-pip ffmpeg \
    && rm -rf /var/lib/apt/lists/*

RUN git clone https://github.com/ggerganov/whisper.cpp.git .

RUN mkdir build && cd build && cmake .. && make

RUN pip3 install numpy

CMD ["sleep", "infinity"]
