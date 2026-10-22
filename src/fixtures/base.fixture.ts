import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { LeadsPage } from '../pages/leads.page';
import { CustomersPage } from '../pages/customers.page';
import { PartnersPage } from '../pages/partners.page';
import { CollaboratorsPage } from '../pages/collaborators.page';
import { SingleCriteriaPage } from '../pages/single-criteria.page';
import { PersonnelPage } from '../pages/personnel.page';
import { FormulaPage } from '../pages/formula.page';
import { TestRequestsPage } from '../pages/test-requests.page';
import { TestRequestReceptionPage } from '../pages/test-request-reception.page';
import { TaskAssignmentPage } from '../pages/task-assignment.page';

// Định nghĩa kiểu dữ liệu cho custom fixtures
type CustomFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  leadsPage: LeadsPage;
  customersPage: CustomersPage;
  partnersPage: PartnersPage;
  collaboratorsPage: CollaboratorsPage;
  singleCriteriaPage: SingleCriteriaPage;
  personnelPage: PersonnelPage;
  formulaPage: FormulaPage;
  testRequestsPage: TestRequestsPage;
  testRequestReceptionPage: TestRequestReceptionPage;
  taskAssignmentPage: TaskAssignmentPage;
};

/**
 * Mở rộng test của Playwright với các Page Objects được khởi tạo sẵn
 */
export const test = base.extend<CustomFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  dashboardPage: async ({ page }, use) => {
    const dashboardPage = new DashboardPage(page);
    await use(dashboardPage);
  },
  leadsPage: async ({ page }, use) => {
    const leadsPage = new LeadsPage(page);
    await use(leadsPage);
  },
  customersPage: async ({ page }, use) => {
    const customersPage = new CustomersPage(page);
    await use(customersPage);
  },
  partnersPage: async ({ page }, use) => {
    const partnersPage = new PartnersPage(page);
    await use(partnersPage);
  },
  collaboratorsPage: async ({ page }, use) => {
    const collaboratorsPage = new CollaboratorsPage(page);
    await use(collaboratorsPage);
  },
  singleCriteriaPage: async ({ page }, use) => {
    const singleCriteriaPage = new SingleCriteriaPage(page);
    await use(singleCriteriaPage);
  },
  personnelPage: async ({ page }, use) => {
    const personnelPage = new PersonnelPage(page);
    await use(personnelPage);
  },
  formulaPage: async ({ page }, use) => {
    const formulaPage = new FormulaPage(page);
    await use(formulaPage);
  },
  testRequestsPage: async ({ page }, use) => {
    const testRequestsPage = new TestRequestsPage(page);
    await use(testRequestsPage);
  },
  testRequestReceptionPage: async ({ page }, use) => {
    const testRequestReceptionPage = new TestRequestReceptionPage(page);
    await use(testRequestReceptionPage);
  },
  taskAssignmentPage: async ({ page }, use) => {
    const taskAssignmentPage = new TaskAssignmentPage(page);
    await use(taskAssignmentPage);
  },
});

export { expect };
