(function () {
    var alertService = {
        showAlert: showAlert,
        success: success,
        info: info,
        warning: warning,
        error: error
    }

    window.alerts = alertService;

    var alertContainer = $(".alert-container");

    var template = _.template("<div class='alert <%= alertClass %> alert-dismissable alert-fixed'>" +
		"<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>&times;</button>" +
		"<%= message %>" +
		"</div>");

    function showAlert(alert) {
        //var alertElement = $(template(alert));
        //alertContainer.append(alertElement);

        //window.setTimeout(function () {
        //    alertElement.fadeOut();
        //}, 5000);
    }

    function success(message) {
        //showAlert({ alertClass: "alert-success", message: '<strong>Success!</strong>  ' + message });
    }

    function info(message) {
        //showAlert({ alertClass: "alert-info", message: '<strong>Info</strong>  ' + message });
    }

    function warning(message) {
        //showAlert({ alertClass: "alert-warning", message: '<strong>Warning</strong>  ' + message });
    }

    function error(message) {
        //showAlert({ alertClass: "alert-danger", message: '<strong>Error</strong>  ' + message });
    }

    window.onerror = function (msg) {
        //if (window.alerts) {
        //    window.alerts.error("There was a problem with your last action.  Please reload the page, then try again.");
        //} else {
        //    alert("Something serious went wrong.  Please close, then try again.");
        //}
    };
})();