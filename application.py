from cs50 import SQL
from flask import Flask, flash, redirect, render_template, request, session, url_for, json
from flask import Flask, jsonify, render_template, request, url_for
from flask_jsglue import JSGlue
from flask_session import Session
from passlib.apps import custom_app_context as pwd_context
from tempfile import gettempdir
from helpers import *

# configure application
app = Flask(__name__)

# ensure responses aren't cached
if app.config["DEBUG"]:
    @app.after_request
    def after_request(response):
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Expires"] = 0
        response.headers["Pragma"] = "no-cache"
        return response

# custom filter
app.jinja_env.filters["usd"] = usd

# configure session to use filesystem (instead of signed cookies)
app.config["SESSION_FILE_DIR"] = gettempdir()
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

# configure CS50 Library to use SQLite database
db = SQL("sqlite:///finance.db")


@app.route("/")
@login_required
def index():
    if session:
        userid = session["user_id"]
        sume = db.execute('SELECT  SUM (summ)  FROM stockss WHERE user_id=:ph',
                          ph=userid)[0]['SUM (summ)']

        summ_check = db.execute(' SELECT cash FROM users WHERE id=:plholr',
                                plholr=userid)[0]['cash']
        '''
        if sume==summ_check:
            print("OK")
        else:
            print("bad")
        <td>{{stock.summ | usd}}</td><td>{{stock.descr}}</td><td>{{stock.comment}}</td><td>{{stock.tranfere_date  }}</td>
        '''
        hystorytable = db.execute('SELECT summ, descr, comment, tranfere_date FROM stockss where user_id=:ph ORDER BY tranfere_date DESC LIMIT 10',
                                  ph=session["user_id"])
        return render_template("index.html", sum=summ_check, hystorytable=hystorytable)
    else:
        return render_template("login.html")


@app.route("/spending", methods=["GET", "POST"])
@login_required
def spending():
    return render_template("spending.html")


@app.route("/spending_m", methods=["GET", "POST"])
@login_required
def spending_m():

    revs = request.form['v1']  # type of spended money
    cashres = request.form['v2']  # spended summ
    come = request.form['v3']  # comments
    sum = -float(cashres)

    availablecash = db.execute(' SELECT cash FROM users WHERE id=:plholr',
                               plholr=session["user_id"])[0]['cash']

    cashaftertransaction = availablecash + sum
    db.execute(' INSERT INTO stockss  (user_id, summ, descr, comment) VALUES(:user_id, :summ, :descr, :comment) ',
               user_id=session["user_id"],
               summ=sum,
               descr=revs,
               comment=come)

    db.execute('UPDATE users SET cash=:cash WHERE id=:id',
               cash=cashaftertransaction,
               id=session["user_id"])

    return jsonify(haha=cashres, gg=revs)


@app.route("/revenue", methods=["GET", "POST"])
@login_required
def revenue():

    return render_template("revenue.html")


@app.route("/revenue_add", methods=["GET", "POST"])
@login_required
def revenue_add():

    revs = request.form['v1']  # type of received money
    cashres = request.form['v2']  # receiced summ
    come = request.form['v3']  # comments
    sum = float(cashres)

    availablecash = db.execute(' SELECT cash FROM users WHERE id=:plholr',
                               plholr=session["user_id"])[0]['cash']

    cashaftertransaction = availablecash + sum
    db.execute(' INSERT INTO stockss  (user_id, summ, descr, comment) VALUES(:user_id, :summ, :descr, :comment) ',
               user_id=session["user_id"],
               summ=sum,
               descr=revs,
               comment=come)

    db.execute('UPDATE users SET cash=:cash WHERE id=:id',
               cash=cashaftertransaction,
               id=session["user_id"])

    return jsonify(haha=cashres, gg=revs)


@app.route("/history")
@login_required
def history():
    """Show history of transactions."""
    hystorytable = db.execute('SELECT * FROM stockss where user_id=:ph ORDER BY tranfere_date DESC',
                              ph=session["user_id"])

    return render_template("history.html", hystorytable=hystorytable)


@app.route("/login", methods=["GET", "POST"])
def login():
    """Log user in."""

    # forget any user_id
    session.clear()

    # if user reached route via POST (as by submitting a form via POST)
    if request.method == "POST":

        lg = request.form['v1']  # login
        psw = request.form['v2']  # pass

        # query database for username
        rows = db.execute("SELECT * FROM users WHERE username = :username",
                          username=lg)

        # ensure username exists and password is correct
        if len(rows) != 1 or not pwd_context.verify(psw, rows[0]["hash"]):
            return 0

        # remember which user has logged in
        session["user_id"] = rows[0]["id"]

        # redirect user to home page
        return redirect(url_for("index"))

    # else if user reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("login.html")


@app.route("/logout")
def logout():
    """Log user out."""

    # forget any user_id
    session.clear()

    # redirect user to login form
    return redirect(url_for("login"))


@app.route("/register", methods=["GET", "POST"])
def register():
    """Register user."""

    # forget any user_id
    session.clear()

    # if user reached route via POST (as by submitting a form via POST)
    if request.method == "POST":
        lg = request.form['v1']  # login
        psw = request.form['v2']  # pass
        rows = db.execute("SELECT * FROM users WHERE username = :username", username=lg)

        # ensure username exists
        if len(rows) == 1:
            return jsonify(un=lg, pw=psw)
        else:
            hash = pwd_context.hash(psw)
            db.execute("INSERT INTO users  (username, hash, cash) VALUES(:username, :hash, :cash)",
                       username=lg,
                       hash=hash,
                       cash=0)
            rows = db.execute("SELECT * FROM users WHERE username = :username", username=lg)

            # remember which user has logged in
            session["user_id"] = rows[0]["id"]

            # redirect user to home page
            return jsonify()

    # else if user reached route via GET (as by clicking a link or via redirect)
    else:
        return render_template("register.html")


@app.route("/select_quantity", methods=["POST"])
@login_required
def select_quantity():
    userid = session["user_id"]

    sq = request.form['sq']  # quantity of rows
    datestart = request.form['dateb']  # start of queried period

    dateend = request.form['datee']  # end of queried period

    summ_check = db.execute(' SELECT cash FROM users WHERE id=:plholr',
                            plholr=userid)[0]['cash']

    if sq == "all":

        hystorytable = db.execute('SELECT summ, descr, comment, tranfere_date  FROM stockss where user_id=:ph ORDER BY tranfere_date DESC',
                                  ph=userid)
        return render_template("table_operations.html", hystorytable=hystorytable)
    elif datestart == "datebfake":
        hystorytable = db.execute('SELECT summ, descr, comment, tranfere_date  FROM stockss where user_id=:ph ORDER BY tranfere_date DESC LIMIT :limits',
                                  ph=userid,
                                  limits=sq)

        return render_template("table_operations.html", hystorytable=hystorytable)
    else:

        # hystorytable=db.execute('SELECT summ, descr, comment, tranfere_date  FROM stockss where user_id=:ph ORDER BY tranfere_date DESC',
        #    ph=userid)

        hystorytable = db.execute('SELECT summ, descr, comment, tranfere_date  FROM stockss where user_id=:ph AND tranfere_date BETWEEN DATE(:datestart) AND DATE(:dateend) ORDER BY tranfere_date DESC',
                                  ph=userid,
                                  datestart=datestart,
                                  dateend=dateend)

        return render_template("table_operations.html", hystorytable=hystorytable)