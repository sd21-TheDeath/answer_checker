# -*- coding: utf-8 -*-
"""
Created on Tue Apr 16 18:58:35 2019

@author: kalpi
"""
import gensim
import smart_open


course = "IT314"
batch = "2016"
examNo = "1"

wiki_scrapped = "scrapped_{}_{}_{}.txt".format(course, batch, examNo)

def read_corpus(fname, tokens_only=False):
    with smart_open.smart_open(fname) as f:
        for i, line in enumerate(f):
            if tokens_only:
                yield gensim.utils.simple_preprocess(line)
            else:
                yield gensim.models.doc2vec.TaggedDocument(gensim.utils.simple_preprocess(line), [i])

train_corpus = list(read_corpus(wiki_scrapped))

model = gensim.models.doc2vec.Doc2Vec(vector_size=70,alpha=0.025,min_alpha=0.00025 ,min_count=2, epochs=40)

model.build_vocab(train_corpus)


max_epochs = 100


for epoch in range(max_epochs):
    print('iteration {0}'.format(epoch))
    model.train(train_corpus,
                total_examples=model.corpus_count,
                epochs=model.iter)
    # decrease the learning rate
    model.alpha -= 0.0001
    # fix the learning rate, no decay
    model.min_alpha = model.alpha

import pickle
pickle.dump(model, open('ans_checker_{}_{}_{}.sav'.format(course, batch, examNo), 'wb'))
