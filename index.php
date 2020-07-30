<?php
session_start();

if (isset($_GET['login'])) {
    $_SESSION['userLoggedIn'] = true;
}

if (isset($_GET['admin'])) {
    $_SESSION['userIsAdmin'] = true;
}

if (isset($_GET['logout'])) {
    $_SESSION['userLoggedIn'] = false;
    $_SESSION['userIsAdmin'] = false;
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Développeur Freelance à votre service !">


    <title>Three JS Navbar</title>
    <link rel="stylesheet" href="./style.css">
    <link rel="dns-prefetch" href="https://fonts.googleapis.com">
    <link rel="dns-prefetch" href="https://threejs.org">
</head>
<body>
    <div id="sizeWindow"></div>
    <canvas id="globalContainer"></canvas>
    <header>
        <nav>
            <a title="Accueil" class="container3d" id="homeContainer" href="./index.php"></a>
            
            <?php if (isset($_SESSION['userIsAdmin']) && $_SESSION['userIsAdmin']) { ?>

            <a title="Panneau d'administration" class="container3d" id="adminPanelContainer" href="./index.php"></a>

            <?php } ?>

            <?php if (isset($_SESSION['userIsLoggedIn']) && $_SESSION['userIsLoggedIn']) { ?>

            <a title="Connexion Admin" class="container3d" id="adminLoginContainer" href="./index.php?admin=true"></a>
            <a title="Se déconnecter" class="container3d" id="logoutContainer" href="./index.php?logout=true"></a>

            <?php } else {?>

            <a title="Se connecter" class="container3d" id="loginContainer" href="./index.php?login=true"></a>

            <?php } ?>
        </nav>
    </header>

    <main>
        <p>Cliquez sur la clé pour simuler une connexion ...</p>
    </main>
    
    <script src="./app.js" type="module">
    </script>
</body>
</html>