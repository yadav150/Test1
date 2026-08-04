// Admission view – now uses the multi-step wizard
import { setCrumbs } from "../ui.js";
import { renderAdmissionWizard } from "./admission-wizard.js";

export function AdmissionView() {
  setCrumbs([{ label: "Admission" }]);
  const container = el("div", { "data-testid": "admission-view" });
  renderAdmissionWizard(container);
  return container;
}
