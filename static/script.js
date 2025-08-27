document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('question-form');
    const input = document.getElementById('question-input');
    const questionBubble = document.getElementById('question-bubble');
    const techList = document.getElementById('technology-list');
    const tooltip = document.getElementById('tooltip');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const question = input.value;
        const res = await fetch('/technologies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question })
        });
        const data = await res.json();
        questionBubble.textContent = question;
        questionBubble.style.display = 'inline-block';
        input.value = '';
        techList.innerHTML = '';
        techList.style.display = 'block';
        data.technologies.forEach((t, idx) => {
            const li = document.createElement('li');
            li.textContent = t.name;
            li.dataset.segment = t.segment;
            li.dataset.instruments = t.instruments.join(', ');
            li.classList.add('float-in');
            li.style.animationDelay = `${idx * 0.3}s`;
            techList.appendChild(li);
        });
    });

    techList.addEventListener('mouseover', (e) => {
        if (e.target.tagName === 'LI') {
            showTooltip(e.target.dataset.instruments, e.pageX, e.pageY);
            highlightSegment(e.target.dataset.segment);
        }
    });

    techList.addEventListener('mousemove', (e) => {
        tooltip.style.left = e.pageX + 10 + 'px';
        tooltip.style.top = e.pageY + 10 + 'px';
    });

    techList.addEventListener('mouseout', (e) => {
        if (e.target.tagName === 'LI') {
            hideTooltip();
            clearHighlight();
        }
    });

    function showTooltip(text, x, y) {
        tooltip.textContent = text;
        tooltip.style.left = x + 10 + 'px';
        tooltip.style.top = y + 10 + 'px';
        tooltip.style.display = 'block';
    }

    function hideTooltip() {
        tooltip.style.display = 'none';
    }

    function highlightSegment(id) {
        clearHighlight();
        const seg = document.getElementById(`segment-${id}`);
        if (seg) {
            seg.classList.add('highlight');
        }
    }

    function clearHighlight() {
        document.querySelectorAll('.segment.highlight').forEach(el => {
            el.classList.remove('highlight');
        });
    }
});
