# -*- coding: utf-8 -*-
"""
Created on Fri Feb  12 1:37:12 2019

@author: kalpi
"""

import pickle
import sys

course = "IT314"
batch = "2016"
examNo = "1"
ans_prof = "professor answer"
ans_student = "student answer"

#"scrapped_{}_{}.txt".format(course, batch)

loaded_model = pickle.load(open('ans_checker_{}_{}_{}.sav'.format(course, batch, examNo), 'rb'))
import numpy as np
#a = model.infer_vector(['carbon-carbon','bonds','are','strong'])
#measure = np.dot(a,a)
#b = model.infer_vector(['carbon-carbon','bonds','are','not','weak','they','are','strong'])
import nltk

ans_prof = nltk.word_tokenize(ans_prof)
ans_student = nltk.word_tokenize(ans_student)


ans_prof_vec = loaded_model.infer_vector(ans_prof)
ans_student_vec = loaded_model.infer_vector(ans_student)    

mod_ans_professor = np.sqrt(np.dot(ans_prof_vec,ans_prof_vec))
mod_ans_student = np.sqrt(np.dot(ans_student_vec,ans_student_vec))


# print(':)')

print(str(np.dot(ans_student_vec,ans_prof_vec)*100/(mod_ans_student*mod_ans_professor)))

sys.stdout.flush()