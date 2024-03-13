const bootstrap = require('./bower_components/bootstrap/dist/js/bootstrap.bundle.js');

var triggerTabList = [].slice.call(document.querySelectorAll('#listTab a'))
triggerTabList.forEach(function (triggerEl) {
    var tabTrigger = new bootstrap.Tab(triggerEl)

    triggerEl.addEventListener('click', function (event) {
        event.preventDefault()
        tabTrigger.show()
    })
})