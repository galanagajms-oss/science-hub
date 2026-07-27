const params = new URLSearchParams(window.location.search);
const grade = params.get("grade");
const term = params.get("term");
const lessonNum = params.get("lesson");

// 1. Load Lesson List for the Term (For term.html)
async function loadTermLessons() {
    const grid = document.getElementById("lessonGrid");
    const subtitle = document.getElementById("termSubtitle");
    
    if(subtitle) subtitle.innerText = `Grade ${grade} - Term ${term} Reviewers`;

    try {
        const res = await fetch(`../data/GRADE${grade}/Term${term}/index.json`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        
        grid.innerHTML = data.map(l => `
            <a href="lesson.html?grade=${grade}&term=${term}&lesson=${l.id}" class="card">
                <span style="font-size: 0.8rem; color: var(--primary); font-weight: bold;">Week ${l.weeks}</span>
                <h3>${l.title}</h3>
                <p style="font-size: 0.9rem; margin-top: 10px; color: #666;">Click to review &rarr;</p>
            </a>
        `).join('');
    } catch (e) { 
        grid.innerHTML = "<p style='grid-column: 1/-1; text-align: center;'>Lessons for this term are currently being prepared.</p>"; 
    }
}

// 2. Load Full Lesson Content (For lesson.html)
async function loadFullLesson() {
    try {
        const res = await fetch(`../data/GRADE${grade}/Term${term}/lesson${lessonNum}.json`);
        if (!res.ok) throw new Error("File not found");
        const data = await res.json();
        
        // Basic Info
        document.getElementById("lessonTitle").innerText = data.title;
        document.getElementById("compText").innerText = data.competency;
        document.getElementById("objText").innerHTML = data.objectives.map(o => `<li>${o}</li>`).join('');
        document.getElementById("introText").innerText = data.introduction;
        document.getElementById("contentText").innerHTML = data.content;

        // Examples
        document.getElementById("exText").innerHTML = data.examples.map(ex => `
            <div style="margin-bottom: 15px; padding: 15px; border-left: 4px solid var(--primary); background: #fcfcfc;">
                <strong>${ex.title}:</strong> ${ex.description}
            </div>
        `).join('');

        // Key Terms
        document.getElementById("termsText").innerHTML = data.keyTerms.map(kt => `
            <p><strong>${kt.term}</strong>: ${kt.definition}</p>
        `).join('');

        // Key Concepts
        document.getElementById("conceptsList").innerHTML = data.keyConcepts.map(kc => `<li>${kc}</li>`).join('');

        // Summary
        document.getElementById("summaryText").innerText = data.summary;

        // Self-Check
        document.getElementById("scText").innerHTML = data.selfCheck.map((s, index) => `
            <details style="margin-top:10px; padding:15px; background:#f9f9f9; border-radius:8px; border: 1px solid #eee;">
                <summary style="font-weight: 600; cursor: pointer;">Q${index + 1}: ${s.q}</summary>
                <p style="color: var(--primary); margin-top: 10px; font-weight: bold;">Answer: ${s.a}</p>
            </details>
        `).join('');

        // References
        document.getElementById("refList").innerHTML = data.references.map(r => `<li>${r}</li>`).join('');

    } catch (e) { 
        const reviewer = document.querySelector(".reviewer-content");
        if(reviewer) reviewer.innerHTML = "<h1>Lesson Under Construction</h1><p>Data is still being uploaded.</p>";
    }
}