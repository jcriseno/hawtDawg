from flask import Flask, jsonify, request, json
from flask_apscheduler import APScheduler
#import requests
import os
import time
import sched
import ForeCast as fc
import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

from exponent_server_sdk import DeviceNotRegisteredError
from exponent_server_sdk import PushClient
from exponent_server_sdk import PushMessage
from exponent_server_sdk import PushResponseError
from exponent_server_sdk import PushServerError
from requests.exceptions import ConnectionError
from requests.exceptions import HTTPError

#s = sched.scheduler(time.time, time.sleep)

cred = credentials.Certificate("./key/serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://hawtdawgtemps.firebaseio.com',
    'databaseAuthVariableOverride': None
})

app = Flask(__name__)
scheduler = APScheduler()
scheduler.init_app(app)
scheduler.start()

# Basic arguments. You should extend this function with the push features you
# want to use, or simply pass in a `PushMessage` object.
def send_push_message(token, message, user, extra=None):
    app.apscheduler.remove_job(user)
    try:
        response = PushClient().publish(
            PushMessage(to=token,
                        body=message,
                        data=extra))
    except PushServerError as exc:
        # Encountered some likely formatting/validation error.
        rollbar.report_exc_info(
            extra_data={
                'token': token,
                'message': message,
                'extra': extra,
                'errors': exc.errors,
                'response_data': exc.response_data,
            })
        raise
    except (ConnectionError, HTTPError) as exc:
        # Encountered some Connection or HTTP error - retry a few times in
        # case it is transient.
        rollbar.report_exc_info(
            extra_data={'token': token, 'message': message, 'extra': extra})
        raise self.retry(exc=exc)

    try:
        # We got a response back, but we don't know whether it's an error yet.
        # This call raises errors so we can handle them with normal exception
        # flows.
        response.validate_response()
    except DeviceNotRegisteredError:
        # Mark the push token as inactive
        from notifications.models import PushToken
        PushToken.objects.filter(token=token).update(active=False)
    except PushResponseError as exc:
        # Encountered some other per-notification error.
        rollbar.report_exc_info(
            extra_data={
                'token': token,
                'message': message,
                'extra': extra,
                'push_response': exc.push_response._asdict(),
            })
        raise self.retry(exc=exc)
    #return jsonify({'pulse': 120})

@app.route('/send_notification')
def send_notification():
    user = request.args.get('user', type=str)
    where = '/hawtdawgtemps/Users/' + user + '/token'
    ref = db.reference(where)
    token = str(ref.get())#'ExponentPushToken[t8YBVqEy_I5aPzKrW0VqGW]' #ref.get()
    message = 'alex had an accent'
    send_push_message(token, message)
    return jsonify({'pulse': 120})

@app.route('/set_timer')
def set_timer():
    time = 5
    #interval = 0
    #while(interval != time):
    #    time.sleep(60)
    #    interval += 1
    user = request.args.get('user', type=str)
    time = request.args.get('time', type=str)
    time = int(time)
    time *= 60
    where = '/hawtdawgtemps/Users/' + user + '/token'
    ref = db.reference(where)
    token = str(ref.get())
    message = 'Your timer went off! Please return to your car'
    app.apscheduler.add_job(func=send_push_message, trigger='interval', seconds=time, args=[token, message, user], id=user)
    #s.enter(300 , 1, send_push_message, (token, message,))
    #s.run()
    #send_push_message(token, message)
    return jsonify({'user': user})

@app.route('/firebase_test', methods=['GET'])
def fbCalls():
    ref = db.reference('/hawtdawgtemps')
    print(ref.get())
    
    return jsonify(ref.get())
@app.route('/get_user_token', methods=['GET'])
def getUser():
    user = request.args.get('user', type=str)
    where = '/hawtdawgtemps/Users/' + user
    ref = db.reference(where)
    return jsonify(ref.get())

@app.route('/add_toDatabase', methods=['GET'])
def addUser():
    user = request.args.get('user', type=str)
    token = request.args.get('token', type=str)
    ref = db.reference('/hawtdawgtemps/Users')
    ref.update({
        user : {
            'token': token
        }
    })
    return jsonify(ref.get())


@app.route('/get_data', methods=['GET'])
def foreCast_data():
    jsonData = []
    lat = request.args.get('latitude', type=str)
    lon = request.args.get('longitude', type=str)
    forecast = fc.handleDataForecast(lat, lon)
    return jsonify(forecast.toJson())

@app.route('/get_current', methods=['GET'])
def current_data():
    jsonData = []
    lat = request.args.get('latitude', type=str)
    lon = request.args.get('longitude', type=str)
    current = fc.handleDataForecast(lat, lon)
    return jsonify(current.toJsonCurrent())

@app.route('/current_temp', methods=['GET'])
def current_temp():
    jsonData = []
    lat = request.args.get('latitude', type=str)
    lon = request.args.get('longitude', type=str)
    currentTemp = fc.handleDataForecast(lat, lon)
    return jsonify(currentTemp.toCurrentTemp)

@app.route('/estimated_temp', methods=['GET'])
def estimated_temp():
    jsonData = []
    lat = request.args.get('latitude', type=str)
    lon = request.args.get('longitude', type=str)
    estimatedTemp = fc.handleDataForecast(lat, lon)
    return jsonify(estimatedTemp.jsonEstimatedData())

def cal_setTime():
    jsonData = []
    lat = request.args.get('latitude', type=str)
    lon = request.args.get('longitude', type=str)
    # need beginning time and end time to be passed in the url
    setTime = fc.handleDataForecast(lat, lon)
    

@app.route('/multiple10', methods=['GET'])
def ten_multi():
    return jsonify({'pulse': 120})
    
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
    