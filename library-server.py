#!/usr/bin/python3.9
# -*- coding: utf-8 -*-
"""
renvoyer les fichiers js et css de mes librairies
quand je veux utiliser mes librairies locales avec une web-extension
"""
from os import path as osPath
from sys import path as sysPath
sysPath.append ('C:\\Users\\deborah.powers\\Desktop\\python')
import json
import codecs
from http.server import HTTPServer, SimpleHTTPRequestHandler, test
import textFct
from fileCls import File
import loggerFct as log

pathLib = 'C:\\wamp64\\www\\site-dp\\'

def readFile (pathFile):
	pathFile = pathFile.replace ('/','\\')
	pathFile = pathLib + pathFile
	if not osPath.exists (pathFile): return ""
	textBrut = open (pathFile, 'rb')
	tmpByte = textBrut.read()
	encodingList = ('utf-8', 'ascii', 'ISO-8859-1')
	text =""
	for encoding in encodingList:
		try: text = codecs.decode (tmpByte, encoding=encoding)
		except UnicodeDecodeError: pass
		else: break
	textBrut.close()
	return text

class BackEndCors (SimpleHTTPRequestHandler):
	def end_headers (self):
		self.send_header ('Access-Control-Allow-Origin', '*')
		self.send_header ('Access-Control-Allow-Methods', '*')
		self.send_header ('Access-Control-Allow-Headers', '*')
		self.send_header ('Content-Type', 'text/plain')
		SimpleHTTPRequestHandler.end_headers (self)

	def do_GET (self):
		text = readFile (self.path[1:])
		print ('mon texte', text)
		textBytes = bytes (text, 'utf-8')
		if text: self.send_response (200)
		else: self.send_response (404)
		self.end_headers();
		self.wfile.write (textBytes)

if __name__ == '__main__':
	test (BackEndCors, HTTPServer, port=1407)

"""
url correspondant à index.html
http://localhost:1407/
si je rajoute une fonction do_GET à ma classe, le html du fichier est écrasé.
il faut générer du nouveau html dynamiquement grâce à self.wfile()

pour utiliser le script comme back-end dans un fichier js
const url = 'http://localhost:1407/';
const xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function(){ if (this.readyState ==4) console.log (this.responseText); };
xhttp.open ('GET', url, true);
xhttp.send();
"""