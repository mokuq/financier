//calendar
$(function()
    {
        var calendar = new flatpickr("#TIME", {

        });

        $("#TIME").change(function(){
            var arr = calender.selectedDates();
            console.log(arr);
        });
    });
$(function()
    {
        var calendar = new flatpickr("#TIME2", {

        });

        $("#TIME2").change(function(){
            var arr = calender.selectedDates();
            console.log(arr);
        });
    });

var revs =`<select style="width:250px;" class="form-control" name="source" id="source"  onChange='return StatusSelectRev();'>
        			<option value="" class="disabled">Choose source of revenue</option>
        			<option value="Salary">Salary</option>
        			<option value="Bank interest">Bank interest</option>
        			<option value="Other">Other</option>
        			<option value="newsourse">Enter new sourse</option>
            </select>`

var spes=`<select style="width:250px;" class="form-control" name="type_sp" id="type_sp" onChange='return StatusSelectSp();'>
    			<option value="" class="disabled">Choose type of costs</option>
    			<option value="Food">Food</option>
    			<option value="Restaurant">Restaurant</option>
    			<option value="Transport">Transport</option>
    			<option value="Vacation">Vacation</option>
    			<option value="Auto">Auto</option>
    			<option value="Helth">Helth</option>
    			<option value="newsourse">Enter new type</option>
            </select>`

function StatusSelectRev()
    {

        if($('#source').val() == 'newsourse')
            {
                $('#newsrc').html('<p> <input style="width:250px;" autofocus class="form-control" name="source" id="source" placeholder="Enter new sourse" type="text"></p>');
            }
    }

function StatusSelectSp()
    {

        if($('#type_sp').val() == 'newsourse')
            {
                $('#newsrc').html('<p> <input style="width:250px;" autofocus class="form-control" name="source" id="type_sp" placeholder="Enter new type" type="text"></p>');
            }
    }

function check_rev ()
    {


        $( ".body_div" ).empty();

        if ( $('#source').val()  == 0 )
        {
            $('#myDiv').html( "<p>Please choose source of revenue</p>") ;
        }
        else if ( $('#cash_received').val () == "" )
        {
            $('#myDiv').html( "<p>Please enter a sum of revenue</p>");

        }
        else
        {
            var aj = new XMLHttpRequest();
            aj.onreadystatechange = function()
            {
                if (aj.readyState == 4)
                {
                    if (aj.status != 200)
                    {
                        $('#myDiv').html("<p>something wrong 3 </p>");
                    }
                    else
                    {
                        //var response = JSON.parse(aj.responseText)
                        $('#myDiv').html( 'Database was updraded '); //+response.haha+' received '+response.gg
                        $('form[name="forma_re"]')[0].reset();
                        $('#newsrc').html(revs);
                        //document.forms['forma_re'].reset();
                    }
                }
            };

            aj.open('POST', '/revenue_add');
            aj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            var sr = $('#source').val();
            var cr = $('#cash_received').val();
            var com = $('#comments').val();
            var postVars = 'v1='+sr+'&v2='+cr+'&v3='+com;
            aj.send(postVars);
            return false;
        }
    }

function check_sp ()
    {


        $( ".body_div" ).empty();

        if (  $('#type_sp').val() == "" )
        {
            document.getElementById('myDiv').innerHTML = "<p>Please choose type of spending</p>" ;
        }
        else if ( document.forma_sp.cash_spended.value == "" )
        {
            document.getElementById('myDiv').innerHTML = "<p>Please enter spended summ</p>";

        }
        else
        {
            var aj = new XMLHttpRequest();
            aj.onreadystatechange = function()
            {
                if (aj.readyState == 4)
                {
                    if (aj.status != 200)
                    {
                        document.getElementById('myDiv').innerHTML = "something wrong 4";
                    }
                    else
                    {
                        //var response = JSON.parse(aj.responseText)
                        document.getElementById('myDiv').innerHTML = 'Database was updraded ';//+response.haha+' spended '+response.gg
                        document.forms['forma_sp'].reset();
                        document.getElementById('newsrc').innerHTML = spes;

                    }
                }
            };

            aj.open('POST', '/spending_m');
            aj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            var sr = $('#type_sp').val();
            var cr = $('#cash_spended').val();
            var com = $('#comments').val();
            var postVars = 'v1='+sr+'&v2='+cr+'&v3='+com;
            aj.send(postVars);
            return false;
        }
    }

