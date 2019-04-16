# -*- coding: utf-8 -*-
"""
Created on Fri Feb  12 1:37:12 2019

@author: kalpi
"""

import pickle
import sys

loaded_model = pickle.load(open('ans_checker_model.sav', 'rb'))
import numpy as np
#a = model.infer_vector(['carbon-carbon','bonds','are','strong'])
#measure = np.dot(a,a)
#b = model.infer_vector(['carbon-carbon','bonds','are','not','weak','they','are','strong'])
import nltk
ans_prof = 'Environmental pollution affects us in all aspects such as socially, economically, physically and mentally. The increasing pollution not only affects the lives of human beings but it also has adverse effects on all the species present on earth. The increasing pollution has also given rise to many major environmental problems like global warming and climate change.'
check_1 = str(sys.argv[1])
check_2 = str(sys.argv[2])
ans_prof = nltk.word_tokenize(ans_prof)
check_1 = nltk.word_tokenize(check_1)
check_2 = nltk.word_tokenize(check_2)

ans_prof_vec = loaded_model.infer_vector(ans_prof)
check_1_vec = loaded_model.infer_vector(check_1)    
check_2_vec = loaded_model.infer_vector(check_2)
mod_ans = np.sqrt(np.dot(ans_prof_vec,ans_prof_vec))
mod_check_1 = np.sqrt(np.dot(check_1_vec,check_1_vec))
mod_check_2 = np.sqrt(np.dot(check_2_vec,check_2_vec))

# print(':)')

print(str(np.dot(check_1_vec,ans_prof_vec)*100/(mod_check_1*mod_ans)))
print(str(np.dot(check_2_vec,ans_prof_vec)*100/(mod_check_2*mod_ans)), end="")

'''
#check_3 = "Environmental pollution socially economically physically chal hatt bhosdina humans lives"
check_3 = "Environmental pollution is good for humans. It helps humans socially, economically,mentally and physically. Global warming and climate change helps us as well"
check_3 = nltk.word_tokenize(check_3)
check_3_vec = model.infer_vector(check_3);
mod_check_3 = np.sqrt(np.dot(check_3_vec,check_3_vec))
print(np.dot(check_3_vec,ans_prof_vec)*100/(mod_check_3*mod_ans))
#np.dot(a,b)*100/measure
'''

sys.stdout.flush()