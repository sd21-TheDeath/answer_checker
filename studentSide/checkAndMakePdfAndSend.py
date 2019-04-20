# -*- coding: utf-8 -*-
"""
Created on Wed Apr 17 02:49:31 2019

@author: kalpi
"""
import pickle
import numpy as np
import nltk
from fpdf import FPDF
import sys

x = str(sys.argv[5])

x = x.split(':/5762*')
x= x[:-1]

for i in range(1,len(x)):
    if(x[i][0] == ','):
        x[i] = x[i][1:]
    
ans_student = x
#ans_prof = ["professor answer", "prof ans 2"]
#ans_student = ["student answer", "stud ans 2"]
x = str(sys.argv[6])

x = x.split(':/5762*')
x= x[:-1]

for i in range(1,len(x)):
    if(x[i][0] == ','):
        x[i] = x[i][1:]

ans_prof = x



examNo = str(sys.argv[1])
username = str(sys.argv[2])
username = "201601441"
batch = str(sys.argv[3])
course = str(sys.argv[4])
#professor = "Saurabh Tiwari"
examDate = str(sys.argv[7])
program = str(sys.argv[8])


#"scrapped_{}_{}.txt".format(course, batch)

loaded_model = pickle.load(open('ans_checker_{}_{}_{}_{}.sav'.format(course, batch,program, examNo), 'rb'))

#loaded_model = pickle.load(open('ans_checker_00000_2016_01_21.sav', 'rb'))
#a = model.infer_vector(['carbon-carbon','bonds','are','strong'])
#measure = np.dot(a,a)
#b = model.infer_vector(['carbon-carbon','bonds','are','not','weak','they','are','strong'])

ans_prof = [nltk.word_tokenize(i) for i in ans_prof]
ans_student = [nltk.word_tokenize(i) for i in ans_student]


ans_prof_vec = [loaded_model.infer_vector(i) for i in ans_prof]
ans_student_vec = [loaded_model.infer_vector(i) for i in ans_student]

mod_ans_professor = [np.sqrt(np.dot(i,i)) for i in ans_prof_vec]
mod_ans_student = [np.sqrt(np.dot(i,i)) for i in ans_student_vec]

#str(np.dot(ans_student_vec,ans_prof_vec)*100/(mod_ans_student*mod_ans_professor))

res = []

for i in range(0,len(mod_ans_professor)):
    res.append(str(np.dot(ans_student_vec[i],ans_prof_vec[i])*100/(mod_ans_student[i]*mod_ans_professor[i])))

res = [float(i) for i in res]

#xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
#XXXXXXXXXX    SOME MODULATION TO BE DONE HERE          XXXXXXXXXXX
#xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# <70 -> 0
# 70-80 -> 15
# 80-90 -> 15-80
# 90 -100 -> 80-100
for i in range(0, len(res)):
	if res[i] < 70:
		res[i] = 0
	elif res[i] <80 and res[i] >= 70:
		res[i] = (res[i] - 70)*15/10
	elif res[i] >=80 and res[i]<90:
		res[i] = 15 + (res[i] - 80)*65/10
	else:
		res[i] = 80 + (res[i]-90)*20/10


data = []
for i in range(0,len(res)):
    temp = []
    temp.append('Question '+ str(i+1))
    temp.append(res[i])
    data.append(temp)

 
pdf=FPDF(format='letter', unit='in')
pdf.add_page()

months = ['January','February','March','April','May','June','July','August','September','October','November','December']

examDD = int(examDate)%100
examMM = months[int((int(examDate)/100))%100]
examYY = int(int(examDate)/10000)

epw = pdf.w - 2*pdf.l_margin

pdf.set_font('Times','B',20.0)
pdf.cell(epw, 0.0, 'DAIICT eResult', align='C')
pdf.set_font('Times','',10.0)
pdf.ln(2*pdf.font_size)
col_width = epw/2

#data = [['Question1','93%'],['Question2','55%'],['Question3','77%']]

pdf=FPDF(format='letter', unit='in')
pdf.add_page()
epw = pdf.w - 2*pdf.l_margin
pdf.set_font('Times','',10.0)
name='logo.jpg'
pdf.ln(2*pdf.font_size)
#pdf.l_margin+=pdf.r_margin
pdf.image(name, x = .5, y = 0.3, w = 7, h = 1)
pdf.ln(1.5*pdf.font_size)
pdf.set_font('Times','B',20.0)
#pdf.cell(epw, 0.0, 'DAIICT e-Result', align='C',border=0)
pdf.set_font('Times','',10.0)
pdf.ln(4*pdf.font_size)
col_width = epw/2

