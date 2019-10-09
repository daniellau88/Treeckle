import scrapy
import requests
from scrapy.http import TextResponse
from scrapy import Selector
import csv
import pandas as pd
from rake_nltk import Rake
import numpy as np
import html
import xml
import re
import string
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from random import randint