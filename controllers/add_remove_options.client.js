

    var answer_field = $("fieldset");

    var delete_option = $("<button type='button'>-</button>");
var count_of_answers = answer_field.children().length || 1;

function add_option(){
    var answer_field = $("fieldset");
    count_of_answers += 1;
    var option = $("<input type='text' name='answer"+count_of_answers+"'/ >");
    var del = delete_option.clone()
    del.attr("_thang", option.attr("name"));
    del.click(function(){
        remove_option(option);
    });
    answer_field.append(option);
    answer_field.append(del);
}
function remove_option(answer){
    var name = answer.attr("name");
    var th = $("[_thang='"+name+"']");
    answer.remove();
    th.remove();
}

