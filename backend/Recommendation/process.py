
import csv
import pandas as pd
from rake_nltk import Rake
import numpy as np
import re
import string
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from random import randint
import wikipedia

def fetch_wiki(title):
    summary = ""
    try:
        summary = wikipedia.summary(title)
    except wikipedia.exceptions.DisambiguationError as e:
        options = (e.options)
        if options:
            summary = wikipedia.summary(options[0])
    except wikipedia.exceptions.PageError as e:
        pass
    return summary
        
df = pd.read_csv('in.csv', encoding='latin-1')
df.set_index('id', inplace = True)

char_num = set('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!?$"\'()+-*/ .')

def just_text(text):
    text = ''.join(filter(lambda x: x in char_num, text)).strip()
    return re.sub(' +', ' ',text)

df['des'] = df['des'].map(just_text)

def keywords(x):
    r = Rake()
    r.extract_keywords_from_text(x)
    return ' '.join(list(r.get_word_degrees().keys()))

df['words'] = df['des'].map(keywords)

#print(df.head())

df.to_csv('middle.csv')

df = pd.read_csv('middle.csv', encoding='latin-1')
df['internal_id'] = df.index

#print(df.head())

count = CountVectorizer()
count_matrix = count.fit_transform(df['words'])

df.set_index('id', inplace = True)
#print(df.tail())

cosine_sim = cosine_similarity(count_matrix, count_matrix)
#print(cosine_sim)

def recommendations(title, cosine_sim = cosine_sim):
    
    recommended = []
    
    idx = df.loc[title, 'internal_id']
    score_series = pd.Series(cosine_sim[idx]).sort_values(ascending = False)

    top_5_indexes = list(score_series.iloc[1:2].index)
    names = list(df.index)
    for i in top_5_indexes:
        recommended.append(names[i])
        
    return recommended

def pair(x):
    nexts = recommendations(x)
    #print(nexts[0])
    return nexts[0]


write = []
for index in df.index:
    write.append([index, pair(index)])
    
with open('out.csv', 'w', encoding='utf-8') as f:
    writer = csv.writer(f, delimiter=',')
    writer.writerows(write)

#df.set_index('internal_id', inplace = True)

#title_read = False
#with open('in.csv', 'r', encoding='utf-8') as f:
#    reader = csv.reader(f, delimiter=",")
#    for row in reader:
#        if title_read:
#            row.append(fetch_wiki("clubbling tonight"))
#            print(row)
#        title_read = True
    
