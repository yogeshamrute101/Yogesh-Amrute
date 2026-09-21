import { SystemType } from "./UniversalSystemBuilder";

export interface SystemTemplate {
  type: SystemType;
  modules: string[];
}

export const SYSTEM_TEMPLATES: SystemTemplate[] = [
  {
    type: "ERP",
    modules: [
      "Identity",
      "Organization",
      "Finance",
      "Procurement",
      "Inventory",
      "Sales",
      "Projects",
      "Reporting",
      "Workflow",
      "Audit",
    ],
  },
  {
    type: "LIMS",
    modules: [
      "Sample Management",
      "Test Management",
      "Laboratory Workflow",
      "Results",
      "Instruments",
      "Quality Control",
      "Inventory",
      "Reporting",
      "Audit",
      "Access Control",
    ],
  },
  {
    type: "CRM",
    modules: [
      "Contacts",
      "Accounts",
      "Leads",
      "Opportunities",
      "Activities",
      "Communication",
      "Reporting",
      "Workflow",
    ],
  },
  {
    type: "MES",
    modules: [
      "Production",
      "Work Orders",
      "Machines",
      "Materials",
      "Quality",
      "Traceability",
      "Scheduling",
      "Maintenance",
      "Reporting",
    ],
  },
  {
    type: "QMS",
    modules: [
      "Quality Events",
      "CAPA",
      "Documents",
      "Audits",
      "Nonconformance",
      "Risk",
      "Training",
      "Change Control",
    ],
  },
];
