from flask import Flask
from flask_restful import Api
import firebase_admin
from config import Config
from resources import ConfigResource, RepoResource

def register_extensions(app):

    cred = firebase_admin.credentials.Certificate("open_git_key.json")
    firebaseApp = firebase_admin.initialize_app(cred, {
        'databaseURL': "https://opengit-4a5ef-default-rtdb.firebaseio.com/"
    })

def create_app():
    app = Flask("dfas84Q3rgem0bvcrTgr8")
    app.config.from_object(Config)

    register_extensions(app)
    register_resources(app)

    return app

def register_resources(app):
    api = Api(app)

    api.add_resource(ConfigResource, "/config")
    api.add_resource(RepoResource, "/random")



if __name__ == '__main__':
    app = create_app()
    app.run()