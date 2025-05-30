<?php ob_start() ?>

<form method="POST" action="<?= URL ?>livres/mv" enctype="multipart/form-data" class="p-4">
    <div class="form-group mb-3">
        <label for="titre">Titre :</label>
        <input type="text" class="form-control" id="titre" name="titre" value="<?= $livre->getTitre() ?>">
    </div>
    <div class="form-group mb-3">
        <label for="nbPages">Nombre de pages :</label>
        <input type="number" class="form-control" id="nbPages" name="nbPages" value="<?= $livre->getNbPages() ?>">
    </div>
    <h3>Images :</h3>
    <div class="form-group mb-3">
        <label for="image">Changer l'image :</label>
        <br>
        <input type="file" class="form-control-file" id="image" name="image">
    </div>
    <input type="hidden" name="identifiant" value="<?= $livre->getId(); ?>">
    <button type="submit" class="btn btn-primary">Valider</button>
</form>
    
<?php 
    $content = ob_get_clean();
    $titre = "Modification du livre : ".$livre->getId();
    require "views/template.view.php";
?>