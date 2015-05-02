FROM ubuntu:15.04

# Install required packages
RUN apt-get install -y software-properties-common
RUN add-apt-repository -y ppa:nginx/stable
RUN apt-get update
RUN apt-get -y upgrade
RUN apt-get install -y build-essential git
RUN apt-get install -y nginx
RUN apt-get install -y python
RUN apt-get install -y python-dev
RUN apt-get install -y python-pip
RUN apt-get install -y python-oauth2
RUN apt-get install -y uwsgi
RUN apt-get install -y uwsgi-plugin-python
RUN apt-get install -y supervisor

# Create root directory
ADD ./build/farmhouse_dev /farmhouse

# Clone repository & install dependences
# RUN git clone -b   /farmhouse/application
# RUN rm -rf /farmhouse/application/.git
# RUN pip install -r /farmhouse/application/requirements.txt

# Create log root
RUN mkdir /farmhouse/logs

# Add nginx configs
RUN rm /etc/nginx/sites-enabled/default
RUN rm /etc/nginx/sites-available/default
ADD ./build/farmhouse_dev/configuration/nginx.conf /etc/nginx/nginx.conf
ADD ./build/farmhouse_dev/configuration/nginx-site.conf /etc/nginx/sites-available/lucid.conf
ADD ./build/farmhouse_dev/configuration/nginx-site.conf /etc/nginx/sites-enabled/lucid.conf

# Add UWSGI configs
ADD ./build/farmhouse_dev/configuration/uwsgi.ini /etc/uwsgi/apps-available/lucid.ini
ADD ./build/farmhouse_dev/configuration/uwsgi.ini /etc/uwsgi/apps-enabled/lucid.ini

# Add lucid app configs
ADD ./build/farmhouse_dev/configuration/settings.py /farmhouse/application/configuration/settings.py

EXPOSE 80
EXPOSE 443

RUN service uwsgi restart
RUN service nginx restart

CMD ["supervisord", "-n"]