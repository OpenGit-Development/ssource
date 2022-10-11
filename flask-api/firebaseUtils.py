from firebase_admin import db
import json
import firebase_admin

with open("validData.json", "r") as f:
    data = json.load(f)

def validateData(config):
    '''
    Returns whether inputted data is valid
    :param config:
    :return: (True, warning) if valid data and (False, error) if invalid.
    '''

    if type(config["interval"]) != int \
            or type(config["langs"]) != list or type(config["topics"]) != list:
        return False, "Invalid data type"

    if config["interval"] < 1:
        return False, "Interval must be greater than 0"

    if len(config["langs"]) == 0 or len(config["topics"]) == 0:
        return False, "Must have at least one language and topic"

    warning = ""

    for lang in config["langs"]:
        if lang.lower() not in data["langs"]:
            warning += lang + ', '

    if warning != "":
        return True, warning[:-2] + " do not exist in our common language database, but we will still use them."

    return True, ""


def getServerSnapshot(serverID):
    '''
    Gets Firebase DB snapshot of server config.
    :param serverID: The guild ID from Discord.d
    :return: The snapshot of the config from our Firebase DB.
    '''
    ref = db.reference("/servers")
    snapshot = ref.order_by_child("id").equal_to(serverID)

    return snapshot

def updateConfig(serverID,configDict):

    snapshot = getServerSnapshot(serverID)

    if not snapshot.get():
        ref = db.reference("/servers")
        serverRef = ref.push()

        serverRef.set({
            "id": serverID,
            "interval": configDict["interval"],
            "langs": configDict["langs"],
            "topics": configDict["topics"]
        })

        return True, getConfig(serverID)
    else:
        ref = db.reference("/servers")
        snapshot = getServerSnapshot(serverID)
        refId = list(snapshot.get().keys())[0]

        ref.child(refId).update({
            "id": serverID,
            "interval": configDict["interval"],
            "langs": configDict["langs"],
            "topics": configDict["topics"]
        })

        return True, getConfig(serverID)

def getConfig(serverID):
    '''
    Gets the config for a particular Discord server.
    :param serverID: The guild ID from Discord.
    :return: The config from our Firebase DB. If no config is found, the function returns None.
    '''

    try:
        snapshot = getServerSnapshot(serverID)
        return list(snapshot.get().values())[0]
    except IndexError:
        return None



