from firebase_admin import db
import firebase_admin

def validateData(config):
    '''

    :param config:
    :return: True if valid data and False if invalid.
    '''

    # Making sure all the keys are here
    try:
        interval = config["interval"]
        langs = config["langs"]
        topics = config["topics"]
    except KeyError:
        return False

    # Make sure everything is the correct type
    return type(interval) is int and type(langs) is list and type(topics) is list

def getServerSnapshot(serverID):
    '''
    Gets Firebase DB snapshot of server config.
    :param serverID: The guild ID from Discord.
    :return: The snapshot of the config from our Firebase DB.
    '''
    ref = db.reference("/servers")
    snapshot = ref.order_by_child("id").equal_to(serverID)

    return snapshot

def updateConfig(serverID,configDict):

    snapshot = getServerSnapshot(serverID)

    if snapshot is None:
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



