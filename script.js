let resumeData = {
  sections: [],
};
function renderSections() {
  const list = document.getElementById("sectionsList");
  list.innerHTML = "";

  resumeData.sections.forEach((section, index) => {
    const li = document.createElement("li");
    li.textContent = section.name;
    list.appendChild(li);
  });
}

function addSection() {
  const sectionName = prompt(
    "Enter section name (e.g., Experience, Education):"
  );

  if (sectionName) {
    resumeData.sections.push({
      name: sectionName,
      content: "",
    });

    renderSections();
  }
}

document.getElementById("addSectionBtn").addEventListener("click", addSection);
