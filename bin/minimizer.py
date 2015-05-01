#!/usr/bin/env python
# coding: utf-8
# Author: Vova Zaytsev <zaytsev@usc.edu>

import sys
import yaml
import calendar


def build_asset(assets_config):

    env.lcwd = os.path.dirname(__file__)
    config = env.config

    context = config["context"]

    with open("assets.json", "rb") as i_fl:
        assets = json.load(i_fl)

    with cd("%s/" % env.config["path"]):
        print(green("Building assets."))
        build = {}
        build_in_out = {}
        timestamp = calendar.timegm(time.gmtime())
        dir_name = "build/%s" % timestamp
        local("mkdir -p %s" % dir_name)
        for key, files in assets.iteritems():
            uid = uuid.uuid4().hex
            ext = "js" if key.startswith("JS") else "css"
            fl_name = "%s/%s.%s" % (dir_name, uid, ext)
            local("touch %s" % fl_name)
            for i_fl in files:
                local("cat < %s >> %s" % (i_fl, fl_name))
                local("echo '\\n' >> %s" % fl_name)
            o_file = "%s/%s.min.%s" % (dir_name, uid, ext)
            if ext == "js":
                local("java -jar compiler.jar --language_in=ECMASCRIPT5 --js_output_file=%s %s" % (o_file, fl_name))
            if ext == "css":
                local("java -jar compressor.jar %s -o %s" % (fl_name, o_file))

            build_in = o_file
            build_out = "webapp/assets/%s/%s.min.%s" % (timestamp, uid, ext)

            build[key] = build_out
            build_in_out[key] = (build_in, build_out)

    run(("mkdir -p {path}/webapp/assets/%s" % timestamp).format(**config))
    fabric.contrib.files.upload_template("webapp/templates/app.tpl.html",
                                         "{path}/webapp/templates/app.html".format(**config),
                                         context=build,
                                         use_jinja=True)
    for f_in, f_out in build_in_out.values():
        fabric.contrib.files.upload_template(f_in, ("{path}/%s" % f_out).format(**config))


if __name__ == "__main__":

    _, build_config_yml, assets_config_yml, asset_id, static_dir = sys.argv

    with open(build_config_yml, "r") as build_config_if, open(assets_config_yml, "r") as assets_config_if:

        build_config = yaml.load(build_config_if)
        assets_config = yaml.load(assets_config_if)

        for asset_name, asset in assets_config["assets"].iteritems():

            print asset

