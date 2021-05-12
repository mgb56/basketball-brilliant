# deepspeech --model deepspeech-0.9.3-models.pbmm --scorer deepspeech-0.9.3-models.scorer --lm_alpha 0.931289039105002 --lm_beta 1.1834137581510284 --audio ./audio/8455-210777-0068.wav 

import deepspeech
import wave
import numpy as np

model_file_path = '../models/deepspeech/deepspeech-0.9.3-models.pbmm'
model = deepspeech.Model(model_file_path)
model.enableExternalScorer("../models/deepspeech/deepspeech-0.9.3-models.scorer")

filename = '../audio/triple_double_isolated.wav'
w = wave.open(filename, 'r')
rate = w.getframerate()
frames = w.getnframes()
buffer = w.readframes(frames)

data16 = np.frombuffer(buffer, dtype=np.int16)
text = model.stt(data16)
print(text)