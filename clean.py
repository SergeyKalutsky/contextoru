import pickle
from pymystem3 import Mystem
from itertools import chain
from tqdm import tqdm


def parse_sentence(sentence):
    m = Mystem()
    analysises = m.analyze(sentence)
    new_sentence = []
    for analysis in analysises:
        if 'analysis' in analysis:
            gr = analysis['analysis'][0]['gr']
            part = gr.split('=')[0].split(',')[0]
            if part in ('A', 'S', 'V'):
                new_sentence.append(analysis['analysis'][0]['lex'])
    return new_sentence


with open('text.txt', 'r', encoding='utf-8') as f:
    data = f.readlines()

data = [sent.strip() for sent in chain(*[sentence.split('.') for sentence in data]) if sent not in ('', '\n')]
sentences = []
for sentence in tqdm(data[:]):
    sentences.append(parse_sentence(sentence))


with open('filename.pickle', 'wb') as handle:
    pickle.dump(sentences, handle)