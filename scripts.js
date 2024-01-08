document.addEventListener('DOMContentLoaded', function () {
	const formSteps = document.querySelectorAll('.form-step');
	const sidebarSteps = document.querySelectorAll('.sidebar ul li');
	const form = document.getElementById('multi-step-form');

	const toggleSwitch = document.querySelector('.toggle-switch input');

	const planButtons = document.querySelectorAll('.plan-button');

	const monthlyPrices = {
		Arcade: 9,
		Advanced: 12,
		Pro: 15,
	};

	const yearlyPrices = {
		Arcade: 90,
		Advanced: 120,
		Pro: 150,
	};
	const monthlyAddOnPrices = {
		'Online service': '$1/mo',
		'Larger storage': '$2/mo',
		'Customizable profile': '$2/mo',
	};

	const yearlyAddOnPrices = {
		'Online service': '$10/yr',
		'Larger storage': '$20/yr',
		'Customizable profile': '$20/yr',
	};

	let currentStep = 0;
	let selectedPlan = ''; // Variable to store the selected plan
	let selectedPrice = ''; // Variable to store the selected plan's price
	let selectedAddOns = []; // Array to store selected add-ons
	let selectedAddOnsPrices = []; // Array to store selected add-ons'

	// Update step 4 summary
	const summary = document.querySelector('.summary');
	const summaryDetails = document.querySelector('.summary-details');
	const planDetails = document.querySelector('.plan-details');
	const addOnsDetails = document.querySelector('.add-ons-details');
	const totalCost = document.querySelector('.total-cost--price');
	const totalCostTitle = document.querySelector('.total-cost--title');

	// Update summary details function
	function updateSummary() {
		// Selected plan details
		const selectedPlanElement = document.createElement('div');
		selectedPlanElement.innerHTML = `
            <div>
                <h4 class="plan-details--title">${selectedPlan} (${
			toggleSwitch.checked ? 'Yearly' : 'Monthly'
		})</h4>
                <a class="plan-change" href="">Change</a>
            </div>
            <h4 class="plan-details--price"></h4>
        `;
		planDetails.innerHTML = '';
		planDetails.appendChild(selectedPlanElement);

		// Update the plan price within the updateSummary function
		const planPriceElement = document.querySelector('.plan-details--price');
		planPriceElement.textContent = toggleSwitch.checked
			? `$${yearlyPrices[selectedPlan]}/yr`
			: `$${monthlyPrices[selectedPlan]}/mo`;

		// Selected add-ons details
		addOnsDetails.innerHTML = '';
		const selectedAddOns = document.querySelectorAll(
			'.add-ons-button.selected'
		);
		selectedAddOns.forEach((addOn) => {
			const addOnTitle = addOn.querySelector('.add-ons-title h3').textContent;
			const addOnPrice = addOn.querySelector('.add-ons-price p').textContent;
			const addOnElement = document.createElement('div');
			addOnElement.innerHTML = `
                <p class="add-ons-details--title">${addOnTitle}</p>
                <p class="add-ons-details--price">${addOnPrice}</p>
            `;
			addOnsDetails.appendChild(addOnElement);
		});

		// Calculate and display total cost per month or year
		const basePlanPrice = toggleSwitch.checked
			? yearlyPrices[selectedPlan]
			: monthlyPrices[selectedPlan];
		const selectedAddOnsPrices = Array.from(selectedAddOns).map((addOn) => {
			const addOnTitle = addOn.querySelector('.add-ons-title h3').textContent;
			return toggleSwitch.checked
				? yearlyAddOnPrices[addOnTitle]
				: monthlyAddOnPrices[addOnTitle];
		});

		const total = selectedAddOnsPrices.reduce(
			(acc, price) => acc + parseFloat(price.split('/')[0].slice(1)),
			basePlanPrice
		);
		// Set the title based on the toggle switch
		totalCostTitle.textContent = toggleSwitch.checked
			? 'Total (per year)'
			: 'Total (per month)';

		totalCost.textContent = toggleSwitch.checked
			? `$${total}/yr`
			: `$${total}/mo`;

		summary.style.display = 'block';
		summaryDetails.style.display = 'block';
	}

	//Show current step

	function showStep(step) {
		formSteps.forEach((step, index) => {
			if (index === currentStep) {
				step.style.display = 'block';
			} else {
				step.style.display = 'none';
			}
		});

		sidebarSteps.forEach((step, index) => {
			const button = step.querySelector('button');
			if (index === currentStep) {
				step.classList.add('active');
				button.setAttribute('aria-selected', 'true');
			} else {
				step.classList.remove('active');
				button.setAttribute('aria-selected', 'false');
			}
		});
	}

	// input validation

	form.addEventListener('submit', function (event) {
		// Check if the form is valid before submission
		if (!form.checkValidity()) {
			event.preventDefault(); // Prevent the default form submission
		}
	});

	function validateInputs(step) {
		const inputs = formSteps[step].querySelectorAll('input[required]');
		let valid = true;

		inputs.forEach((input) => {
			const errorSpan = document.getElementById(`${input.id}-error`);
			if (!input.value.trim()) {
				errorSpan.textContent = 'This field is required';
				valid = false;
			} else {
				errorSpan.textContent = '';
			}
		});

		return valid;
	}

	function moveNext(step) {
		if (validateInputs(step)) {
			if (currentStep < formSteps.length - 1) {
				currentStep++;
				showStep(currentStep);
				event.preventDefault(); // Prevent the default form submission
			}
		}
	}

	// Show the initial step
	showStep(currentStep);

	// Plan Selection Handling
	planButtons.forEach((button) => {
		button.addEventListener('click', function () {
			planButtons.forEach((btn) => {
				btn.classList.remove('selected');
			});
			this.classList.add('selected');

			// Get plan details from the clicked button's attributes or inner text
			selectedPlan = this.dataset.plan; // Assuming data-plan attribute holds the plan title
			// selectedPrice = this.querySelector('.plan-title p').innerText; // Assuming price is stored in the p tag within .plan-title

			// Update the summary when a plan selected/deselected
			updateSummary();

			console.log('Selected Plan:', selectedPlan);
			// console.log('Selected Price:', selectedPrice);
		});
	});

	// Monthly/Yearly Toggle Switch

	toggleSwitch.addEventListener('change', function () {
		const isYearly = toggleSwitch.checked; // true if yearly, false if monthly
		const toggleTextMonthly = document.querySelector(
			'.toggle-switch p:first-of-type'
		);
		const toggleTextYearly = document.querySelector(
			'.toggle-switch p:last-of-type'
		);

		planButtons.forEach((button) => {
			const plan = button.dataset.plan;
			const priceElement = button.querySelector('p');
			const planTitle = button.querySelector('.plan-title');

			if (isYearly) {
				// Update price and toggle text colors for yearly
				priceElement.textContent = `$${yearlyPrices[plan]}/yr`;
				planTitle.style.color = 'var(--marine-blue)';
				toggleTextMonthly.style.color = 'var(--cool-gray)';
				toggleTextYearly.style.color = 'var(--marine-blue)';

				// Create "2 months free" paragraph for yearly plans
				if (plan === 'Arcade' || plan === 'Advanced' || plan === 'Pro') {
					const paragraph = document.createElement('p');
					paragraph.textContent = '2 months free';
					planTitle.appendChild(paragraph);
				}
			} else {
				// Update price and toggle text colors for monthly
				priceElement.textContent = `$${monthlyPrices[plan]}/mo`;
				planTitle.style.color = 'initial';
				toggleTextMonthly.style.color = 'var(--marine-blue)';
				toggleTextYearly.style.color = 'var(--cool-gray)';

				// Remove "2 months free" paragraph for monthly plans
				const paragraph = planTitle.querySelector('p:last-of-type');
				if (paragraph) {
					paragraph.remove();
				}
			}
		});

		const addOnButtons = document.querySelectorAll('.add-ons-button');

		addOnButtons.forEach((button) => {
			const addOnTitle = button.querySelector('.add-ons-title h3').textContent;
			const addOnPrice = button.querySelector('.add-ons-price p');

			if (isYearly) {
				addOnPrice.textContent = yearlyAddOnPrices[addOnTitle];
			} else {
				addOnPrice.textContent = monthlyAddOnPrices[addOnTitle];
			}
		});
		updateSummary();
	});

	// Function to toggle checkbox and update background color on .add-ons-button click
	document.querySelectorAll('.add-ons-button').forEach(function (button) {
		button.addEventListener('click', function () {
			const labels = this.querySelector('label');
			const checkbox = this.querySelector('input[type="checkbox"]');
			checkbox.checked = !checkbox.checked;

			if (checkbox.checked) {
				button.classList.add('selected');
				labels.classList.add('checked');
			} else {
				button.classList.remove('selected');
				labels.classList.remove('checked');
			}
		});
	});

	// Update the selected add-ons and their prices

	document.querySelectorAll('.add-ons-button').forEach(function (button) {
		button.addEventListener('click', function () {
			const addOnTitle = this.querySelector('.add-ons-title h3').textContent;
			const addOnPrice = this.querySelector('.add-ons-price p').textContent;

			if (selectedAddOns.includes(addOnTitle)) {
				// Remove add-on if it's already selected
				const index = selectedAddOns.indexOf(addOnTitle);
				selectedAddOns.splice(index, 1);
				selectedAddOnsPrices.splice(index, 1);
			} else {
				selectedAddOns.push(addOnTitle);
				selectedAddOnsPrices.push(addOnPrice);
			}

			// Update the summary when an add-on is selected/deselected
			updateSummary();

			console.log('Add ons title:', addOnTitle);
			console.log('Add ons Price:', addOnPrice);
		});
	});

	// Form Navigation

	document
		.querySelector('.sidebar ul')
		.addEventListener('click', function (event) {
			const clickedStep = event.target.closest('li');
			if (clickedStep) {
				currentStep = parseInt(clickedStep.getAttribute('data-step')) - 1;
				showStep(currentStep);
			}

			const button = event.target.closest('button');
			const textIndicator = event.target.closest('.text-indicators');
			const numberIndicator = event.target.closest('.numbered-indicators');

			if (button || textIndicator || numberIndicator) {
				const clickedIndex = [...sidebarSteps].findIndex(
					(el) => el === clickedStep
				);
				currentStep = clickedIndex;
				showStep(currentStep);
			}
		});

	document
		.getElementById('multi-step-form')
		.addEventListener('click', function (event) {
			if (event.target.classList.contains('next-step')) {
				moveNext(currentStep);
			} else if (event.target.classList.contains('prev-step')) {
				if (currentStep > 0) {
					currentStep--;
					showStep(currentStep);
				}
			}
		});
});
