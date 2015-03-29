import os

thisDir = os.path.dirname(os.path.abspath(__file__))

SERVER_HOSTS = ['vesmeer.com']
SERVER_USERNAME = 'petr'
FORWARD_AGENT = True
CONFIG_DIR = os.path.join(thisDir, '..', 'Config')
BUILD_DIR = os.path.join(thisDir, '..', '..', 'Build')