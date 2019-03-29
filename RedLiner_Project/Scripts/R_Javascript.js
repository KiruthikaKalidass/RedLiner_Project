
$(document).ready(function () {
    loadData();

    $(document).on('click', 'input[type="checkbox"]', '.mycheck', function (id) {
        $('input[type="checkbox"]').not(this).prop('checked', false);
        if ($(this).is(':checked', true)) {
            getbyID(this.id);

        }
        else ($(this).is(':checked', false))
        {
            RemoveGraphics();
        }
    });
   
});
var graphicString = "";
//Load Data function
function loadData() {
    $(document).on('click', 'input[type="checkbox"]', function () {
        $('input[type="checkbox"]').not(this).prop('checked', false);
    });
    $.ajax({
        url: "/Home/List",
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            var html = '';
            $.each(result, function (key, item) {
                html += '<tr>';
                html += '<td><input type="checkbox" class="mycheck" id="' + item.ProjectID + '" style="cursor:pointer"/>'  +'</td>';
                html += '<td>' + item.Name + '</td>';
                html += '<td><a href="#" class="glyphicon glyphicon-pencil" title="Edit" onclick="return UpdatebyID(' + item.ProjectID + ')"><i class="icon-pencil icon-white"></i></a> | <a href="#" class="glyphicon glyphicon-trash"  title="Delete" onclick="Delete(' + item.ProjectID + ')"><i class="icon-pencil icon-white"></i><a></td>';
                html += '<td style="visibility:hidden;">' + item.ProjectID + '</td>';
                html += '</tr>'; 
            });
           
            $('.tbody').html(html);
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        } 
       

    });
}

//Add Data Function
function Add(JSONString) {
   
    var res = validate();
    if (res == false) {
        return false;
    }
    var Obj = {
        ProjectID: $('#ProjectID').val(),
        Name: $('#Name').val(),
        JSONString: JSONString
    };
    $.ajax({
        url: "/Home/Add",
        data: JSON.stringify(Obj),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            loadData();
            $('#myModal').modal('hide');
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}

//Function for getting the Data Based upon Project ID
function getbyID(ProjectID) {
    $('#Name').css('border-color', 'lightgrey');

    $.ajax({
        url: "/Home/getbyID/" + ProjectID,
        typr: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            $('#ProjectID').val(result.ProjectID);
            $('#Name').val(result.Name);
            graphicString = result.JSONString;
        
            var drawG = new drawGraphics();
            drawG.drawGraphic(JSON.parse(graphicString));
           
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
    return false;
}
function UpdatebyID(ProjectID) {
    $('#Name').css('border-color', 'lightgrey');

    $.ajax({
        url: "/Home/getbyID/" + ProjectID,
        typr: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            $('#ProjectID').val(result.ProjectID);
            $('#Name').val(result.Name);
            $('JSONString').val(result.JSONString);
            $('#myModal').modal('show');
            $('#btnUpdate').show();
            $('#btnAdd').hide();
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
    return false;
}
//function for updating project's record
function Update(JSONString) {
    var res = validate();
    if (res == false) {
        return false;
    }
    var Obj = {
        ProjectID: $('#ProjectID').val(),
        Name: $('#Name').val(),
        JSONString: JSONString
     
    };
    $.ajax({
        url: "/Home/Update",
        data: JSON.stringify(Obj),
        type: "POST",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            loadData();
            $('#myModal').modal('hide');
            $('#ProjectID').val("");
            $('#Name').val("");
          
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        }
    });
}
//function for deleting Project's record
function Delete(ID) {
    var ans = confirm("Are you sure you want to delete this Project?");
    if (ans) {
        $.ajax({
            url: "/Home/Delete/" + ID,
            type: "POST",
            contentType: "application/json;charset=UTF-8",
            dataType: "json",
            success: function (result) {
                loadData();
            },
            error: function (errormessage) {
                alert(errormessage.responseText);
            }
        });
    }
}
//Function for clearing the textboxes
function clearTextBox() {
    $('#ProjectID').val("");
    $('#Name').val("");
    $('#btnUpdate').hide();
    $('#btnAdd').show();
    $('#Name').css('border-color', 'lightgrey');
}
//Valdidation using jquery
function validate() {
    var isValid = true;
    if ($('#Name').val().trim() == "") {
        $('#Name').css('border-color', 'Red');
        isValid = false;
    }
    else {
        $('#Name').css('border-color', 'lightgrey');
    }

    return isValid;
}

