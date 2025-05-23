
const beverageContainer = document.getElementById('beverage-container');
const addBeverageBtn = document.getElementById('add-beverage');
const calculateBtn = document.getElementById('calculate');
const resultsDiv = document.getElementById('results');
const totalCaffeineP = document.getElementById('total-caffeine');
const recommendationP = document.getElementById('recommendation');
const userTypeSelect = document.getElementById('user-type');

addBeverageBtn.addEventListener('click', () => {
    const newRow = document.createElement('div');
    newRow.className = 'beverage-row flex items-center space-x-2 mt-2';
    newRow.innerHTML = `
        <select class="beverage-type w-2/3 p-2 border border-gray-300 rounded-md">
            <option value="0">Select Beverage</option>
            <option value="95">Brewed Coffee (8 oz, 95 mg)</option>
            <option value="47">Espresso (1 oz, 47 mg)</option>
            <option value="34">Cola (12 oz, 34 mg)</option>
            <option value="80">Energy Drink (8 oz, 80 mg)</option>
            <option value="60">Black Tea (8 oz, 60 mg)</option>
            <option value="30">Green Tea (8 oz, 30 mg)</option>
        </select>
        <input type="number" class="servings w-1/3 p-2 border border-gray-300 rounded-md" min="0" value="0" placeholder="Servings">
    `;
    beverageContainer.appendChild(newRow);
});

calculateBtn.addEventListener('click', () => {
    const beverageRows = document.querySelectorAll('.beverage-row');
    let totalCaffeine = 0;

    beverageRows.forEach(row => {
        const caffeinePerServing = parseFloat(row.querySelector('.beverage-type').value);
        const servings = parseInt(row.querySelector('.servings').value) || 0;
        totalCaffeine += caffeinePerServing * servings;
    });

    const userType = userTypeSelect.value;
    let maxLimit;
    let recommendation;

    switch (userType) {
        case 'adult':
            maxLimit = 400;
            recommendation = totalCaffeine <= maxLimit
                ? `Your intake of ${totalCaffeine} mg is within the safe limit of ${maxLimit} mg/day for adults.`
                : `Your intake of ${totalCaffeine} mg exceeds the safe limit of ${maxLimit} mg/day for adults. Consider reducing your consumption.`;
            break;
        case 'pregnant':
            maxLimit = 200;
            recommendation = totalCaffeine <= maxLimit
                ? `Your intake of ${totalCaffeine} mg is within the safe limit of ${maxLimit} mg/day for pregnant women.`
                : `Your intake of ${totalCaffeine} mg exceeds the safe limit of ${maxLimit} mg/day for pregnant women. Consult your doctor.`;
            break;
        case 'teen':
            maxLimit = 100;
            recommendation = totalCaffeine <= maxLimit
                ? `Your intake of ${totalCaffeine} mg is within the safe limit of ${maxLimit} mg/day for teenagers.`
                : `Your intake of ${totalCaffeine} mg exceeds the safe limit of ${maxLimit} mg/day for teenagers. Consider reducing your consumption.`;
            break;
        case 'child':
            maxLimit = 0;
            recommendation = `Children under 13 should avoid caffeine. Your intake of ${totalCaffeine} mg is not recommended. Consult a doctor.`;
            break;
    }

    totalCaffeineP.textContent = `Total Caffeine Intake: ${totalCaffeine} mg`;
    recommendationP.textContent = recommendation;
    resultsDiv.classList.remove('hidden');
});
