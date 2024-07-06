let currentStudentId = null;

function loadStudents() {
    $.get("/api/students", function(data) {
        let tableBody = "";
        $.each(data, function(i, student) {
            tableBody += `<tr>
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td><img src="${student.imageUrl}" width="50" height="50"></td>
                <td>${student.score}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="editStudent(${student.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteStudent(${student.id})">Delete</button>
                </td>
            </tr>`;
        });
        $("#studentTableBody").html(tableBody);
    });
}

function openAddModal() {
    currentStudentId = null;
    $("#modalTitle").text("Add Student");
    $("#studentForm")[0].reset();
    $("#studentModal").modal("show");
}

function editStudent(id) {
    currentStudentId = id;
    $("#modalTitle").text("Edit Student");
    $.get(`/api/students/${id}`, function(student) {
        $("#name").val(student.name);
        $("#imageUrl").val(student.imageUrl);
        $("#score").val(student.score);
        $("#studentModal").modal("show");
    });
}

function saveStudent() {
    let student = {
        name: $("#name").val(),
        imageUrl: $("#imageUrl").val(),
        score: parseFloat($("#score").val())
    };

    if (currentStudentId) {
        // Update existing student
        $.ajax({
            url: `/api/students/${currentStudentId}`,
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(student),
            success: function() {
                $("#studentModal").modal("hide");
                loadStudents();
            }
        });
    } else {
        // Add new student
        $.ajax({
            url: "/api/students",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(student),
            success: function() {
                $("#studentModal").modal("hide");
                loadStudents();
            }
        });
    }
}

function deleteStudent(id) {
    if(confirm("Are you sure you want to delete this student?")) {
        $.ajax({
            url: `/api/students/${id}`,
            type: "DELETE",
            success: function() {
                loadStudents();
            }
        });
    }
}

$(document).ready(function() {
    loadStudents();
});