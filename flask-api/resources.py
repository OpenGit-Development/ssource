from flask_restful import Resource
from flask import request
from firebaseUtils import getConfig, updateConfig, validateData
from githubUtils import findRandomRepo
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

        result, msg = validateData(body)
        if result is False:
            return { "msg": msg }, HTTPStatus.BAD_REQUEST

        status, config = updateConfig(serverID, body)

        if not status:
            return {"msg": "Error occured"}, HTTPStatus.INTERNAL_SERVER_ERROR
        else:
            if msg == "":
                config["msg"] = "success"
            else:
                config["msg"] = msg
            return config, HTTPStatus.CREATED
