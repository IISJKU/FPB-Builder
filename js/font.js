$(document).on("click", "#selectAll", function (e) {
    $(".fontItem").prop('checked', $(this).prop('checked'));
});