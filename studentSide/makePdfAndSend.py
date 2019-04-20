import smtplib 
from email.mime.multipart import MIMEMultipart 
from email.mime.text import MIMEText 
from email.mime.base import MIMEBase 
from email import encoders 

from fpdf import FPDF
import sys
 
pdf=FPDF(format='letter', unit='in')
pdf.add_page()


username = "201601441"
batch = "2016"
course = "IT314"
professor = "Saurabh Tiwari"
examDate = "20190327"

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

data = [['Question1','93%'],['Question2','55%'],['Question3','77%']]

pdf.ln(1.5*pdf.font_size)
pdf.cell(epw, 0.0, 'Username : '+ username, align='L')
pdf.ln(1*pdf.font_size)
pdf.cell(epw, 0.0, 'Email : ' + username +'@daiict.ac.in', align='L')
pdf.ln(1*pdf.font_size)
pdf.cell(epw, 0.0, 'Batch : ' + batch, align='L')
pdf.ln(1*pdf.font_size)
pdf.cell(epw, 0.0, 'Course : ' + course, align='L')
pdf.ln(1*pdf.font_size)
pdf.cell(epw, 0.0, 'Professor : ' + professor, align='L')
pdf.ln(1*pdf.font_size)
pdf.cell(epw, 0.0, 'Exam Date : ' + str(examDD) + ' ' + str(examMM) + ' ' + str(examYY), align='L')
pdf.ln(1.5*pdf.font_size)

th = pdf.font_size
 
pdf.set_font('Times','B',14.0) 

pdf.set_font('Times','',10.0) 
pdf.ln(0.5)
 
for row in data:
    for datum in row:
        # Enter data in colums
        pdf.cell(col_width, 2*th, str(datum), border=1)
 
    pdf.ln(2*th)
 
pdf.output('result_{}_{}.pdf'.format(username, course),'F')



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
filename = "result_{}_{}.pdf".format(username, course)
attachment = open("result_{}_{}.pdf".format(username, course), "rb") 
  
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
sys.stdout.flush()