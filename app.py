import os
from flask import Flask, render_template, url_for, jsonify, flash, get_flashed_messages, redirect, request
from flask_mail import Mail, Message
from flask_mysqldb import MySQL
import psycopg2
import pandas as pd
from PIL import Image

app = Flask(__name__, template_folder='templates', static_folder='static')


# Mail configuration
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

# DB configuration
DATABASE_URL = os.environ['DATABASE_URL']
conn = psycopg2.connect(DATABASE_URL, sslmode='require')

mysql = MySQL()
mysql.init_app(app)


#def fetch_from_DB(table):
#    cursor = conn.cursor()
#    cursor.execute("""SELECT ID, NAME, PREZZO, REGALATO FROM lista
#                      WHERE ID = {}""".format(present_id))
#    ret = cursor.fetchone()
#    cursor.close()
#    return ret

def insert_DB_invitati(infolist):
    cursor = conn.cursor()
    cursor.execute("""INSERT INTO lista_invitati
                      VALUES ('{}', '{}', '{}', '{}', {}, {}, {}, '{}')""".format(*infolist))
    conn.commit()
    cursor.close()



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
    phone = request.form['phone']
    address = request.form['address']
    adults = request.form['adults']
    kids = request.form['kids']
    babies = request.form['babies']
    notes = request.form['notes']
    info = [name, email, phone, address, adults, kids, babies, notes]
    infostring = "Nome e cognome: {}\n" + \
                 "E-mail: {}\n" + \
                 "Telefono: {}\n" + \
                 "Indirizzo: {}\n" + \
                 "Numero adulti: {}\n" + \
                 "Numero bambini: {}\n" + \
                 "Numero neonati: {}\n" + \
                 "Eventuali note: {}"

    # Database update
    insert_DB_invitati(info)

    with app.app_context():
        print("Sending message to me")
        msg1 = Message(subject="Nuovo RSVP ricevuto!",
                      sender=app.config.get("MAIL_USERNAME"),
                      recipients=app.config.get("MAIL_USERNAME").split(),
                      body=infostring.format(*info))
        mail.send(msg1)

        print("Sending message to person")
        msg2 = Message(subject="Matrimonio Giorgio e Benni",
                      sender=app.config.get("MAIL_USERNAME"),
                      recipients=[email],
                      body="Grazie per la tua conferma!\n\nCi vediamo al matrimonio!\n\n" +
                           "Giorgio e Benni <3\n\n" +
                           "\n\n<------  LE TUE RISPOSTE  ------>\n"+infostring.format(*info))
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

        #msg2 = Message(subject="Grazie!",
        #              sender=app.config.get("MAIL_USERNAME"),
        #              recipients=[email],
        #              body="Grazie per il tuo regalo!\n\nCi vediamo al matrimonio!")
        #mail.send(msg2)
    return 'OK'


@app.route('/thanks')
def thanks():
    return render_template('thanks.html', page_title="")



@app.route('/makePhotoGallery', methods=['POST', 'GET'])
def makePhotoGallery():
    basedir = os.path.dirname(os.path.abspath(__file__))
    path = "/static/images/photogallery/"
    imglist = os.listdir(basedir + path)
    imglist.sort()
    print(imglist)
    width, height = [], []
    for img in imglist:
        print("Opening image ", img)
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
            sep=",", header=0, names=["File", "Nome", "Descrizione", "Costo"])
    print(res)
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
