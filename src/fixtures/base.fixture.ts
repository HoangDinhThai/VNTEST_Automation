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
});

export { expect };
