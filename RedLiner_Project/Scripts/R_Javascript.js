
$(document).ready(function () {
    loadData();
});

//Load Data function
function loadData() {
    $.ajax({
        url: "/Home/List",
        type: "GET",
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        success: function (result) {
            var html = '';
            $.each(result, function (key, item) {
                html += '<tr>';
                html += '<td><input type="CheckBox" class="mycheck" id="mycheck" style="cursor:pointer"/>'+'</td>';
                html += '<td>' + item.Name + '</td>';
                html += '<td><a href="#" onclick="return getbyID(' + item.ProjectID + ')">Edit</a> | <a href="#" onclick="Delele(' + item.ProjectID + ')">Delete</a></td>';
                html += '<td style="visibility:hidden;">' + item.ProjectID + '</td>';
                html += '</tr>'; 
                $('.mycheck').on('change', function () {
                    $('.mycheck').not(this).prop('checked', false);
                });
            });
           
            $('.tbody').html(html);
        },
        error: function (errormessage) {
            alert(errormessage.responseText);
        } 
    });
}

//Add Data Function
function Add() {
    var res = validate();
    if (res == false) {
        return false;
    }
    var empObj = {
        ProjectID: $('#ProjectID').val(),
        Name: $('#Name').val()
    };
    $.ajax({
        url: "/Home/Add",
        data: JSON.stringify(empObj),
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
function getbyID(EmpID) {
    $('#Name').css('border-color', 'lightgrey');

    $.ajax({
        url: "/Home/getbyID/" + EmpID,
        typr: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (result) {
            $('#ProjectID').val(result.ProjectID);
            $('#Name').val(result.Name);
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
function Update() {
    var res = validate();
    if (res == false) {
        return false;
    }
    var empObj = {
        ProjectID: $('#ProjectID').val(),
        Name: $('#Name').val()
    };
    $.ajax({
        url: "/Home/Update",
        data: JSON.stringify(empObj),
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
function Delele(ID) {
    var ans = confirm("Are you sure you want to delete this Record?");
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
    //if ($('#Age').val().trim() == "") {
    //    $('#Age').css('border-color', 'Red');
    //    isValid = false;
    //}
    //else {
    //    $('#Age').css('border-color', 'lightgrey');
    //}
    //if ($('#State').val().trim() == "") {
    //    $('#State').css('border-color', 'Red');
    //    isValid = false;
    //}
    //else {
    //    $('#State').css('border-color', 'lightgrey');
    //}
    //if ($('#Country').val().trim() == "") {
    //    $('#Country').css('border-color', 'Red');
    //    isValid = false;
    //}
    //else {
    //    $('#Country').css('border-color', 'lightgrey');
    //}
    return isValid;
}