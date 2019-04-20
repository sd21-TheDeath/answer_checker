
from fpdf import FPDF
 
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
data = [['Question1','93%'],['Question2','55%'],['Question3','77%']]
pdf.ln(2*pdf.font_size)
pdf.cell(epw, 0.0, 'Username : 201601441', align='L')
pdf.ln(1.5*pdf.font_size)
pdf.cell(epw, 0.0, 'Email : 201601441@daiict.ac.in', align='L')
pdf.ln(1.5*pdf.font_size)
pdf.cell(epw, 0.0, 'Batch : 2016', align='L')
pdf.ln(1.5*pdf.font_size)
pdf.cell(epw, 0.0, 'Course : IT314', align='L')
pdf.ln(1.5*pdf.font_size)
pdf.cell(epw, 0.0, 'Professor : Saurabh Tiwari', align='L')
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
 
pdf.output('result_201601441.pdf','F')

