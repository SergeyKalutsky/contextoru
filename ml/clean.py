# pip install pymystem3
# pip install corus
# pip install tqdm
import os
import pickle
from corus import load_lenta
from functools import partial
from pymystem3 import Mystem
from multiprocessing import Manager
from tqdm.contrib.concurrent import process_map


def get_max_count():
    return len(os.listdir('data'))


def parse_sentence(sentence):
    data = []
    m = Mystem()
    analysises = m.analyze(sentence)
    new_sentense = []
    for analysis in analysises:
        if 'analysis' in analysis:
            if analysis['analysis']:
                gr = analysis['analysis'][0]['gr']
                part = gr.split('=')[0].split(',')[0]
                if part in ('A', 'S', 'V'):
                    new_sentense.append(analysis['analysis'][0]['lex'])
    data.append(new_sentense)
    return data


path = 'lenta-ru-news.csv.gz'
records = load_lenta(path)

if __name__ == '__main__':
    if not os.path.exists('data'):
        os.mkdir('data')
    max_count = get_max_count()
    i = 0
    while True:
        sentences = []
        for _ in range(10):
            record = next(records)
            if i <= max_count:
                i += 1
                continue
            sentences += [sentence.strip()
                          for sentence in record.text.replace('\xa0', ' ').split('.')]
        if i <= max_count:
            i += 1
            continue
        chunck = []
        for sentence in sentences:
            sentence = parse_sentence(sentence)
            print(sentence)
            chunck.append(sentence)
        with open(f'data/chunck_{i}.pickle', 'wb') as f:
            pickle.dump(chunck, f)
        i += 1
