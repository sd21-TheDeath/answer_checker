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
with io.open("sep.txt", "w", encoding="utf-8") as f:
    f.write(keypoints[0])
    f.write(keypoints[1])
#bcpe
course = str(sys.argv[3])
batch = str(sys.argv[2])
examNo = str(sys.argv[5])
program = str(sys.argv[4])

#keypoints = ['virat kohli','narendra modi']
#course = "a"
#batch = "b"
#examNo = "c"
#program = "c"


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

print("temp")
sys.stdout.flush()