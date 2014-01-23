<?php
session_start();

$userinfo = array(
                'i'=>'i',
                'estenda'=>'123'
                );

if(isset($_GET['logout'])) {
    $_SESSION['username'] = '';
    header('Location:  ' . $_SERVER['PHP_SELF']);
}

if(isset($_POST['username']) && isset($_POST['password'])) {
    if($userinfo[$_POST['username']] == $userinfo[$_POST['password']]) {
        $_SESSION['username'] = $_POST['username'];
    }else {
        print("<div id='failed'><b>You shall not pass!</b><br />username: estenda<br> password: 123<br> <a href='http://codyhagg.com/estenda/index.php'>try again</a></div>");
    }
}
?>
<!DOCTYPE html>
  <head>
    <meta charset="utf-8">
    <title>Estenda your friends</title>
    <link rel="stylesheet" href="css/base.css">
    <link rel="stylesheet" href="css/skeleton.css">
    <link rel="stylesheet" href="css/style.css">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>

  </head>

  <body>
    <div id='contactLogin'>
      <form name="login" action="" method="post">
        <h3>Login</h3>
          <label for="username">User: </label><input type="text" name="username" value="" /><br />
          <label for="username">Password:  </label><input type="password" name="password" value="" /><br />
          <input type="submit" name="submit" value="Submit" id="submit"/>
      </form>
    </div>
   
    <?php if($_SESSION['username']): ?>
        <p id="loginStatus">You are logged in as <?=$_SESSION['username']?> | <a href="?logout=1">Logout</a></p>            
    <?php endif; ?>

    
    <?php if($_SESSION['username']): ?>
         <div class="container">
    <div id="topContent">
      <h1>Friends</h1>
      <button id="add">Add a friend.</button>
    </div>

    <div id="contacts">
    <div id="lightbox"></div>
      <form id="addContact" action="#">
        <h3>Add a friend.</h3>
        <div>
          <!-- <label for="image">Image: </label><input id="image" type="file" /> -->
          <label for="name">name: </label><input id="name" type="text" />
          <label for="phone">phone: </label><input id="phone" type="text" />
          <label for="email">email: </label><input id="email" type="text" />
          <label for="notes">notes: </label><input id="notes" type="text" />
          <button id="cancel">Cancel</button>
          <button id="ok">Ok</button>
        </div>
      </form>    
    </div>
    <form id="editContact" action="#">
      <h3>Edit this friend.</h3>
      <div>
        <!-- <label for="image">Image: </label><input id="image" type="file" /> -->
        <label for="name">name: </label><input id="name" type="text" value="Type some text" onfocus="value=''"/>
        <label for="phone">phone: </label><input id="phone" type="text" />
        <label for="email">email: </label><input id="email" type="text" />
        <label for="notes">notes: </label><input id="notes" type="text" />
        <button id="cancel">Cancel</button>
        <button id="editOk">Ok</button>
      </div>
    </form>    

    </div> <!-- end container -->
    <!-- people template -->
    <script id="contactTemplate" type="text/template">
        <img src="<%= image %>"/>
        <ul>
            <li><b><%= name%></b></li>
            <li>&#9742;: <%= phone%></li>
            <li> &#9993; : <%= email%></li>
            <li>&#9998; : <%= notes%></li>
        </ul>
        <div class="delete">Delete</div>
        <div class="edit">Edit</div>
    </script>
    
    <script src="js/jquery.js"></script>
    <script src="js/underscore.js"></script>
    <script src="js/backbone.js"></script>
    <script src="js/backbone.localStorage.js"></script>
    <script src="js/app.js"></script>
    <script>
    $( document ).ready(function() {
        $('#contactLogin').remove();        
    });
        <?php endif; ?>
    </script>


</body>
</html>
