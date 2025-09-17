#!/usr/bin/python3.9
# -*- coding: utf-8 -*-
from sys import path
path.append ('C:\\Users\\deborah.powers\\Desktop\\python')
import json
from http.server import HTTPServer, SimpleHTTPRequestHandler, test
import loggerFct as log

class BackEndCors (SimpleHTTPRequestHandler):
	def end_headers (self):
		self.send_header ('Access-Control-Allow-Origin', '*')
		self.send_header ('Access-Control-Allow-Methods', '*')
		self.send_header ('Access-Control-Allow-Headers', '*')
		SimpleHTTPRequestHandler.end_headers (self)

test (BackEndCors, HTTPServer, port=1407)

"""
url correspondant à index.html
http://localhost:1407/
"""