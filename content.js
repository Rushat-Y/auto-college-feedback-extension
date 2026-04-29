(function() {
    const msgs = [
        "Overall, a very positive and enriching experience.",
        "Expectations were met perfectly. Great job this semester.",
        "Highly effective and well-managed from start to finish.",
        "Clear, engaging, and extremely helpful throughout.",
        "An excellent addition to the semester. Highly recommended.",
        "Very organized and provided great value.",
        "Everything was communicated clearly and structured well.",
        "A fantastic experience overall. Thank you!",
        "Consistently high quality and very beneficial.",
        "Great structure and excellent delivery."
    ];

    // Logic 1 (Radios): Select the last option for highest score
    const radios = document.querySelectorAll('input[type="radio"]');
    const groupedRadios = {};
    
    // Group radios by their name attribute
    radios.forEach(radio => {
        const name = radio.name;
        if (name) {
            if (!groupedRadios[name]) {
                groupedRadios[name] = [];
            }
            groupedRadios[name].push(radio);
        }
    });

    // Click the last radio button in each group
    Object.keys(groupedRadios).forEach(name => {
        const group = groupedRadios[name];
        if (group && group.length > 0) {
            const lastRadio = group[group.length - 1];
            lastRadio.click();
        }
    });

    // Logic 2 (Textareas): Fill with a random positive message
    const textareas = document.querySelectorAll('textarea');
    textareas.forEach(textarea => {
        // Check if textarea is active and visible
        if (!textarea.disabled && textarea.style.display !== 'none' && !textarea.readOnly) {
            const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
            textarea.value = randomMsg;
            
            // Dispatch events to trigger any JS listeners on the page
            textarea.dispatchEvent(new Event('input', { bubbles: true }));
            textarea.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });
})();
