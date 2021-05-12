from pocketsphinx import Pocketsphinx

config = {
    'hmm': "../pocketsphinx-python/pocketsphinx/model/en-us",
    'lm': "../pocketsphinx-python/pocketsphinx/model/en-us.lm.bin",
    'dict': "../pocketsphinx-python/pocketsphinx/model/cmudict-en-us.dict"
}

ps = Pocketsphinx()
ps.decode(
    audio_file="../audio/triple_double_isolated.wav",
    buffer_size=2048,
    no_search=False,
    full_utt=False
)

print(ps.segments())

print('Detailed segments:', *ps.segments(detailed=True), sep='\n')
