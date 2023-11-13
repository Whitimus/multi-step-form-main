document.addEventListener('DOMContentLoaded', function () {
	const formSteps = document.querySelectorAll('.form-step');
	const sidebarSteps = document.querySelectorAll('.sidebar ul li');

	let currentStep = 0;

	function showStep(step) {
		formSteps.forEach((step, index) => {
			if (index === currentStep) {
				step.style.display = 'block';
			} else {
				step.style.display = 'none';
			}
		});

		sidebarSteps.forEach((step, index) => {
			if (index === currentStep) {
				step.classList.add('active');
			} else {
				step.classList.remove('active');
			}
		});
	}

	// Show the initial step
	showStep(currentStep);

	document
		.querySelector('.sidebar ul')
		.addEventListener('click', function (event) {
			if (event.target.tagName === 'LI') {
				currentStep = parseInt(event.target.getAttribute('data-step')) - 1;
				showStep(currentStep);
			}
		});

	document
		.getElementById('multi-step-form')
		.addEventListener('click', function (event) {
			if (event.target.classList.contains('next-step')) {
				if (currentStep < formSteps.length - 1) {
					currentStep++;
					showStep(currentStep);
				}
			} else if (event.target.classList.contains('prev-step')) {
				if (currentStep > 0) {
					currentStep--;
					showStep(currentStep);
				}
			}
		});
});