#pdf.set_text_color(255,50,100)
#pdf.set_fill_color(203,189,189)
pdf.set_fill_color(204,204,255)
pdf.cell(0,pdf.h-6*pdf.l_margin,align='C',border=1,fill=True)

#pdf.dashed_line(0, 0, 0, 5, dash_length = 1, space_length = 1)
pdf.l_margin+=pdf.r_margin
#data = [['Question1','93%'],['Question2','55%'],['Question3','77%']]
pdf.ln(2*pdf.font_size)
pdf.cell(epw, 0.0, 'Username : '+ username, align='L')
pdf.ln(1.5*pdf.font_size)
pdf.cell(epw, 0.0, 'Email : ' + username +'@daiict.ac.in', align='L')
pdf.ln(1.5*pdf.font_size)
pdf.cell(epw, 0.0, 'Batch : '+ batch, align='L')
pdf.ln(1.5*pdf.font_size)
pdf.cell(epw, 0.0, 'Course : ' + course, align='L')
#pdf.ln(1.5*pdf.font_size)
#pdf.cell(epw, 0.0, 'Professor : Saurabh Tiwari', align='L')
pdf.ln(4*pdf.font_size)

pdf.set_font('Times','U',20.0)
pdf.cell(epw-pdf.l_margin,0.0,'Score Card',align='C',border=0)
pdf.set_font('Times','',10.0)

pdf.ln(pdf.font_size)
th = pdf.font_size
 
pdf.set_font('Times','B',14.0) 

pdf.set_font('Times','',10.0) 

#pdf.l_margin+=(1/2)*pdf.r_margin
pdf.ln(0.5)

for row in data:
    for datum in row:
        # Enter data in colums
        #pdf.cell(0.0,w=pdf.l_margin,border=0)
        #pdf.set_text_color(0,0,0)
        #if (row[1]<'30%'):
         #   pdf.set_text_color(255,0,0)
        pdf.cell(col_width-pdf.r_margin, 2*th, str(datum), border=1)
 
    pdf.ln(2*th)
  
pdf.output('result_{}_{}_{}.pdf'.format(username, course, examNo),'F')



#xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
import smtplib 
from email.mime.multipart import MIMEMultipart 
from email.mime.text import MIMEText 
from email.mime.base import MIMEBase 
from email import encoders 
   
fromaddr = "daiict.exam.portal@gmail.com"
toaddr = username + '@daiict.ac.in'
   
# instance of MIMEMultipart 
msg = MIMEMultipart() 
  
# storing the senders email address   
msg['From'] = fromaddr 
  
# storing the receivers email address  
msg['To'] = toaddr 
  
# storing the subject  
msg['Subject'] = "Result from Exam Portal"
  
# string to store the body of the mail 
body = "Dear student,\n\t Attached is the result for " + course + " exam conducted on " + str(examDD) + ' ' + str(examMM) + ' ' + str(examYY) + ".Please contact your TAs if you have any doubts."
  
# attach the body with the msg instance 
msg.attach(MIMEText(body, 'plain')) 
  
# open the file to be sent  
filename = 'result_{}_{}_{}.pdf'.format(username, course, examNo)
attachment = open('result_{}_{}_{}.pdf'.format(username, course, examNo), "rb") 
  
# instance of MIMEBase and named as p 
p = MIMEBase('application', 'octet-stream') 
  
# To change the payload into encoded form 
p.set_payload((attachment).read()) 
  
# encode into base64 
encoders.encode_base64(p) 
   
p.add_header('Content-Disposition', "attachment; filename= %s" % filename) 
  
# attach the instance 'p' to instance 'msg' 
msg.attach(p) 
  
# creates SMTP session 
s = smtplib.SMTP('smtp.gmail.com', 587) 
  
# start TLS for security 
s.starttls() 
  
# Authentication 
s.login(fromaddr, "@daiictexamportal@") 
  
# Converts the Multipart msg into a string 
text = msg.as_string() 
  
# sending the mail 
s.sendmail(fromaddr, toaddr, text) 
  
# terminating the session 
s.quit()

print("please bhagwan")
sys.stdout.flush()