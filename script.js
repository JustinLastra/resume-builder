let resumeData = {
  sections: [],
};

function saveData() {
  localStorage.setItem("resumeData", JSON.stringify(resumeData));
}

function loadData() {
  const data = localStorage.getItem("resumeData");
  if (data) {
    resumeData = JSON.parse(data);
  } else {
    resumeData = {
      sections: [
        { name: "Contact", content: "" },
        { name: "Summary", content: "" },
        { name: "Experience", content: "" },
        { name: "Education", content: "" },
        { name: "Skills", content: "" },
      ],
    };
  }
}

function renderSections() {
  const list = document.getElementById("sectionsList");
  list.innerHTML = "";

  resumeData.sections.forEach((section, index) => {
    const li = document.createElement("li");
    li.className = "nav-sidebar_list-item";

    const nameSpan = document.createElement("span");
    nameSpan.textContent = section.name;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "×";
    deleteBtn.className = "delete-btn";
    deleteBtn.addEventListener("click", () => deleteSection(index));

    li.appendChild(nameSpan);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });
}

function renderEditor() {
  const editor = document.getElementById("editorContent");
  editor.innerHTML = ""; // Clear the editor

  resumeData.sections.forEach((section, index) => {
    const sectionDiv = document.createElement("div");
    sectionDiv.className = "section";

    const title = document.createElement("h2");
    title.textContent = section.name;

    const content = document.createElement("div");
    content.className = "section-content";
    content.contentEditable = true;
    content.textContent = section.content;
    content.dataset.index = index;

    // Save content when user types
    content.addEventListener("input", (e) => {
      resumeData.sections[index].content = e.target.textContent;
      saveData();
    });

    sectionDiv.appendChild(title);
    sectionDiv.appendChild(content);
    editor.appendChild(sectionDiv);
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
    saveData();
    renderSections();
    renderEditor();
  }
}

function deleteSection(index) {
  if (confirm(`Delete "${resumeData.sections[index].name}" section?`)) {
    resumeData.sections.splice(index, 1);
    saveData();
    renderSections();
    renderEditor();
  }
}

document.getElementById("addSectionBtn").addEventListener("click", addSection);

// Initialize: Load data and render on page load
loadData();
renderSections();
renderEditor();
