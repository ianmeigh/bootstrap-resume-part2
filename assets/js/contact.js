$("#contact-form").on("submit", function (e) {
  e.preventDefault();
  let formData = document.getElementById("contact-form").elements;
  
  emailjs.init("<PUBLIC_KEY_HERE>");

  $.when(emailjs.send("ci_resume_service", "ci_resume_template", {
    user_name: formData.fullname.value,
    message: formData.projectsummary.value,
    user_email: formData.emailaddress.value,
  })).done((response) => {
    console.log("Success!", response);
  }).fail(response => {
    console.log("Error!", response);
  });
});