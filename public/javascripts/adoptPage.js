//When animal choice drop down is changed, automatically updates picture of animal
$(document).ready(function(){
    $("#animaladopting").on('change', function(){
        var animalName = $(this).val();
        $("#animalImage").attr('src','images/' + animalName + '.png');
    });
})