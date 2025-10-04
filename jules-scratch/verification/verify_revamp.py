from playwright.sync_api import Page, expect, sync_playwright

def verify_frontend(page: Page):
    """
    This script verifies the new frontend UI by logging in as both
    an employee and a manager, and taking screenshots of the key pages.
    """
    try:
        # Login as Employee
        page.goto("http://localhost:3000/login")
        page.get_by_label("Username").fill("employee")
        page.get_by_label("Password").fill("password")
        page.get_by_role("button", name="Sign In").click()

        # Dashboard
        expect(page.get_by_text("Dashboard", exact=True)).to_be_visible(timeout=10000)
        page.screenshot(path="jules-scratch/verification/01_employee_dashboard.png")

        # Submit Expense Page
        page.get_by_role("link", name="Submit Expense").click()
        expect(page.get_by_text("Submit a New Expense")).to_be_visible()
        page.screenshot(path="jules-scratch/verification/02_submit_expense.png")

        # Expense History Page
        page.get_by_role("link", name="Expense History").click()
        expect(page.get_by_text("My Expense History")).to_be_visible()
        page.screenshot(path="jules-scratch/verification/03_expense_history.png")

        # Logout
        page.get_by_text("Logout").click()
        expect(page.get_by_text("Sign in")).to_be_visible()

        # Login as Manager
        page.get_by_label("Username").fill("manager")
        page.get_by_label("Password").fill("password")
        page.get_by_role("button", name="Sign In").click()

        # Approvals Page
        expect(page.get_by_text("Dashboard", exact=True)).to_be_visible(timeout=10000)
        page.get_by_role("link", name="Approve Expenses").click()
        expect(page.get_by_text("Approve Expenses")).to_be_visible()
        page.screenshot(path="jules-scratch/verification/04_approval_page.png")

    except Exception as e:
        print(f"An error occurred during verification: {e}")
        page.screenshot(path="jules-scratch/verification/error.png")


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        verify_frontend(page)
        browser.close()

if __name__ == "__main__":
    main()