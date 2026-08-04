// Multi-step Admission Wizard
import {
  el, ICON, initials, fmtDate, todayISO, CLASSES, SECTIONS, GENDERS,
  BLOOD, CATEGORIES, RELIGIONS, ageFromDob, required, isEmail, isPhone,
  FEE_TYPES, PAY_MODES, MONTHS
} from "../utils.js";
import { openModal, toast, confirmDialog, loadingState } from "../ui.js";
import { createStudent, recordFeePayment, uploadPhoto, addStudentDocument } from "../data.js";
import { validateStudent } from "./students.js";

// ---------- State ----------
const state = {
  currentStep: 0,
  data: {
    // Student fields
    name: "",
    gender: "",
    dob: "",
    bloodGroup: "",
    religion: "",
    category: "",
    class: "",
    section: "",
    rollNumber: "",
    previousSchool: "",
    admissionDate: todayISO(),
    status: "Active",
    fatherName: "",
    motherName: "",
    guardian: "",
    phone: "",
    emergencyContact: "",
    email: "",
    address: "",
    // Photo
    photoFile: null,
    photoPreview: null,
    // Payment
    feeType: "",
    amount: 0,
    paidAmount: 0,
    paymentMode: "",
    paymentDate: todayISO(),
    paymentMonth: new Date().toISOString().slice(0, 7),
    paymentRemarks: ""
  },
  documentFiles: []
};

const steps = [
  { id: "personal", label: "Personal Details" },
  { id: "educational", label: "Educational Details" },
  { id: "documents", label: "Photo & Documents" },
  { id: "payment", label: "Payment" },
  { id: "review", label: "Review & Submit" }
];

// ---------- Render Wizard ----------
export function renderAdmissionWizard(container) {
  container.innerHTML = "";
  // Progress bar
  const progressBar = el("div", { style: "display:flex; gap:8px; margin-bottom:24px; align-items:center; flex-wrap:wrap;" });
  steps.forEach((step, index) => {
    const isActive = index === state.currentStep;
    const isCompleted = index < state.currentStep;
    const dot = el("div", {
      style: `width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; 
              font-weight:600; font-size:12px; background:${isActive ? "var(--primary)" : isCompleted ? "var(--success)" : "var(--border)"};
              color:${isActive || isCompleted ? "#fff" : "var(--muted)"}; cursor:pointer;`
    }, [String(index + 1)]);
    const label = el("span", {
      style: `font-size:13px; font-weight:${isActive ? "600" : "400"}; color:${isActive ? "var(--text)" : "var(--muted)"};`
    }, [step.label]);
    const wrapper = el("div", { style: "display:flex; align-items:center; gap:6px;" }, [dot, label]);
    if (index <= state.currentStep) {
      wrapper.style.cursor = "pointer";
      wrapper.onclick = () => goToStep(index);
    }
    progressBar.appendChild(wrapper);
    if (index < steps.length - 1) {
      progressBar.appendChild(el("span", { style: "color:var(--muted-2); font-size:18px;", text: "›" }));
    }
  });
  container.appendChild(progressBar);

  // Content area
  const content = el("div", { style: "min-height:300px;" });
  container.appendChild(content);

  // Navigation buttons
  const nav = el("div", { style: "display:flex; justify-content:space-between; margin-top:24px; gap:12px;" });
  const prevBtn = el("button", { class: "btn btn-outline", text: "Previous", disabled: state.currentStep === 0 });
  const nextBtn = el("button", { class: "btn btn-primary", text: state.currentStep === steps.length - 1 ? "Submit Admission" : "Next" });
  nav.appendChild(prevBtn);
  nav.appendChild(nextBtn);
  container.appendChild(nav);

  function renderStep(stepIndex) {
    content.innerHTML = "";
    const stepContent = getStepContent(stepIndex);
    content.appendChild(stepContent);
    prevBtn.disabled = stepIndex === 0;
    nextBtn.textContent = stepIndex === steps.length - 1 ? "Submit Admission" : "Next";
  }

  prevBtn.onclick = () => {
    if (state.currentStep > 0) {
      state.currentStep--;
      renderStep(state.currentStep);
      updateProgress();
    }
  };

  nextBtn.onclick = async () => {
    const valid = await validateStep(state.currentStep);
    if (!valid) return;
    if (state.currentStep === steps.length - 1) {
      await submitAdmission();
      return;
    }
    state.currentStep++;
    renderStep(state.currentStep);
    updateProgress();
  };

  function goToStep(index) {
    if (index <= state.currentStep) {
      state.currentStep = index;
      renderStep(index);
      updateProgress();
    }
  }

  function updateProgress() {
    const dots = container.querySelectorAll('[style*="border-radius:50%"]');
    if (dots.length) {
      dots.forEach((dot, i) => {
        const isActive = i === state.currentStep;
        const isCompleted = i < state.currentStep;
        dot.style.background = isActive ? "var(--primary)" : isCompleted ? "var(--success)" : "var(--border)";
        dot.style.color = isActive || isCompleted ? "#fff" : "var(--muted)";
      });
    }
    const labels = container.querySelectorAll('span[style*="font-weight"]');
    labels.forEach((label, i) => {
      const isActive = i === state.currentStep;
      label.style.fontWeight = isActive ? "600" : "400";
      label.style.color = isActive ? "var(--text)" : "var(--muted)";
    });
  }

  renderStep(0);
  updateProgress();
}

