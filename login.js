$("#signIn").click(function () {
    var email = $("#email").val();
    var password = $("#pwd1").val();

    if (email == '' || password == '') {
        swal({
            icon: 'error',
            title: 'Error',
            text: 'Please enter both email and password',
            button: "OK",
        });
    } else if (email == 'sohamchakraborty365@gmail.com' && password == 'soham123') {
        swal("Success!", "Thank you for logging in", "success").then(function () {
            window.location = "meme.html";
        });
    } else {
        swal("Error!", "Invalid email or password", "error");
    }
});