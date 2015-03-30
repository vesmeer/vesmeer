import os
import glob
import sys
import shutil
from fabric.api import local, cd, lcd, run, env, sudo

sys.path.append(os.path.join(
    os.path.dirname(
        os.path.realpath(__file__)
    ), '..', 'Config')
)

from fabfile_config import *

env.hosts = SERVER_HOSTS
env.user = SERVER_USERNAME
env.forward_agent = FORWARD_AGENT
env.config_dir = CONFIG_DIR
env.build_dir = BUILD_DIR
env.server_app_root_dir = SERVER_APP_ROOT_DIR

def _to_bool(boolean):
    """
    Converts string representation of boolean True/False
    to boolean values.
    """
    if boolean == 'False':
        return False
    else:
        return True


def build():
    _create_build_dir()
    _create_index_file()
    _copy_files_to_build_dir()

    local(
        'node ' + os.path.join('..', 'Js', 'Lib', 'Vendor', 'r.js') + 
        ' -o ' + os.path.join(env.config_dir, 'build.js')
    )


def _create_build_dir():
    if not os.path.exists(env.build_dir):
        os.mkdir(env.build_dir)
    else:
        shutil.rmtree(os.path.join(env.build_dir, 'Assets'), True)
    

def _create_index_file():
    html =  '<html>' + os.linesep
    html += '<head>' + os.linesep
    html += '   <title>Vesmeer</title>' + os.linesep
    html += '   <link rel="stylesheet" type="text/css" href="Assets/Styles.css">' + os.linesep
    html += '   <meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />' + os.linesep
    html += '   <meta http-equiv="Pragma" content="no-cache" />' + os.linesep
    html += '   <meta http-equiv="Expires" content="0" />' + os.linesep
    html += '   <script src="require.js"></script>' + os.linesep
    html += '   <script src="Vesmeer.js"></script>' + os.linesep
    html += '</head>' + os.linesep
    html += '<body>' + os.linesep
    html += '<script>' + os.linesep
    html += "(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){" + os.linesep
    html += "(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o)," + os.linesep
    html += "m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)" + os.linesep
    html += "})(window,document,'script','//www.google-analytics.com/analytics.js','ga');" + os.linesep
    html += "ga('create', 'UA-26611884-5', 'auto');" + os.linesep
    html += "ga('send', 'pageview');" + os.linesep
    html += '</script>' + os.linesep
    html += '</body>' + os.linesep
    html += '</html>' + os.linesep
    f = open(os.path.join(env.build_dir, 'index.html'), "w")
    f.write(html)
    f.close()


def _copy_files_to_build_dir():
    shutil.copyfile(
        os.path.join('..', 'Js', 'Lib', 'Vendor', 'require.js'),
        os.path.join(env.build_dir, 'require.js')
    )
    shutil.copytree(
        os.path.join('..', 'Assets'),
        os.path.join(env.build_dir, 'Assets')
    )
    shutil.rmtree(os.path.join(env.build_dir, 'Assets', 'Css'))


def install_assets():
    _copy_assets_to_single_dir()
    _merge_css_files()


def _copy_assets_to_single_dir():
    paths = glob.glob(os.path.join('..', 'Js', 'Lib', 'Plugins', '*', 'Assets'))
    for path in paths:
        plugin_name = path.split(os.sep)[-2]
        plugin_assets_dir = os.path.join(
            env.config_dir, '..', 
            'Assets', plugin_name
        )
        print 'Copying assets from', path
        if os.path.exists(plugin_assets_dir):
            shutil.rmtree(plugin_assets_dir)
        shutil.copytree(path, plugin_assets_dir)


def _merge_css_files():
    cssFilesContent = ''
    paths = glob.glob(os.path.join('..', 'Assets', '*', 'Css', '*.css'))
    paths.extend(glob.glob(os.path.join('..', 'Assets', 'Css', '*.css')))
    paths.sort()
    for path in paths:
        f = open(path, 'r')
        cssFilesContent += f.read()
        f.close()
        # Delete the constituent CSS files except for the ones
        # in the Assets/Css directory.
        if os.path.dirname(path) != os.path.join('..', 'Assets', 'Css'):
            os.remove(path)
    f = open(os.path.join(env.config_dir, '..', 'Assets', 'Styles.css'), 'w')
    f.write(cssFilesContent)
    f.close()


def deploy_production():
    """
    Deploys the application to the production environment.
    """
    install_assets()
    build()

    sudo('mkdir -p %s' % env.server_app_root_dir)
    with cd(env.server_app_root_dir):
        sudo('chown -R ' + env.user + ':www-data %s' % env.server_app_root_dir)
        local('rsync -avz ' + env.build_dir + 
            '/* petr@vesmeer.com:' + env.server_app_root_dir)
        sudo('chown -R www-data:www-data %s' % env.server_app_root_dir)
        