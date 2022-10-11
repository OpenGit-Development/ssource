from firebase_admin import db
from githubUtils import client, createQuery
import firebase_admin


def validateData(config):
    '''
    Returns whether inputted data is valid
    :param config:
    :return: True if valid data and False if invalid.
    '''

    if type(config["interval"]) != int \
            or type(config["langs"]) != list or type(config["topics"]) != list:
        return False

    for lang in config["langs"]:
        if type(lang) != str:
            return False
        try:
            query = createQuery(lang, "*")
            repos = client.search_repositories(query)
            if repos.totalCount < 5:
                return False
        except:
            return False

    for topic in config["topics"]:
        if type(topic) != str:
            return False

        query = createQuery("*", topic)
        repos = client.search_repositories(query)
        print(repos.totalCount)
        if repos.totalCount < 5:
            return False

    return True


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



