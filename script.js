// Constants for sleep calculations
const SLEEP_CYCLE = 90; // Sleep cycle duration in minutes
const FALL_ASLEEP_TIME = 15; // Average time to fall asleep in minutes
const MIN_CYCLES = 4; // Minimum recommended sleep cycles
const MAX_CYCLES = 6; // Maximum recommended sleep cycles

// Initialize time input handling
document.addEventListener('DOMContentLoaded', () => {
    const timeInput = document.getElementById('timeInput');
    const timeValue = document.querySelector('.time-value');
    const timePeriodsElements = document.querySelectorAll('.time-period');
    
    // Set default time
    timeInput.value = '06:30';
    updateTimeDisplay(timeInput.value);
    
    // Handle time input changes
    timeInput.addEventListener('change', (e) => {
        updateTimeDisplay(e.target.value);
    });
    
    // Handle AM/PM clicks
    timePeriodsElements.forEach(el => {
        el.addEventListener('click', () => {
            const currentTime = timeInput.value;
            const [hours, minutes] = currentTime.split(':');
            let hour = parseInt(hours);
            
            if (el.textContent === 'PM' && hour < 12) {
                hour += 12;
            } else if (el.textContent === 'AM' && hour >= 12) {
                hour -= 12;
            }
            
            const newTime = `${hour.toString().padStart(2, '0')}:${minutes}`;
            timeInput.value = newTime;
            updateTimeDisplay(newTime);
        });
    });
});

// Update the time display
function updateTimeDisplay(timeString) {
    const timeValue = document.querySelector('.time-value');
    const timePeriodsElements = document.querySelectorAll('.time-period');
    
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    
    // Update time display
    const displayHour = hour % 12 || 12;
    timeValue.textContent = `${displayHour}:${minutes}`;
    
    // Update AM/PM
    const isPM = hour >= 12;
    timePeriodsElements.forEach(el => {
        if ((isPM && el.textContent === 'PM') || (!isPM && el.textContent === 'AM')) {
            el.classList.add('active');
        } else {
            el.classList.remove('active');
        }
    });
}

// Helper function to format time
function formatTime(date) {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

// Helper function to add minutes to a date
function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes * 60000);
}

// Helper function to subtract minutes from a date
function subtractMinutes(date, minutes) {
    return new Date(date.getTime() - minutes * 60000);
}

// Calculate wake-up times based on bedtime
function calculateWakeUp() {
    const bedtime = document.getElementById('timeInput').value;
    if (!bedtime) {
        alert('Please enter a bedtime');
        return;
    }

    // Convert input time to Date object
    let baseTime = new Date(`2000/01/01 ${bedtime}`);
    // Add time to fall asleep
    baseTime = addMinutes(baseTime, FALL_ASLEEP_TIME);

    let results = `<h3>If you go to bed at ${formatTime(new Date(`2000/01/01 ${bedtime}`))}</h3>`;
    results += '<p>You should try to wake up at one of these times:</p>';
    results += '<div class="time-suggestions">';

    // Calculate wake times for different sleep cycles
    for (let cycles = MIN_CYCLES; cycles <= MAX_CYCLES; cycles++) {
        let wakeTime = addMinutes(baseTime, cycles * SLEEP_CYCLE);
        results += `
            <div class="time-option">
                <span class="time">${formatTime(wakeTime)}</span>
                <span class="cycles">${cycles} cycles</span>
                <span class="hours">(${cycles * 1.5} hours)</span>
            </div>
        `;
    }

    results += '</div>';
    results += '<p class="tip">💡 Try to wake up at the end of a sleep cycle, when you\'re in your lightest sleep phase.</p>';

    displayResults(results);
}

// Calculate bedtimes based on wake-up time
function calculateBedtime() {
    const wakeTime = document.getElementById('timeInput').value;
    if (!wakeTime) {
        alert('Please enter a wake-up time');
        return;
    }

    // Convert input time to Date object
    let baseTime = new Date(`2000/01/01 ${wakeTime}`);
    
    let results = `<h3>To wake up at ${formatTime(baseTime)}</h3>`;
    results += '<p>You should try to go to bed at one of these times:</p>';
    results += '<div class="time-suggestions">';

    // Calculate bedtimes for different sleep cycles
    for (let cycles = MIN_CYCLES; cycles <= MAX_CYCLES; cycles++) {
        // Subtract sleep cycles and time to fall asleep
        let bedTime = subtractMinutes(baseTime, (cycles * SLEEP_CYCLE) + FALL_ASLEEP_TIME);
        results += `
            <div class="time-option">
                <span class="time">${formatTime(bedTime)}</span>
                <span class="cycles">${cycles} cycles</span>
                <span class="hours">(${cycles * 1.5} hours)</span>
            </div>
        `;
    }

    results += '</div>';
    results += '<p class="tip">💡 Account for about 15 minutes to fall asleep when planning your bedtime.</p>';

    displayResults(results);
}

// Display results with animation
function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.style.display = 'none';
    resultsDiv.innerHTML = results;
    resultsDiv.style.display = 'block';
    
    // Add CSS classes for styling
    const timeOptions = document.querySelectorAll('.time-option');
    timeOptions.forEach((option, index) => {
        setTimeout(() => {
            option.classList.add('fade-in');
        }, index * 100);
    });
} 