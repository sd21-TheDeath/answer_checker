# -*- coding: utf-8 -*-

import smtplib
import sys

s = smtplib.SMTP('smtp.gmail.com', 587) 
s.starttls() 
s.login("daiict.exam.portal@gmail.com", "@daiictexamportal@")
print(str(sys.argv[1]))
print(str(sys.argv[2]))
message = "We got a request to change your DAIICT Exam Portal password.\nYour OTP to continue the process is " + str(sys.argv[2]) + ".\nIf its not you, please complain your admin about this incident to take further actions."
s.sendmail("sender_email_id", sys.argv[1] + "@daiict.ac.in", message) 
s.quit() 

