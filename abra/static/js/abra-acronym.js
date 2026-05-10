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
  // Per-slot total spin duration in ms; staggered so the line settles
  // left-to-right as the eye reads it. Tick rate is slow enough that each
  // word stays visible long enough to read.
  const spinDurations = [1300, 1800, 2400, 3100];
  const tickMs = 220; // how often each slot swaps text while spinning

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
