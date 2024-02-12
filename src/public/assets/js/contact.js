/**	CONTACT FORM
*************************************************** **/
const CONTACT_FORM_URL = "http://localhost:3004/contact"; // Update the URL to match your server endpoint
const CONTACT_FORM = document.getElementById('contact-form');
const CONTACT_FIELDS = ['fullname', 'email', 'phone', 'company_name', 'project_name', 'project_desc', 'department', 'message']
  .map(field => document.querySelector(`[name="${field}"]`));

CONTACT_FIELDS.forEach(field => {
  field.addEventListener('input', () => field.classList.remove('is-invalid'));
});

CONTACT_FORM.addEventListener("submit", async (e) => {
  e.preventDefault();

  const DATA = Object.fromEntries(CONTACT_FIELDS.map(field => [field.name, field.value]));

  try {
    const RESPONSE = await fetch(CONTACT_FORM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(DATA),
    });
    if (RESPONSE.ok) {
      $("#alert_success").show(); // Show success alert
      $("#alert_failed").hide(); // Hide failed alert if it's shown
    } else {
      $("#alert_failed").show(); // Show failed alert
      $("#alert_success").hide(); // Hide success alert if it's shown
    }
    console.log("Success:", RESPONSE);
  } catch (error) {
    $("#alert_failed").show(); // Show failed alert
    console.error("Error:", error);
  }
});

const hash = window.location.hash;
if (hash) {
  jQuery(hash).show();
}