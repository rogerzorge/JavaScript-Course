// JS couses for beginners

const amountInput = document.getElementById("amount");
const fromDropdown = document.getElementById("from-dropdown");
const toDropdown = document.getElementById("to-dropdown");
const resultDisplay = document.getElementById("result-value");
const rateText = document.getElementById("rate-text");
const swapBtn = document.getElementById("swap-btn");

function setupCustomDropdown(dropdown, onChangeCallback) {
  const header = dropdown.querySelector(".dropdown-header");
  const items = dropdown.querySelectorAll(".dropdown-list li");

  dropdown.value = dropdown.querySelector("li.selected").dataset.value;

  header.addEventListener("click", (e) => {
    e.stopPropagation();

    document.querySelectorAll(".custom-dropdown").forEach((d) => {
      if (d !== dropdown) d.classList.remove("active");
    });

    dropdown.classList.toggle("active");
  });

  items.forEach((item) => {
    item.addEventListener("click", () => {
      updateDropdownSelection(dropdown, item);
      onChangeCallback();
    });
  });
}

function updateDropdownSelection(dropdown, targetListItem) {
  dropdown.querySelector("li.selected").classList.remove("selected");
  targetListItem.classList.add("selected");

  dropdown.querySelector(".selected-symbol").textContent =
    targetListItem.dataset.symbol;
  dropdown.querySelector(".selected-text").textContent =
    targetListItem.dataset.value;

  dropdown.value = targetListItem.dataset.value;
  dropdown.classList.remove("active");
}

window.addEventListener("click", () => {
  document
    .querySelectorAll(".custom-dropdown")
    .forEach((d) => d.classList.remove("active"));
});

async function calculateConversion() {
  const fromCurrency = fromDropdown.value;
  const toCurrency = toDropdown.value;
  const amount = parseFloat(amountInput.value) || 0;

  const apiURL = `https://api.exchangerate.fun/latest?base=${fromCurrency}`;

  try {
    const response = await fetch(apiURL);

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates");
    }

    const data = await response.json();
    const rate = data.rates[toCurrency];
    const convertedAmount = amount * rate;

    resultDisplay.textContent = convertedAmount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });

    rateText.textContent = `1 ${fromCurrency} = ${rate.toFixed(4)} ${toCurrency}`;
  } catch (error) {
    console.error("Error during calculation:", error);
    resultDisplay.textContent = "Error";
    rateText.textContent = "Unable to fetch live rates.";
  }
}

function swapCurrencies() {
  swapBtn.classList.toggle("rotate");

  const fromItem = fromDropdown.querySelector("li.selected");
  const toItem = toDropdown.querySelector("li.selected");

  const fromValue = fromItem.dataset.value;
  const toValue = toItem.dataset.value;

  const newFromTarget = fromDropdown.querySelector(
    `li[data-value="${toValue}"]`,
  );
  const newToTarget = toDropdown.querySelector(`li[data-value="${fromValue}"]`);

  updateDropdownSelection(fromDropdown, newFromTarget);
  updateDropdownSelection(toDropdown, newToTarget);

  calculateConversion();
}

setupCustomDropdown(fromDropdown, calculateConversion);
setupCustomDropdown(toDropdown, calculateConversion);

amountInput.addEventListener("input", calculateConversion);
swapBtn.addEventListener("click", swapCurrencies);

calculateConversion();
