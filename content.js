(function () {
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

    function setNativeValue(element, value) {
        const valueSetter = Object.getOwnPropertyDescriptor(element, 'value')?.set;
        const prototype = Object.getPrototypeOf(element);
        const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;

        if (prototypeValueSetter && valueSetter !== prototypeValueSetter) {
            prototypeValueSetter.call(element, value);
        } else if (valueSetter) {
            valueSetter.call(element, value);
        } else {
            element.value = value;
        }

        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
    }

    //get text from the radoi button or its label
    function getRadioText(radio) {
        let text = "";

        const ariaLabel = radio.getAttribute('aria-label');
        if (ariaLabel) text += ariaLabel + " ";

        if (radio.tagName.toLowerCase() === 'input') {
            const val = radio.value;
            //ignore generic internal values like "on"
            if (val && val !== 'on' && !val.startsWith('option')) {
                text += val + " ";
            }
        }

        const label = radio.closest('label');
        if (label) text += label.innerText + " ";

        if (radio.getAttribute('role') === 'radio') {
            text += radio.innerText + " ";

            const labelledBy = radio.getAttribute('aria-labelledby');
            if (labelledBy) {
                const ids = labelledBy.split(' ');
                ids.forEach(id => {
                    const labelEl = document.getElementById(id);
                    if (labelEl) text += labelEl.innerText + " ";
                });
            }
        }

        return text.trim().toLowerCase();
    }

    //give a positivity score to the option text
    function getScore(text) {
        if (!text) return 0;

        //strip punctuation so labels like "Yes." match "yes"
        text = text.replace(/[.,]/g, '').trim();
        let score = 0;

        //highly positive
        if (text.includes('strongly agree')) score += 20;
        else if (text.includes('agree')) score += 10;

        if (text.includes('very satisfied')) score += 20;
        else if (text.includes('satisfied') && !text.includes('dissatisfied')) score += 10;

        if (text.includes('excellent')) score += 20;
        if (text.includes('good') || text.includes('great')) score += 10;

        if (text === 'yes' || text.startsWith('yes ')) score += 20;
        if (text.includes('always')) score += 10;
        if (text.includes('often')) score += 5;

        if (text.includes('very likely')) score += 20;
        else if (text.includes('likely') && !text.includes('unlikely')) score += 10;

        if (text.includes('extremely effective') || text.includes('highly effective')) score += 20;
        else if (text.includes('very effective')) score += 15;
        else if (text.includes('effective') && !text.includes('not') && !text.includes('ineffective')) score += 10;

        //negative
        if (text.includes('strongly disagree')) score -= 20;
        else if (text.includes('disagree')) score -= 10;

        if (text.includes('very dissatisfied')) score -= 20;
        else if (text.includes('dissatisfied')) score -= 10;

        if (text.includes('poor') || text.includes('bad') || text.includes('terrible')) score -= 20;

        if (text === 'no' || text.startsWith('no ')) score -= 20;
        if (text.includes('never')) score -= 10;
        if (text.includes('rarely')) score -= 5;

        if (text.includes('very unlikely')) score -= 20;
        else if (text.includes('unlikely')) score -= 10;

        if (text.includes('not at all effective')) score -= 20;
        else if (text.includes('not so effective') || text.includes('ineffective')) score -= 10;

        //neutral
        if (text.includes('not sure') || text.includes('neutral') || text.includes('neither')) score -= 1;

        //fallback to number if no text keywords match
        if (score === 0) {
            const numMatch = text.match(/\b\d+\b/);
            if (numMatch) {
                score = parseInt(numMatch[0]);
            }
        }

        return score;
    }

    //find and click the best radio in a group
    function clickBestRadio(group) {
        if (group.length === 0) return false;

        let bestRadio = group[group.length - 1]; //default to the last one if we can't tell
        let maxScore = -Infinity;

        group.forEach(radio => {
            const text = getRadioText(radio);
            const score = getScore(text);

            //if score is higher, or equal (right-most wins ties)
            if (score >= maxScore) {
                maxScore = score;
                bestRadio = radio;
            }
        });

        //click it!
        if (bestRadio.offsetHeight === 0 || bestRadio.offsetWidth === 0) {
            const label = bestRadio.closest('label') || bestRadio.parentElement;
            if (label) label.click();
            else bestRadio.click();
        } else {
            bestRadio.click();
        }
        return true;
    }

    let clickCount = 0;
    let textCount = 0;

    //strategy1:handle standard html radios
    const nativeRadios = document.querySelectorAll('input[type="radio"]');
    const groupedNativeRadios = {};

    nativeRadios.forEach(radio => {
        const name = radio.name || radio.getAttribute('name');
        if (name) {
            if (!groupedNativeRadios[name]) groupedNativeRadios[name] = [];
            groupedNativeRadios[name].push(radio);
        }
    });

    Object.values(groupedNativeRadios).forEach(group => {
        if (clickBestRadio(group)) clickCount++;
    });

    //strategy2:handle modern role="radio" (like ms forms)
    const ariaRadios = document.querySelectorAll('[role="radio"]');
    const ariaGroups = {};

    ariaRadios.forEach(radio => {
        const group = radio.closest('[role="radiogroup"]');
        if (group) {
            if (!group.dataset.autoId) group.dataset.autoId = Math.random().toString(36).substr(2, 9);
            const groupId = group.dataset.autoId;

            if (!ariaGroups[groupId]) ariaGroups[groupId] = [];
            ariaGroups[groupId].push(radio);
        }
    });

    Object.values(ariaGroups).forEach(group => {
        if (clickBestRadio(group)) clickCount++;
    });

    //logic2:fill text inputs
    const textElements = document.querySelectorAll('textarea, input[type="text"]');
    textElements.forEach(el => {
        const isVisible = el.offsetWidth > 0 && el.offsetHeight > 0;
        const isEditable = !el.disabled && !el.readOnly;

        if (isVisible && isEditable) {
            const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
            setNativeValue(el, randomMsg);
            textCount++;
        }
    });

    const contentEditables = document.querySelectorAll('[contenteditable="true"]');
    contentEditables.forEach(el => {
        if (el.tagName.toLowerCase() !== 'body') {
            const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
            el.innerText = randomMsg;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            textCount++;
        }
    });

    console.log(`Auto-Feedback: Smartly filled ${clickCount} radio groups and ${textCount} text fields.`);
})();
