// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
const stripe = Stripe("pk_test_51NTGMgAD16dsBsnGlXKRXyVAGDO3LjzvW1oL6w3uPryK5OS2t52KOv45rWxlI3YkfcCbZ1x5XEvEfznLvpdgcNDF00cBVAmUy4");

// The items the customer wants to buy
const items = [{ id: "xl-tshirt" }];

let elements;
let emailAddress = '';
initialize();
checkStatus();

document.querySelector("#payment-form").addEventListener("submit", handleSubmit);

// Fetches a payment intent and captures the client secret
async function initialize() {
  const response = await fetch("/tutor/create-payment-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  const { clientSecret } = await response.json();

  const appearance = {
    theme: 'stripe',
  };
  elements = stripe.elements({ appearance, clientSecret });

  const linkAuthenticationElement = elements.create("linkAuthentication");
  linkAuthenticationElement.mount("#link-authentication-element");

  linkAuthenticationElement.on('change', (event) => {
    emailAddress = event.value.email;
  });

  const paymentElementOptions = {
    layout: "tabs",
  };

  const paymentElement = elements.create("payment", paymentElementOptions);
  paymentElement.mount("#payment-element");
}

function handleSubmit(event) {
  event.preventDefault();

  // Get the amount value from the input field
  const amountInput = document.querySelector("#amount");
  const amount = amountInput.value;

  // Include the amount in the body of the request
  const requestBody = { items, amount };

  fetch("/tutor/create-payment-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  })
    .then((response) => response.json())
    .then((data) => {
      // Handle the response data
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}


async function handleSubmit(e) {
  e.preventDefault();
  setLoading(true);

  const { error } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      // Make sure to change this to your payment completion page
      return_url: "http://localhost:3000/tutor/checkout.html",
      receipt_email: emailAddress,
    },
  });

  // This point will only be reached if there is an immediate error when
  // confirming the payment. Otherwise, your customer will be redirected to
  // your `return_url`. For some payment methods like iDEAL, your customer will
  // be redirected to an intermediate site first to authorize the payment, then
  // redirected to the `return_url`.
  if (error.type === "card_error" || error.type === "validation_error") {
    showMessage(error.message);
  } else {
    showMessage("An unexpected error occurred.");
  }

  setLoading(false);
}

// Fetches the payment intent status after payment submission
async function checkStatus() {
  const clientSecret = new URLSearchParams(window.location.search).get(
    "payment_intent_client_secret"
  );

  if (!clientSecret) {
    return;
  }

  const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

  switch (paymentIntent.status) {
    case "succeeded":
        showMessage("Nạp tiền hoàn tất, Tự động chuyển hướng về trang chủ!");
        // Tạo một async function để thực hiện fetch request
        setTimeout(function() {
            window.location.href = "/tutor/profile";
        }, 2000);  
        break;
    case "processing":
      showMessage("Yêu cầu nạp tiền đang chờ xử lí.");
      break;
    case "requires_payment_method":
      showMessage("Giao dịch không thành công, vui lòng thử lại.");
      break;
    default:
      showMessage("Đã xảy ra sự cố.");
      break;
  }
}

// ------- UI helpers -------

function showMessage(messageText) {
  const messageContainer = document.querySelector("#payment-message");

  messageContainer.classList.remove("hidden");
  messageContainer.textContent = messageText;

  setTimeout(function () {
    messageContainer.classList.add("hidden");
    messageContainer.textContent = "";
  }, 4000);
}

// Show a spinner on payment submission
function setLoading(isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector("#submit").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("#submit").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
}

// const postPayment = async () => {
//   try {
//   await fetch('/tutor/payment', {
//       method: 'POST',
//       headers: {
//       'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ message: 'success' })
//   });

//   } catch (error) {
//   console.error('Lỗi khi gửi dữ liệu: ', error);
//   }
// };
// postPayment();

var amountInput = document.getElementById("amount");
var errorMsg = document.getElementById("amount-error-msg");

amountInput.addEventListener("input", validateAmount);

function validateAmount() {
  var value = amountInput.value;
  
  if (value < 50000) {
    errorMsg.innerHTML = "Số tiền phải lớn hơn hoặc bằng 50000";
  } else {
    errorMsg.innerHTML = "";
  }
}