// ---------- Step Content ----------
function getStepContent(stepIndex) {
  switch (stepIndex) {
    case 0: return personalStep();
    case 1: return educationalStep();
    case 2: return documentsStep();
    case 3: return paymentStep();
    case 4: return reviewStep();
    default: return el("div", { text: "Unknown step" });
  }
}

// Step 1: Personal Details
function personalStep() {
  const wrap = el("div", { class: "form-grid" });
  const fields = [
    { key: "name", label: "Student Name *", type: "text" },
    { key: "gender", label: "Gender *", type: "select", options: GENDERS },
    { key: "dob", label: "Date of Birth *", type: "date" },
    { key: "bloodGroup", label: "Blood Group", type: "select", options: BLOOD },
    { key: "religion", label: "Religion", type: "select", options: RELIGIONS },
    { key: "category", label: "Category", type: "select", options: CATEGORIES }
  ];
  fields.forEach(f => {
    const row = el("div", { class: "form-row" });
    row.appendChild(el("label", { html: `${f.label} ${f.required ? '<span class="req">*</span>' : ""}` }));
    let inp;
    const val = state.data[f.key] ?? "";
    if (f.type === "select") {
      inp = el("select", { class: "select", "data-testid": `wizard-${f.key}` });
      inp.appendChild(el("option", { value: "", text: `Select ${f.label.replace("*","")}` }));
      f.options.forEach(o => inp.appendChild(el("option", { value: o, text: o })));
      inp.value = val;
    } else if (f.type === "date") {
      inp = el("input", { class: "input", type: "date", "data-testid": `wizard-${f.key}` });
      inp.value = val || todayISO();
    } else {
      inp = el("input", { class: "input", type: f.type || "text", "data-testid": `wizard-${f.key}` });
      inp.value = val;
    }
    inp.addEventListener("change", () => { state.data[f.key] = inp.value; });
    row.appendChild(inp);
    wrap.appendChild(row);
  });
  return wrap;
}

