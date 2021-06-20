import os
from flask import Flask, render_template, url_for, jsonify, flash, get_flashed_messages, redirect, request
from flask_mail import Mail, Message
import pandas as pd
from PIL import Image

app = Flask(__name__, template_folder='templates', static_folder='static')

app.config.update(
    DEBUG=True,
    MAIL_SERVER='smtp.gmail.com',
    MAIL_PORT=465,
    MAIL_USE_TLS=False, #True,
    MAIL_USE_SSL=True, #False,
    MAIL_USERNAME=os.environ['MAIL_USERNAME'],
    MAIL_PASSWORD=os.environ['MAIL_PASSWORD'],
)

mail = Mail(app)




@app.route('/', methods = ['GET'])
@app.route('/home', methods = ['GET'])
def home():
    return render_template('home.html', page_title=" - Home")




@app.route('/rsvp')
def rsvp():
    return render_template('rsvp.html', page_title=" - RSVP")

@app.route('/rsvp_email', methods = ['GET', 'POST'])
def rsvp_email():
    name = request.form['name']
    email = request.form['email']
    adults = request.form['adults']
    kids = request.form['kids']
    babies = request.form['babies']
    notes = request.form['notes']

    with app.app_context():
        msg1 = Message(subject="Nuovo RSVP ricevuto!",
                      sender=app.config.get("MAIL_USERNAME"),
                      recipients=app.config.get("MAIL_USERNAME").split(),
                      body="Nome e cognome: {}\nE-mail: {}\nNumero adulti: {}\nNumero bambini: {}\nNumero neonati: {}\nEventuali note: {}".format(name, email, adults, kids, babies, notes))

        mail.send(msg1)

        msg2 = Message(subject="Matrimonio Giorgio e Benni",
                      sender=app.config.get("MAIL_USERNAME"),
                      recipients=[email],
                      body="Grazie per la tua conferma!\n\nCi vediamo al matrimonio!" +\
                              "\n\n<---- LE TUE RISPOSTE ---->\nNome e cognome: {}\nE-mail: {}\nNumero adulti: {}\nNumero bambini: {}\nNumero neonati: {}\nEventuali note: {}".format(name, email, adults, kids, babies, notes))

        mail.send(msg2)
    return 'OK'


@app.route('/send_message', methods = ['GET', 'POST'])
def send_message():
    text = request.form['text']
    with app.app_context():
        msg1 = Message(subject="Nuovo regalo ricevuto!",
                      sender=app.config.get("MAIL_USERNAME"),
                      recipients=app.config.get("MAIL_USERNAME").split(),
                      body=text)

        mail.send(msg1)
    return 'OK'


@app.route('/thanks')
def thanks():
    return render_template('thanks.html', page_title="")



@app.route('/makePhotoGallery', methods=['POST', 'GET'])
def makePhotoGallery():
    basedir = os.path.dirname(os.path.abspath(__file__))
    path = "/static/images/photogallery/"
    imglist = os.listdir(basedir + path)
    width, height = [], []
    for img in imglist:
        w, h = Image.open(basedir + path + img).size
        width.append(w)
        height.append(h)
    res = pd.DataFrame(data={"File" : imglist,
                             "W"    : width,
                             "H"    : height})
    return jsonify(res.to_json(orient='records'))


@app.route('/makeListaNozze', methods=['POST', 'GET'])
def makeListaNozze():
    basedir = os.path.dirname(os.path.abspath(__file__))
    res = pd.read_csv(basedir+"/static/images/listanozze/listanozze.csv",
            header=1, names=["File", "Nome", "Descrizione", "Costo"])
    return jsonify(res.to_json(orient='records'))


@app.route('/listanozze')
def listanozze():
    return render_template('listanozze.html', page_title=" - Lista nozze")


@app.errorhandler(404)
def page_not_found(e):
    return 'Sorry, URL not found.', 404


@app.errorhandler(500)
def application_error(e):
    return 'Sorry, unexpected error: {}'.format(e), 500



if __name__ == '__main__':
    app.run(debug=True)
