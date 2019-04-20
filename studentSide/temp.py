# -*- coding: utf-8 -*-
"""
Created on Wed Apr 17 16:54:59 2019

@author: kalpi
"""

import sys
import io



#x = '[{"name":"adasdasd"},{"name":"iuythngtrfbfvd"}]'

#x = x.replace('[', "")
#x = x.replace(']', "")
#x = x.replace('"}', "")
#x = x.replace('{"', "")
#x = x.split(',')
#
#x = [i.replace('name":"', "") for i in x]
#

#x = "ans1 wewrwer errgdfgdfg:/5762*,ans2 dfgodpfgpoi dfpogi:/5762*"
x = str(sys.argv[5])

x = x.split(':/5762*')
x= x[:-1]

for i in range(1,len(x)):
    if(x[i][0] == ','):
        x[i] = x[i][1:]
    

with io.open("temp.txt", "w", encoding="utf-8") as f:
    f.write(x[0])
    f.write(x[1])


print(str(sys.argv[1]))
sys.stdout.flush()
