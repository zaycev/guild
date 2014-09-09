#!/bin/sh
echo "Running dev server..."
echo "Type http://0.0.0.0:8000 in your browser"
$(pypy manage.py runserver 0.0.0.0:8000 --settings=ldt.local)