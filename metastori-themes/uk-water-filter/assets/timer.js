// Define the start and end hours
let startHour = 0; // 12 AM
let endHour = 16; // 4 PM
const timerWrapper = document.querySelector('#timer-wrapper')
const staticTime = timerWrapper.querySelector('.timer-static')
const dynamicTime = timerWrapper.querySelector('.timer-dynamic')
const dynamicTimeValue = timerWrapper.querySelector('.timer-dynamic-value')

// Get current date in UK
let now = new Date();
now = new Date(now);

// Check if current day is not Saturday or Sunday
if (now.getDay() !== 0 && now.getDay() !== 6) {
    // Set target time to endHour on the current UK date
    let target = new Date(now);
    target.setHours(endHour, 0, 0, 0); // endHour:00:00.000

    // Check if current time is between startHour and endHour
    if (now.getHours() >= startHour && now.getHours() < endHour) {
        // Calculate the difference in milliseconds
        let diff = target - now;

        // Start the countdown
        let countdown = setInterval(function() {
            diff -= 1000; // decrease diff by 1 second
            let hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((diff % (1000 * 60)) / 1000);

            // Output the result
            dynamicTime.classList.remove('hidden')
            staticTime.classList.add('hidden')

            dynamicTimeValue.textContent = `${hours} hrs ${minutes} min`

            // If the count down is over, clear the interval
            if (diff < 0) {
                clearInterval(countdown);
            }
        }, 1000);
    } else {
        // Check if current time is not between startHour and endHour
    }
} else {
    // If saturday or sunday
    staticTime.textContent = 'Order before 3pm for same working day dispatch'
}