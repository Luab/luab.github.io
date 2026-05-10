// Slot-machine animation: each word in "Agent Benchmark for Radiology
// Applications" cycles rapidly through variants on page load, then lands on
// the canonical word. Slots are staggered so they settle left-to-right.
// Meta tags, BibTeX, and the abstract stay canonical so SEO and citation
// extraction are unaffected.
(function () {
  const variants = {
    A1: ['Agent', 'Agentic', 'Autonomous', 'Automated', 'Adaptive', 'Auditable', 'Anchored'],
    B:  ['Benchmark', 'Battery', 'Baseline', 'Benchsuite'],
    R:  ['Radiology', 'Radiographic', 'Radiologists', 'Radiographers'],
    A2: ['Applications', 'Agents', 'Assessment', 'Analysis', 'Assistants', 'Activities'],
  };
  const canonical = {
    A1: 'Agent',
    B:  'Benchmark',
    R:  'Radiology',
    A2: 'Applications',
  };

  const keys = ['A1', 'B', 'R', 'A2'];
  // All slots spin at the same pace and land together. Tick rate is slow
  // enough that each variant is comfortably readable.
  const totalMs = 3000;
  const spinDurations = [totalMs, totalMs, totalMs, totalMs];
  const tickMs = 500; // how often each slot swaps text while spinning

  function render(word) {
    return '<span class="initial">' + word[0] + '</span>' + word.slice(1);
  }

  function spinSlot(slot, key, totalMs) {
    const choices = variants[key];
    slot.classList.add('is-spinning');

    let last = slot.textContent.trim();
    const interval = setInterval(() => {
      // Avoid showing the same word twice in a row to amplify the rolling feel.
      let next;
      do {
        next = choices[Math.floor(Math.random() * choices.length)];
      } while (next === last && choices.length > 1);
      last = next;
      slot.innerHTML = render(next);
    }, tickMs);

    setTimeout(() => {
      clearInterval(interval);
      slot.innerHTML = render(canonical[key]);
      slot.classList.remove('is-spinning');
      slot.classList.add('has-landed');
    }, totalMs);
  }

  function start() {
    const slots = document.querySelectorAll('.acronym-expansion .word');
    if (slots.length !== 4) return;
    slots.forEach((slot, i) => spinSlot(slot, keys[i], spinDurations[i]));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
