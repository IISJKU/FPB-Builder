// add change event on publication languages option
$(document).on('change', '#publicationLanguage', function(e) {
    sessionStorage.setItem("pubLang", JSON.stringify($('#publicationLanguage').val()));
});
  