// Step 2: Educational Details
function educationalStep() {
  const wrap = el("div", { class: "form-grid" });
  const fields = [
    { key: "class", label: "Class *", type: "select", options: CLASSES },
    { key: "section", label: "Section", type: "select", options: SECTIONS },
    { key: "rollNumber", label: "Roll Number", type: "text" },
    { key: "previousSchool", label: "Previous School", type: "text" },
    { key: "admissionDate", label: "Admission Date", type: "date" },
    { key: "status", label: "Status", type: "select", options: ["Active", "Inactive", "Alumni"] }
  ];
  fields.forEach(f => {
    const row = el("div", { class: "form-row" });
    row.appendChild(el("label", { html: `${f.label} ${f.required ? '<span class="req">*</span>' : ""}` }));
    let inp;
    const val = state.data[f.key] ?? "";
    if (f.type === "select") {
      inp = el("select", { class: "select", "data-testid": `wizard-${f.key}` });
      inp.appendChild(el("option", { value: "", text: `Select ${f.label.replace("*","")}` }));
      f.options.forEach(o => inp.appendChild(el("option", { value: o, text: o })));
      inp.value = val;
    } else if (f.type === "date") {
      inp = el("input", { class: "input", type: "date", "data-testid": `wizard-${f.key}` });
      inp.value = val || todayISO();
    } else {
      inp = el("input", { class: "input", type: f.type || "text", "data-testid": `wizard-${f.key}` });
      inp.value = val;
    }
    inp.addEventListener("change", () => { state.data[f.key] = inp.value; });
    row.appendChild(inp);
    wrap.appendChild(row);
  });
  // Parents & Contact
  const parentFields = [
    { key: "fatherName", label: "Father's Name *", type: "text" },
    { key: "motherName", label: "Mother's Name", type: "text" },
    { key: "guardian", label: "Guardian", type: "text" },
    { key: "phone", label: "Phone *", type: "text" },
    { key: "emergencyContact", label: "Emergency Contact", type: "text" },
    { key: "email", label: "Email", type: "text" },
    { key: "address", label: "Address", type: "textarea" }
  ];
  parentFields.forEach(f => {
    const row = el("div", { class: "form-row" });
    row.appendChild(el("label", { html: `${f.label} ${f.required ? '<span class="req">*</span>' : ""}` }));
    let inp;
    const val = state.data[f.key] ?? "";
    if (f.type === "textarea") {
      inp = el("textarea", { class: "textarea", rows: 2, "data-testid": `wizard-${f.key}` });
      inp.value = val;
    } else {
      inp = el("input", { class: "input", type: f.type || "text", "data-testid": `wizard-${f.key}` });
      inp.value = val;
    }
    inp.addEventListener("change", () => { state.data[f.key] = inp.value; });
    row.appendChild(inp);
    wrap.appendChild(row);
  });
  return wrap;
}

// Step 3: Photo & Documents
function documentsStep() {
  const wrap = el("div");

  // Photo upload
  const photoSection = el("div", { style: "margin-bottom:20px;" });
  photoSection.appendChild(el("div", { class: "form-section-title", text: "Profile Photo" }));
  const photoWrap = el("div", { style: "display:flex; gap:16px; align-items:center;" });
  const avatar = el("div", { class: "avatar lg" });
  if (state.data.photoPreview) {
    avatar.appendChild(el("img", { src: state.data.photoPreview }));
  } else {
    avatar.textContent = initials(state.data.name || "S");
  }
  photoWrap.appendChild(avatar);
  const uploadBtn = el("button", { class: "btn btn-outline btn-sm", text: "Upload Photo" });
  const fileInput = el("input", { type: "file", accept: "image/*", style: "display:none;" });
  uploadBtn.onclick = () => fileInput.click();
  fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ type: "error", title: "File too large", message: "Max 5MB" });
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast({ type: "error", title: "Invalid file type" });
      return;
    }
    state.data.photoFile = file;
    state.data.photoPreview = URL.createObjectURL(file);
    avatar.innerHTML = "";
    avatar.appendChild(el("img", { src: state.data.photoPreview }));
  };
  photoWrap.appendChild(uploadBtn);
  photoWrap.appendChild(fileInput);
  photoSection.appendChild(photoWrap);
  wrap.appendChild(photoSection);

  // Documents upload
  const docSection = el("div");
  docSection.appendChild(el("div", { class: "form-section-title", text: "Supporting Documents" }));
  const docList = el("div", { style: "margin-bottom:12px;" });
  function renderDocList() {
    docList.innerHTML = "";
    if (state.documentFiles.length) {
      state.documentFiles.forEach((doc, idx) => {
        const row = el("div", { style: "display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid var(--border);" }, [
          el("span", { text: doc.name }),
          el("button", { class: "btn btn-sm btn-danger", onclick: () => {
            state.documentFiles.splice(idx, 1);
            renderDocList();
          }, html: ICON.trash })
        ]);
        docList.appendChild(row);
      });
    } else {
      docList.appendChild(el("div", { class: "state-sub", text: "No documents uploaded yet." }));
    }
  }
  renderDocList();
  docSection.appendChild(docList);

  const docUploadBtn = el("button", { class: "btn btn-outline btn-sm", text: "Upload Document" });
  const docFileInput = el("input", { type: "file", accept: ".pdf,.doc,.docx,.jpg,.jpeg,.png", style: "display:none;" });
  docUploadBtn.onclick = () => docFileInput.click();
  docFileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      toast({ type: "error", title: "File too large", message: "Max 10MB" });
      return;
    }
    const allowed = ["application/pdf", "image/jpeg", "image/png", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(file.type)) {
      toast({ type: "error", title: "Invalid file type", message: "PDF, DOC, DOCX, JPG, PNG only." });
      return;
    }
    state.documentFiles.push(file);
    renderDocList();
    toast({ type: "success", title: "Document added" });
  };
  docSection.appendChild(docUploadBtn);
  docSection.appendChild(docFileInput);
  wrap.appendChild(docSection);

  return wrap;
}

