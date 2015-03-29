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

def to_bool(boolean):
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
    html += '   <script src="require.js"></script>' + os.linesep
    html += '   <script src="Vesmeer.js"></script>' + os.linesep
    html += '</head>' + os.linesep
    html += '<body>' + os.linesep
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


# def deploy_toy(include_db_export = 'False'):
#     """
#     Deploys the content of the staging git branch to the staging
#     server. If include_db_export is True, the local development
#     database will be exported and deployed to the staging server
#     as well.
#     """
#     include_db_export = to_bool(include_db_export)

#     if include_db_export == True:
#         local('./export_dev_db.sh')
    
#     toy_installation_server_path = '/srv/www/toy.jewbilation.com'
#     db_export_file_server_path = os.path.join(
#         toy_installation_server_path,
#         '/srv/www/toy.jewbilation.com/database/jewbilation.sql.tar.gz'
#     )
#     sudo('mkdir -p %s' % toy_installation_server_path)
#     with cd(toy_installation_server_path):
#         if run(
#             'if [ -e %s ]; then echo "1"; else echo "0"; fi' %
#             os.path.join(toy_installation_server_path, ".git")
#         ) == "1":
#             sudo('git pull origin toy')
#         else:
#             sudo('git clone -b %s %s %s' % (
#                 'toy', 
#                 '/srv/gitrepos/jewbilation.git',
#                 toy_installation_server_path
#             ))
#         sudo('chown -R petr:www-data %s' % toy_installation_server_path)
#         if include_db_export == True:
#             local('rsync -avz --progress '
#                 '../database/jewbilation.sql.tar.gz '
#                 'petr@jewbilation.com:%s' % db_export_file_server_path)
        
#     with cd(os.path.join(toy_installation_server_path, '_provision')):
#         sudo('puppet apply puppet/manifests/toy/ '
#             '--modulepath=puppet/modules/ --verbose', shell=True)
