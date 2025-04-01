<?php 
ob_start() 
?>
 
<!-- <form method="POST" action="<?= URL ?>livres/av" enctype="multipart/form-data" padding= 50px;>
    <div class="form-group">
        <label for="titre">Titre :</label>
        <input type="text" class="form-control" id="titre" name="titre">
    </div>
    <div class="form-group">
        <label for="nbPages">Nombre de pages :</label>
        <input type="number" class="form-control" id="nbPages" name="nbPages">
    </div>
    <div class="form-group">
        <label for="image">Image :</label>
        <br>
        <input type="file" class="form-control-file" id="image" name="image">
    </div>
    <br>
    <button type="submit" class="btn btn-primary">Valider</button>
</form>     -->

<form method="POST" action="<?= URL ?>livres/av" enctype="multipart/form-data" class="p-4">
    <div class="form-group mb-3">
        <label for="titre">Titre :</label>
        <input type="text" class="form-control" id="titre" name="titre">
    </div>
    <div class="form-group mb-3">
        <label for="nbPages">Nombre de pages :</label>
        <input type="number" class="form-control" id="nbPages" name="nbPages">
    </div>
    <div class="form-group mb-3">
        <label for="image">Image :</label>
        <br>
        <input type="file" class="form-control-file" id="image" name="image">
    </div>
    <button type="submit" class="btn btn-primary">Valider</button>
</form>


<?php 
    $content = ob_get_clean();
    $titre = "Ajout d'un livre";
    require "views/template.view.php";
?>