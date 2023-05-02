function adjustPasswordInputWidth(password) {
  const passwordInput = document.getElementById("password");
  const characterWidth = 10;
  const padding = 20;
  passwordInput.style.width = `${password.length * characterWidth + padding}px`;
}

document.getElementById("password-length").addEventListener("input", () => {
  const passwordLength = document.getElementById("password-length").value;
  document.getElementById("password-length-display").innerText = passwordLength;
});

document.getElementById("generate-password").addEventListener("click", async () => {
  const passwordLength = parseInt(document.getElementById("password-length").value, 10);
  const includeUppercase = document.getElementById("include-uppercase").checked;
  const includeLowercase = document.getElementById("include-lowercase").checked;
  const includeNumbers = document.getElementById("include-numbers").checked;
  const includeSymbols = document.getElementById("include-symbols").checked;

  const response = await fetch('/api/generate-password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      password_length: passwordLength,
      include_uppercase: includeUppercase,
      include_lowercase: includeLowercase,
      include_numbers: includeNumbers,
      include_symbols: includeSymbols,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    const password = data.password;

    document.getElementById("password").value = password;
    adjustPasswordInputWidth(password);

    updatePasswordStrengthMeter(password);
  } else {
    // Handle errors, e.g. show a message to the user
    console.error('Error generating password');
  }
});


document.getElementById("copy-password").addEventListener("click", () => {
  const passwordInput = document.getElementById("password");
  passwordInput.select();
  document.execCommand("copy");
  showCopiedAnimation();
});

function showCopiedAnimation() {
  const copiedAlert = document.getElementById("copy-message");
  copiedAlert.style.opacity = '1';
  copiedAlert.style.transform = 'translateY(-5px)';
  setTimeout(() => {
    copiedAlert.style.opacity = '0';
    copiedAlert.style.transform = 'translateY(0)';
  }, 2000);
}



function calculatePasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  return score;
}

function updatePasswordStrengthMeter(password) {
  const passwordStrengthScore = calculatePasswordStrength(password);
  const passwordStrengthBar = document.getElementById("password-strength-bar");

  const colors = ["#f44336", "#ff5722", "#ff9800", "#ffeb3b", "#8bc34a"];
  const widths = ["20%", "40%", "60%", "80%", "100%"];

  if (passwordStrengthScore === 0) {
    passwordStrengthBar.style.backgroundColor = 'transparent';
    passwordStrengthBar.style.width = '0%';
  } else {
    passwordStrengthBar.style.backgroundColor = colors[passwordStrengthScore - 1];
    passwordStrengthBar.style.width = widths[passwordStrengthScore - 1];
  }
}

