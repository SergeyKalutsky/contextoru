import os
import pickle
from corus import load_lenta
from functools import partial
from pymystem3 import Mystem
from multiprocessing import Manager
from tqdm.contrib.concurrent import process_map


def get_max_count():
    return len(os.listdir('data'))


def parse_sentence(shared_list, sentence):
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
    shared_list.append(new_sentense)
    return shared_list


path = 'lenta-ru-news.csv.gz'
records = load_lenta(path)

if __name__ == '__main__':
    max_count = get_max_count()
    manager = Manager()
    i = 0
    while True:
        print(i)
        sentences = []
        for _ in range(10):
            record = next(records)
            if i <= max_count:
                continue
            sentences += [sentence.strip()
                          for sentence in record.text.replace('\xa0', ' ').split('.')]
        if i <= max_count:
            i += 1
            continue

        shared_list = manager.list()
        r = process_map(partial(parse_sentence, shared_list), sentences, max_workers=8, chunksize=1)
        with open(f'data/chunck_{i}.pickle', 'wb') as handle:
            pickle.dump(list(shared_list), handle)

        i += 1