// Step 4: Payment Details
function paymentStep() {
  const wrap = el("div", { class: "form-grid" });
  const fields = [
    { key: "feeType", label: "Fee Type", type: "select", options: FEE_TYPES },
    { key: "amount", label: "Amount Due", type: "number" },
    { key: "paidAmount", label: "Paid Amount", type: "number" },
    { key: "paymentMode", label: "Payment Mode", type: "select", options: PAY_MODES },
    { key: "paymentDate", label: "Payment Date", type: "date" },
    { key: "paymentMonth", label: "For Month", type: "month" },
    { key: "paymentRemarks", label: "Remarks", type: "textarea" }
  ];
  fields.forEach(f => {
    const row = el("div", { class: "form-row" });
    row.appendChild(el("label", { text: f.label }));
    let inp;
    const val = state.data[f.key] ?? "";
    if (f.type === "select") {
      inp = el("select", { class: "select", "data-testid": `wizard-${f.key}` });
      inp.appendChild(el("option", { value: "", text: `Select ${f.label}` }));
      f.options.forEach(o => inp.appendChild(el("option", { value: o, text: o })));
      inp.value = val;
    } else if (f.type === "date") {
      inp = el("input", { class: "input", type: "date", "data-testid": `wizard-${f.key}` });
      inp.value = val || todayISO();
    } else if (f.type === "month") {
      inp = el("input", { class: "input", type: "month", "data-testid": `wizard-${f.key}` });
      inp.value = val || new Date().toISOString().slice(0, 7);
    } else if (f.type === "textarea") {
      inp = el("textarea", { class: "textarea", rows: 2, "data-testid": `wizard-${f.key}` });
      inp.value = val;
    } else {
      inp = el("input", { class: "input", type: f.type || "text", "data-testid": `wizard-${f.key}` });
      inp.value = val;
    }
    inp.addEventListener("change", () => { state.data[f.key] = inp.value; });
    row.appendChild(inp);
    wrap.appendChild(row);
  });
  return wrap;
}

// Step 5: Review & Submit
function reviewStep() {
  const wrap = el("div");
  const data = state.data;
  const sections = [
    { title: "Personal Details", fields: ["name", "gender", "dob", "bloodGroup", "religion", "category"] },
    { title: "Educational Details", fields: ["class", "section", "rollNumber", "previousSchool", "admissionDate", "status"] },
    { title: "Parents & Contact", fields: ["fatherName", "motherName", "guardian", "phone", "emergencyContact", "email", "address"] },
    { title: "Payment Details", fields: ["feeType", "amount", "paidAmount", "paymentMode", "paymentDate", "paymentMonth", "paymentRemarks"] }
  ];
  sections.forEach(sec => {
    wrap.appendChild(el("div", { style: "font-weight:600; margin-top:12px; font-size:14px;", text: sec.title }));
    const grid = el("div", { class: "detail-grid" });
    sec.fields.forEach(key => {
      let label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
      let value = data[key] || "—";
      if (key === "dob" || key === "admissionDate" || key === "paymentDate") value = fmtDate(value);
      if (key === "amount" || key === "paidAmount") value = value ? "₹" + Number(value).toFixed(2) : "—";
      grid.appendChild(el("div", { class: "detail-row" }, [
        el("div", { class: "k", text: label }),
        el("div", { class: "v", text: value })
      ]));
    });
    wrap.appendChild(grid);
  });
  // Photo and documents summary
  wrap.appendChild(el("div", { style: "font-weight:600; margin-top:12px; font-size:14px;", text: "Photo & Documents" }));
  const photoStatus = data.photoFile ? "Photo uploaded" : "No photo";
  wrap.appendChild(el("div", { style: "padding:8px 0;", text: `Photo: ${photoStatus}` }));
  const docStatus = state.documentFiles.length ? `${state.documentFiles.length} document(s) uploaded` : "No documents";
  wrap.appendChild(el("div", { style: "padding:8px 0;", text: `Documents: ${docStatus}` }));
  return wrap;
}

