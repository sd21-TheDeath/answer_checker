# -*- coding: utf-8 -*-
"""
Created on Wed Apr 17 02:19:03 2019

@author: kalpi
"""

import bs4 as bs
import urllib.request
import io
import sys


x = (sys.argv[1])

#x = '[{"name":"adasdasd"},{"name":"iuythngtrfbfvd"}]'

x = x.replace('[', "")
x = x.replace(']', "")
x = x.replace('"}', "")
x = x.replace('{"', "")
x = x.split(',')

x = [i.replace('name":"', "") for i in x]


keypoints = x
# with io.open("sep.txt", "w", encoding="utf-8") as f:
    # f.write(keypoints[0])
    # f.write(keypoints[1])
#bcpe
course = str(sys.argv[3])
batch = str(sys.argv[2])
examNo = str(sys.argv[5])
program = str(sys.argv[4])


for url in keypoints:
    url = url.replace(' ','+')
    url = 'https://en.wikipedia.org/w/index.php?search=' + url
    sauce = urllib.request.urlopen(url).read()
    
    soup = bs.BeautifulSoup(sauce,'lxml')
    
    a = soup.find_all('p')
    
    final = ''
    for par in a:
        final = final + par.text
        final = final + '\n'
    
    with io.open("scrapped_{}_{}_{}_{}.txt".format(course, batch,program, examNo), "a+", encoding="utf-8") as f:
        f.write(final)

import gensim
import smart_open


#course = "IT314"
#batch = "2016"
#examNo = "1"

wiki_scrapped = "scrapped_{}_{}_{}_{}.txt".format(course, batch, program, examNo)

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

f2 = open("myNewText.txt", "a+")
for epoch in range(max_epochs):
    print('iteration {0}'.format(epoch))
    try:
        f2.write('iteration {}'.format(epoch))
    except:
        print("ff")
    model.train(train_corpus,
                total_examples=model.corpus_count,
                epochs=model.iter)
    # decrease the learning rate
    model.alpha -= 0.0001
    # fix the learning rate, no decay
    model.min_alpha = model.alpha

f2.close()
import pickle
pickle.dump(model, open('ans_checker_{}_{}_{}_{}.sav'.format(course, batch,program, examNo), 'wb'))
print("o bc")
sys.stdout.flush()