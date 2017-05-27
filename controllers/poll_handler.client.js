  $(document).ready(function(){
    var newOption = $("button#new_option");
    var newOptionText = $("#new_option_text");

    newOption.click(function(){
        $.ajax({
            type: "PUT",
            url:"",
            data: {option: newOptionText.val()},
            success: function(){
                alert("done");
                window.location.href="";
            },
            complete: function(e) {
                console.log(e);
            }
        })
    })
  })