// ---------- Validation ----------
async function validateStep(stepIndex) {
  const data = state.data;
  switch (stepIndex) {
    case 0:
      if (!required(data.name)) { toast({ type: "error", title: "Validation", message: "Student Name is required." }); return false; }
      if (!required(data.gender)) { toast({ type: "error", title: "Validation", message: "Gender is required." }); return false; }
      if (!required(data.dob)) { toast({ type: "error", title: "Validation", message: "Date of Birth is required." }); return false; }
      return true;
    case 1:
      if (!required(data.class)) { toast({ type: "error", title: "Validation", message: "Class is required." }); return false; }
      if (!required(data.fatherName)) { toast({ type: "error", title: "Validation", message: "Father's name is required." }); return false; }
      if (!required(data.phone) || !isPhone(data.phone)) { toast({ type: "error", title: "Validation", message: "Valid phone number required." }); return false; }
      if (data.email && !isEmail(data.email)) { toast({ type: "error", title: "Validation", message: "Invalid email address." }); return false; }
      return true;
    case 2:
      return true;
    case 3:
      return true;
    case 4:
      return true;
    default:
      return true;
  }
}

// ---------- Submit ----------
async function submitAdmission() {
  const data = state.data;
  const studentPayload = {
    name: data.name,
    gender: data.gender,
    dob: data.dob,
    bloodGroup: data.bloodGroup,
    religion: data.religion,
    category: data.category,
    class: data.class,
    section: data.section,
    rollNumber: data.rollNumber,
    previousSchool: data.previousSchool,
    admissionDate: data.admissionDate,
    status: data.status,
    fatherName: data.fatherName,
    motherName: data.motherName,
    guardian: data.guardian,
    phone: data.phone,
    emergencyContact: data.emergencyContact,
    email: data.email,
    address: data.address
  };
  const err = validateStudent(studentPayload);
  if (err) { toast({ type: "error", title: "Validation error", message: err }); return; }

  toast({ type: "info", title: "Submitting admission...", message: "Please wait." });

  try {
    const created = await createStudent(studentPayload, state.data.photoFile);
    const studentId = created.id;

    // Upload documents
    if (state.documentFiles.length) {
      for (const file of state.documentFiles) {
        await addStudentDocument(studentId, file);
      }
    }

    // Record payment if provided
    const hasPayment = data.feeType && data.amount > 0 && data.paidAmount > 0 && data.paymentMode;
    if (hasPayment) {
      const balance = Number(data.amount) - Number(data.paidAmount);
      const status = balance <= 0 ? "Paid" : (Number(data.paidAmount) === 0 ? "Pending" : "Partial");
      await recordFeePayment({
        studentId: studentId,
        studentName: data.name,
        admissionNumber: created.admissionNumber,
        class: data.class,
        section: data.section,
        feeType: data.feeType,
        amount: Number(data.amount),
        paidAmount: Number(data.paidAmount),
        balance: balance,
        status: status,
        paymentMode: data.paymentMode,
        date: data.paymentDate || todayISO(),
        month: data.paymentMonth,
        remarks: data.paymentRemarks
      });
    }

    toast({ type: "success", title: "Admission successful", message: `Admission #${created.admissionNumber}` });
    resetState();
    const container = document.querySelector('[data-testid="admission-view"]');
    if (container) renderAdmissionWizard(container);
  } catch (e) {
    console.error(e);
    toast({ type: "error", title: "Admission failed", message: e.message || "Please try again." });
  }
}

function resetState() {
  state.currentStep = 0;
  state.data = {
    name: "", gender: "", dob: "", bloodGroup: "", religion: "", category: "",
    class: "", section: "", rollNumber: "", previousSchool: "", admissionDate: todayISO(), status: "Active",
    fatherName: "", motherName: "", guardian: "", phone: "", emergencyContact: "", email: "", address: "",
    photoFile: null, photoPreview: null,
    feeType: "", amount: 0, paidAmount: 0, paymentMode: "", paymentDate: todayISO(), paymentMonth: new Date().toISOString().slice(0, 7), paymentRemarks: ""
  };
  state.documentFiles = [];
}
