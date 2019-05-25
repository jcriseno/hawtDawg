import requests
import json
import os
import time

class handleDataForecast:
    def __init__(self, latitude, longitude):
        self.latitude = latitude
        self.longitude = longitude
        self.tempPrediction = None
        self.currentTemperature = None
        self.currentRadiation = None
        self.forecastTemperature = []
        self.forecastRadiation = []
        self.forecastPrediction = []
    
    def getTempForecast(self):
        darkSkies_url = 'https://api.darksky.net/forecast/'
        apiKey = '765f733fc6eda3815f80b32033f91a67'
        excludeBlocks = '?exclude=[currently,minutely,daily,alerts,flags]'
        url = darkSkies_url + apiKey + '/' + self.latitude + ',' + self.longitude + excludeBlocks
        print(url)

        try: 
            r = requests.get(url=url)
            # Parse Data function here
            #return r.json()
            data = r.json()
            self.parseTempData(data)
        except requests.exceptions.RequestException as err:
            print(err)
            sys.exit(1)
    def getRadForecast(self):
        solCast_url = 'https://api.solcast.com.au/radiation/forecasts?'
        apiKey = 'XEojYcws9-nvIY4oODCZsZPsvXUGLaAz'
        url = solCast_url + 'longitude=' + str(self.longitude) + '&latitude=' + str(self.latitude) + '&api_key=' + apiKey + '&format=json'
        print(url)

        try:
            r = requests.get(url=url)
            # Parse data function here
            data = r.json()
            self.parseRadData(data)
        except requests.exceptions.RequestException as err:
            print(err)
            sys.exit(1)
        
    def getRadEstimates(self):
        solCast_url = 'https://api.solcast.com.au/radiation/estimated_actuals?'
        apiKey = 'XEojYcws9-nvIY4oODCZsZPsvXUGLaAz'
        url = solCast_url + 'longitude=' + str(self.longitude) + '&latitude=' + str(self.latitude) + '&api_key=' + apiKey + '&format=json'
        print(url)

        try:
            r = requests.get(url=url)
            # Parse data function here
            data = r.json()
            self.parseRadEstimateData(data)
        except requests.exceptions.RequestException as err:
            print(err)
            sys.exit(1)
            
    def parseRadEstimateData(self, dataJson):
        #self.currentRadiation = dataJson['forecasts'][0]['ghi']
        for i in range(48):
            if (i % 2 == 0):
                temp = []
                temp.append(dataJson['estimated_actuals'][i]['ghi'])
                self.forecastRadiation.append(temp)
    
    def parseTempData(self, dataJson):
        for i in range(24):
            temp = []
            timeConversion = time.localtime(dataJson['hourly']['data'][i]['time'])
            temp.append(timeConversion.tm_hour)
            temp.append(dataJson['hourly']['data'][i]['temperature'])
            self.forecastTemperature.append(temp)
    
    def parseRadData(self, dataJson):
        #self.currentRadiation = dataJson['forecasts'][0]['ghi']
        for i in range(48):
            if (i % 2 == 0):
                temp = []
                temp.append(dataJson['forecasts'][i]['ghi'])
                self.forecastRadiation.append(temp)
    def forecastPredict(self):
        f = .5
        h = 10
        carWindowArea = [.805, 1.272, .7019, .7019]
        a = sum(carWindowArea)
        for i in range(24):
            temp = (self.forecastRadiation[i][0] * f) / (h * a)
            self.forecastPrediction.append(temp)
    def toJson(self):
        self.getRadForecast()
        self.getTempForecast()
        self.forecastPredict()
        dataJson = []
        for i in range(24):
            temp = {
                "Time" : self.forecastTemperature[i][0],
                "Temperature" : self.forecastTemperature[i][1],
                "Radiation" : self.forecastRadiation[i][0],
                "TempPrediction" : self.forecastPrediction[i]
            }
            dataJson.append(temp)
        #return json.dumps(dataJson)
        # Returns a list of the json to be converted
        return dataJson
    
    def toCurrentTemp(self):
        self.getTempForecast()
        dataJson = []
        jsonTemp = {
            "CurrentTemp" : self.forecastTemperature[0][1] 
        }
        dataJson.append(jsonTemp)
        return dataJson
    
    def toJsonCurrent(self):
        self.getRadForecast()
        self.getTempForecast()
        self.forecastPredict()
        dataJson = []
        temp = {
                "Time" : self.forecastTemperature[0][0],
                "Temperature" : self.forecastTemperature[0][1],
                "Radiation" : self.forecastRadiation[0][0],
                "TempPrediction" : self.forecastPrediction[0]
            }
        dataJson.append(temp)
        #return json.dumps(dataJson)
        # Returns a list of the json to be converted
        return dataJson
    
    def jsonEstimatedData(self):
        self.getRadEstimates()
        self.forecastPredict()
        dataJson = []
        for i in range(24):
            temp = {
                "Time" : 24-i,
                "Radiation" : self.forecastRadiation[i][0],
                "TempPrediction" : self.forecastPrediction[i]
            }
            dataJson.append(temp)
        #return json.dumps(dataJson)
        # Returns a list of the json to be converted
        return dataJson
    
'''       
def main():
    lat = '38.346069'
    lon = '-122.709892'
    f = handleDataForecast(lat, lon)
    f.getRadForecast()
    f.getTempForecast()
    f.forecastPredict()
    print(f.toJson())
    #print(len(f.forecastTemperature))
    #print(len(f.forecastRadiation))
    for i in range(len(f.forecastTemperature)):
        print('Time: ', f.forecastTemperature[i][0], 'Temperature: ', f.forecastTemperature[i][1], 'GHI: ', f.forecastRadiation[i][0], 'Predicted car temp: ', (f.forecastTemperature[i][1] + f.forecastPrediction[i]))
    
main()
'''
        