function check_log ()
    {

        if ( $('#username').val()  == "" )
        {
            $('#myDiv').html( "<p>Please enter user name</p>") ;
        }
        else if ( $('#password').val () == "" )
        {
            $('#myDiv').html( "<p>Please enter your password</p>");

        }
        else
        {
            var aj = new XMLHttpRequest();
            aj.onreadystatechange = function()
            {
                if (aj.readyState == 4)
                {
                    if (aj.status != 200)
                    {
                        $('#myDiv').html("<p>You entered invalidd user name or password, please try again. </p>");
                    }
                    else
                    {
                        $('#myDiv').html( 'You were successfully logged in. Please wait a redirection');
                        window.location.replace ("/");

                    }
                }
            };

            aj.open('POST', '/login');
            aj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            var sr = $('#username').val();
            var cr = $('#password').val();
            var postVars = 'v1='+sr+'&v2='+cr;
            aj.send(postVars);
            return false;
        }
    }

function check_reg ()
    {

        if ( $('#username').val()  == "" )
        {
            $('#myDiv').html( "<p>Please enter user name</p>") ;
        }
        else if ( $('#password').val () == "" )
        {
            $('#myDiv').html( "<p>Please enter your password</p>");

        }
        else if ( $('#password').val () != $('#confirmation').val () )
        {
            $('#myDiv').html( "<p>Password and password confirmation  do not match</p>");
        }
        else
        {
            var aj = new XMLHttpRequest();
            aj.onreadystatechange = function()
            {
                if (aj.readyState == 4)
                {
                    if (aj.status != 200)
                    {
                        $('#myDiv').html("<p>Something wrong 1 </p>");
                    }
                    else
                    {
                        var response = JSON.parse(aj.responseText);
                        if (response.un==$('#username').val() )
                        {
                            $('#myDiv').html( 'Username is exists');
                        }
                        else
                        {
                            $('#myDiv').html( 'You were successfully registered. Please wait a redirection');
                            window.location.replace ("/");
                        }
                    }
                }
            };

            aj.open('POST', '/register');
            aj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            var sr = $('#username').val();
            var cr = $('#password').val();
            var postVars = 'v1='+sr+'&v2='+cr;
            aj.send(postVars);
            return false;
        }
    }

/*
//catching enter on  input form of login
$(document).ready(function() {
  $('#username').keydown(function(e) {
    if(e.keyCode === 13) {
      return check_log ();
    }
  });
});

//catching enter on  password form of login
$(document).ready(function() {
  $('#password').keydown(function(e) {
    if(e.keyCode === 13) {
      return check_log ();
    }
  });
});
*/

function select_quantity  ()
    {
        $('#calendar_error').empty();
        var aj = new XMLHttpRequest();
        aj.onreadystatechange = function()
            {
                if (aj.readyState == 4)
                {
                    if (aj.status != 200)
                    {
                        $('#myDiv').html("<h1><p>Something wrong 2 </p></h1>");
                    }
                    else
                    {

                        //var rendered_table=aj.responseText;
                        $('#history_table').html(aj.responseText);


                    }
                }
            };

        aj.open('POST', '/select_quantity');
        aj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        var sq = $('#quantity_rows').val();

        var dateb = $('#TIME').val();
        var datee = $('#TIME2').val();
        var d1 = new Date (dateb);
        var d2 = new Date (datee);

        if (sq ===undefined)
            {

                if ((dateb=="") || (datee==""))
                    {

                        return false;
                    }
                else

                    if (d2<d1)
                        {
                           $('#calendar_error').html("End date have to be greater then start");
                           return false;

                        }

                    else

                        {
                            var postVars = 'dateb='+dateb+'&datee='+datee+'&sq='+"datez";

                        }
            }
        else
            {
                var postVars = 'sq='+sq+'&dateb='+"datebfake"+'&datee='+"dateefake"+'&sq=';
            }

        aj.send(postVars);

        return false;

    }