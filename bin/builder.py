#!/usr/bin/env python
# coding: utf-8
# Author: Vova Zaytsev <zaytsev@usc.edu>

import os
import sys
import yaml
import uuid
import calendar

def build_asset(asset_config, build_id, repo_root, dest_root, gzip=True):
    asset_type = asset_config["type"]
    asset_files = asset_config["files"]
    asset_id = uuid.uuid4().hex[:8]
    assert(asset_type in ("js", "css"))
    asset_file = "%s.%s.%s" % (build_id[-4:], asset_id, asset_type)
    asset_path = os.path.join(dest_root, asset_file)
    asset_path_gz = "%s.gz" % asset_path
    asset_min_file = "%s.%s.min.%s" % (build_id[:4], asset_id, asset_type)
    asset_min_path = os.path.join(dest_root, asset_min_file)
    os.system("touch %s" % asset_path)
    for asset_part in asset_files:
        asset_part_file = os.path.join(repo_root, asset_part)
        os.system("cat < %s >> %s; echo '\\n' >> %s" % (asset_part_file, asset_path, asset_path))
    if asset_type == "js":
        os.system("java -jar ./bin/compiler.jar --language_in=ECMASCRIPT5 --js_output_file=%s %s" % (asset_min_path, asset_path))
    if asset_type == "css":
        os.system("java -jar ./bin/compressor.jar %s -o %s" % (asset_path, asset_min_path))
    if asset_type == "js":
        os.system("echo '// build=%s\\n' > %s" % (build_id, asset_path))
    if asset_type == "css":
        os.system("echo '/* build=%s */\\n' > %s" % (build_id, asset_path))
    os.system("cat %s >> %s" % (asset_min_path, asset_path))
    if gzip == True:
        os.system("gzip -9 < %s > %s" % (asset_path, asset_path_gz))
    os.system("rm -f %s" % asset_min_path)
    if asset_type == "js":
        element = '<link rel="stylesheet" href="/static/%s" />' % asset_file
    if asset_type == "css":
        element = '<script src="/static/%s"></script>' % asset_file
    return element

if __name__ == "__main__":
    asset_map = {
        "head": [],
        "body": [],
        "foot": [],
    }
    _, assets_config_yml, repo_root, static_root, build_id = sys.argv
    with open(assets_config_yml, "r") as assets_config_if:
        assets_config = yaml.load(assets_config_if)
        # Create root.
        os.system("mkdir -p %s" % static_root)
        # Move static files.
        for from_dir, paths in assets_config["copy"].iteritems():
            for path in paths:
                os.system("cp -rf %s %s" % (os.path.join(repo_root, from_dir, path), os.path.join(static_root, path)))
        # Render assets.
        for asset_name, asset_config in assets_config["assets"].iteritems():
            asset_map[asset_config["section"]].append(build_asset(asset_config, build_id, repo_root, static_root))
            print asset_map
        index_html = open(os.path.join(repo_root, assets_config["index_html"]["input"]), "rb").read()
        for section, elements in asset_map.items():
            elements = "".join(elements)
            index_html = index_html.replace("{{%s}}" % section, elements)
        with open(os.path.join(static_root, assets_config["index_html"]["output"]), "wb") as o_html:
            o_html.write(index_html)
