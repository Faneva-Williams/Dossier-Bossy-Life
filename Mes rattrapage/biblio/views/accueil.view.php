<?php ob_start() ?>
 
    Jolamboto aby n eto oooh

<?php 
    $content = ob_get_clean();
    $titre = "Bibliothèque MGA";
    require "views/template.view.php";
?>