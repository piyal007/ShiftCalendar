let currentYear = new Date().getFullYear(); // Get the current year
let currentMonth = new Date().getMonth(); // Get the current month
let currentShift = "A"; // Start with B shift

// Function to generate the shift calendar
function generateShiftCalendar(year, month) {
    const calendarDiv = document.getElementById("shiftCalendar");
    const monthYear = document.getElementById("monthYear");
    calendarDiv.innerHTML = ""; // Clear previous data

    // Set month title
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    monthYear.textContent = `${monthNames[month]} ${year}`;

    // Get first day and number of days in the month
    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    // Create day labels
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    daysOfWeek.forEach(day => {
        const dayLabel = document.createElement("div");
        dayLabel.className = "day-name";
        dayLabel.textContent = day;
        calendarDiv.appendChild(dayLabel);
    });

    // Generate empty slots for previous month's days
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement("div");
        emptyDiv.className = "day";
        calendarDiv.appendChild(emptyDiv);
    }

    // Generate actual calendar days
    for (let day = 1; day <= totalDays; day++) {
        const dayDiv = document.createElement("div");
        dayDiv.className = "day";
        dayDiv.textContent = day;

        let currentDate = new Date(year, month, day);
        let shift = currentShift;

        // Determine the shift based on the day of the week
        if (currentDate.getDay() === 5) { // If it's Friday
            // Toggle shift for the next week
            currentShift = (currentShift === "A") ? "B" : "A";
        }

        // Add shift to every box
        const shiftDiv = document.createElement("div");
        shiftDiv.className = `shift ${currentShift}`;
        shiftDiv.textContent = currentShift;
        dayDiv.appendChild(shiftDiv);

        // Check if this day is selected
        if (currentDate.getDay() === 5 && isSelected(`${year}-${month}-${day}`)) {
            dayDiv.classList.add("selected");
        }

        // Add click event to toggle selection for Fridays
        if (currentDate.getDay() === 5) {
            dayDiv.addEventListener("click", () => {
                toggleSelection(`${year}-${month}-${day}`, dayDiv);
            });
        }

        calendarDiv.appendChild(dayDiv);
    }
}

// Function to change the month
function changeMonth(step) {
    currentMonth += step; // Change the month by the step
    if (currentMonth > 11) { // If month exceeds December
        currentMonth = 0; // Reset to January
        currentYear++; // Increment the year
    } else if (currentMonth < 0) { // If month is less than January
        currentMonth = 11; // Reset to December
        currentYear--; // Decrement the year
    }
    generateShiftCalendar(currentYear, currentMonth); // Regenerate the calendar
}

// Function to check if a date is selected
function isSelected(date) {
    const selectedDates = JSON.parse(localStorage.getItem("selectedFridays") || "[]");
    return selectedDates.includes(date);
}

// Function to toggle the selection of a date
function toggleSelection(date, dayDiv) {
    let selectedDates = JSON.parse(localStorage.getItem("selectedFridays") || "[]");
    if (selectedDates.includes(date)) {
        selectedDates = selectedDates.filter(d => d !== date);
        dayDiv.classList.remove("selected");
    } else {
        selectedDates.push(date);
        dayDiv.classList.add("selected");
    }
    localStorage.setItem("selectedFridays", JSON.stringify(selectedDates));
}

// Show current month
generateShiftCalendar(currentYear, currentMonth);
