$(function () {
    $('#contact-form').submit(function(e){
        
        e.preventDefault();
        $('.comments').empty();
        var postdata = $('#contact-form').serialize();

        $.ajax({
            type: 'POST',
            url: 'php/contact.php',
            data: postdata,
            dataType: 'json',
            success: function(result){
                if (result.isSuccess)
                    {
                        $("#contact-form").append("<p class='thank-you'> Votre demande a bien été envoyer. Merci de m'avoir contacté </p>");
                        $("#contact-form")[0].reset();
                    }
                else
                {
                    $("#firstname + .comments").html(result.firstnameError);
                    $("#name + .comments").html(result.nameError);
                    $("#email + .comments").html(result.emailError);
                    $("#phone + .comments").html(result.phoneError);
                    $("#message + .comments").html(result.messageError);
                }
            }
        });
    }); 
})