from flask_restful import Resource
from flask import request
from firebaseUtils import getConfig, updateConfig
from githubUtils import findRandomRepo, validateData
from http import HTTPStatus

class RepoResource(Resource):
    def get(self):
        serverID = request.args.get('sid')

        config = getConfig(serverID)

        if config is None:
            return {"msg": "Config not found"}, HTTPStatus.NOT_FOUND

        randomRepo = findRandomRepo(config)

        if randomRepo is None:
            randomRepo = findRandomRepo({
                "topics":["*"],
                "langs":["*"]
            })

        return randomRepo, HTTPStatus.OK

class ConfigResource(Resource):

    def get(self):
        serverID = request.args.get('sid')
        config = getConfig(serverID)

        if config is None:
            return {"msg": "Not found"}, HTTPStatus.NOT_FOUND
        return config, HTTPStatus.OK

    def post(self):

        serverID = request.args.get('sid')
        body = request.get_json()

        if not validateData(body):
            return {"msg": "Invalid data"}, HTTPStatus.BAD_REQUEST

        status, config = updateConfig(serverID, body)

        if not status:
            return {"msg": "Error occured"}, HTTPStatus.INTERNAL_SERVER_ERROR
        else:
            return config, HTTPStatus.CREATED
