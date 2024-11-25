"use strict";

var KTSigninGeneral = (function () {
    var formElement, submitButton, formValidator;

    return {
        init: function () {
            // Form ve buton elementlerini seç
            formElement = document.querySelector("#kt_sign_in_form");
            submitButton = document.querySelector("#kt_sign_in_submit");

            // Form doğrulama işlemleri
            formValidator = FormValidation.formValidation(formElement, {
                fields: {
                    email: {
                        validators: {
                            regexp: {
                                regexp: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                message: "The value is not a valid email address",
                            },
                            notEmpty: {
                                message: "Email address is required",
                            },
                        },
                    },
                    password: {
                        validators: {
                            notEmpty: {
                                message: "The password is required",
                            },
                        },
                    },
                },
                plugins: {
                    trigger: new FormValidation.plugins.Trigger(),
                    bootstrap: new FormValidation.plugins.Bootstrap5({
                        rowSelector: ".fv-row",
                        eleInvalidClass: "",
                        eleValidClass: "",
                    }),
                },
            });

            // Formun action URL'sini kontrol et
            var isUrlValid = (function (url) {
                try {
                    return new URL(url), true;
                } catch {
                    return false;
                }
            })(submitButton.closest("form").getAttribute("action"));

            // Eğer URL geçerli değilse
            if (!isUrlValid) {
                submitButton.addEventListener("click", function (e) {
                    e.preventDefault();
                    handleFormValidation();
                });
            } else {
                submitButton.addEventListener("click", function (e) {
                    e.preventDefault();
                    handleAjaxSubmission();
                });
            }

            // Form doğrulama işlemi
            function handleFormValidation() {
                formValidator.validate().then(function (status) {
                    if (status === "Valid") {
                        handleSuccess();
                    } else {
                        handleError();
                    }
                });
            }

            // Formun AJAX ile gönderimi
            function handleAjaxSubmission() {
                formValidator.validate().then(function (status) {
                    if (status === "Valid") {
                        submitButton.setAttribute("data-kt-indicator", "on");
                        submitButton.disabled = true;

                        axios
                            .post(
                                submitButton.closest("form").getAttribute("action"),
                                new FormData(formElement)
                            )
                            .then(function (response) {
                                if (response) {
                                    formElement.reset();
                                    handleSuccess();
                                } else {
                                    handleError("The email or password is incorrect");
                                }
                            })
                            .catch(function () {
                                handleError();
                            })
                            .finally(function () {
                                submitButton.removeAttribute("data-kt-indicator");
                                submitButton.disabled = false;
                            });
                    } else {
                        handleError();
                    }
                });
            }

            // Başarılı işlem mesajı
            function handleSuccess() {
                Swal.fire({
                    text: "You have successfully logged in!",
                    icon: "success",
                    buttonsStyling: false,
                    confirmButtonText: "Ok, got it!",
                    customClass: {
                        confirmButton: "btn btn-primary",
                    },
                }).then(function (result) {
                    if (result.isConfirmed) {
                        formElement.querySelector('[name="email"]').value = "";
                        formElement.querySelector('[name="password"]').value = "";

                        var redirectUrl = formElement.getAttribute("data-kt-redirect-url");
                        if (redirectUrl) {
                            location.href = redirectUrl;
                        }
                    }
                });
            }

            // Hatalı işlem mesajı
            function handleError(message) {
                Swal.fire({
                    text: message || "Sorry, looks like there are some errors detected, please try again.",
                    icon: "error",
                    buttonsStyling: false,
                    confirmButtonText: "Ok, got it!",
                    customClass: {
                        confirmButton: "btn btn-primary",
                    },
                });
            }
        },
    };
})();

// DOM yüklendiğinde form doğrulama işlemini başlat
KTUtil.onDOMContentLoaded(function () {
    KTSigninGeneral.init();
});
