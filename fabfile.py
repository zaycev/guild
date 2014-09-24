#!/usr/bin/env python
# coding: utf-8

# Copyright (C) University of Southern California (http://usc.edu)
# Author: Vladimir M. Zaytsev <zaytsev@usc.edu>
# URL: <http://nlg.isi.edu/>
# For more information, see README.md
# For license information, see LICENSE


import os
import json
import glob
import fabric

from fabric.api import cd
from fabric.api import env
from fabric.colors import red
from fabric.colors import green
from fabric.operations import run
from fabric.operations import sudo


UBUNTU_PACKAGES = open("ubuntu.txt", "rb").read().split("\n")


def dev():
    env.config = {
        "repository":   "https://github.com/zaycev/letsdothis.git",
        "branch":       "dev",
        "context":       json.load(open("fab/config.dev.json", "r")),
    }
    env.config["path"] = env.config["context"]["ROOT"]
    env.config["logs"] = env.config["context"]["LOG_DIR"]
    env.config["stage"] = env.config["context"]["STAGE"]


def prod():
    env.config = {
        "repository":   "https://github.com/zaycev/letsdothis.git",
        "branch":       "prod",
        "context":      json.load(open("fab/config.prod.json", "r")),
    }
    env.config["path"] = env.config["context"]["ROOT"]
    env.config["logs"] = env.config["context"]["LOG_DIR"]
    env.config["stage"] = env.config["context"]["STAGE"]


def run_local():
    env.host_string = "localhost"
    env.local       = True
    local("pypy manage.py runserver 0.0.0.0:8000 --settings=ldt.local")


def server():
    env.host_string  = "162.243.152.239"
    env.user         = "root"
    env.key_filename = "~/.ssh/id_rsa"
    env.local        = False


def init():
    config = env.config
    if not env.local:

        print(green("Installing packages."))
        run("aptitude update > /dev/null")
        run("aptitude upgrade > /dev/null")
        run("aptitude -f install %s > /dev/null" % " ".join(UBUNTU_PACKAGES))

        if not fabric.contrib.files.exists(env.config["path"]):
            print(green("Clonning repository."))
            run("git clone {repository} -b {branch} {path}".format(**env.config))
        else:
            print(green("Repository already exists"))

        print(green("Installing python requirements."))
        run("pip install -r {path}/requirements.txt > /dev/null".format(**config))

        print(green("Setting up logs."))
        run("mkdir -p {logs}".format(**config))
        run("mkdir -p {path}/logs".format(**config))
        run("chown root:root -R {logs}".format(**config))
        run("chown root:root -R {path}".format(**config))




def update_ubuntu():
    with open("ubuntu.txt", "r") as i_fl:
        ubuntu_packages = i_fl.read().split("\n")
    sudo("aptitude update")
    sudo("aptitude install %s" % " ".join(ubuntu_packages))



def update():
    print(green("Updating packages."))
    config = env.config
    run("aptitude -f update")
    run("aptitude -f upgrade %s" % " ".join(UBUNTU_PACKAGES))
    run("pypy -m pip install -r {path}/requirements.txt --upgrade".format(**config))
    run("curl http://uwsgi.it/install | bash -s pypy /tmp/uwsgi")


def deploy():

    env.lcwd = os.path.dirname(__file__)
    config = env.config

    context = config["context"]

    print(red("Beginning Deploy to: {user}@{host_string}".format(**env)))

    with cd("%s/" % env.config["path"]):
        run("pwd")

        print(green("Switching branch."))
        run("git checkout {branch}".format(**config))

        print(green("Pulling from GitHub."))
        run("git pull")

        print(green("Fetching requirements."))
        run("pip install -r {path}/requirements.txt > /dev/null".format(**config))

        print(green("Setting up logs."))
        run("mkdir -p {logs}".format(**config))
        run("mkdir -p {path}/logs".format(**config))
        run("chown root:root -R {logs}".format(**config))
        run("chown root:root -R {path}".format(**config))


        print(green("Uploading setting.py"))
        fabric.contrib.files.upload_template("fab/settings.py",
                                             "{path}/ldt/settings.py".format(**config),
                                             context=context,
                                             use_jinja=True)

        print(green("Uploading usgi.ini"))
        fabric.contrib.files.upload_template("fab/uwsgi.ini",
                                             "{path}/uwsgi.ini".format(**config),
                                             context=context,
                                             use_jinja=True)
        run("cp -f {path}/uwsgi.ini /etc/uwsgi/apps-available/{stage}.ini".format(**config))
        run("ln -sf /etc/uwsgi/apps-available/{stage}.ini /etc/uwsgi/apps-enabled/{stage}.ini".format(**config))
        run("/etc/init.d/uwsgi restart {stage}".format(**config))

        print(green("Uploading nginx config"))
        fabric.contrib.files.upload_template("fab/nginx-site.conf",
                                             "{path}/nginx-site.conf".format(**config),
                                             context=context,
                                             use_jinja=True)
        fabric.contrib.files.upload_template("fab/nginx.conf",
                                             "{path}/nginx.conf".format(**config),
                                             context=context,
                                             use_jinja=True)
        run("cp -f {path}/nginx.conf /etc/nginx/nginx.conf".format(**config))
        run("cp -f {path}/nginx-site.conf /etc/nginx/sites-available/{stage}".format(**config))
        run("ln -sf /etc/nginx/sites-available/{stage} /etc/nginx/sites-enabled/{stage}".format(**config))
        run("rm -f /etc/nginx/sites-available/default".format(**config))
        run("rm -f /etc/nginx/sites-enabled/default".format(**config))
        run("sudo service nginx restart".format(**config))


def devdeploy():
    dev()
    server()
    deploy()


def proddeploy():
    prod()
    server()
    deploy()
