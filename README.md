# Voting System Test Automation

An end-to-end test automation project for a React-based Voting System, combining UI automation, acceptance testing, and structured test documentation. This project demonstrates practical implementation of modern QA practices using Cypress and Robot Framework.


## 🛠 Tech Stack
- Frontend: React.js
- UI Automation: Cypress
- Acceptance Testing: Robot Framework + SeleniumLibrary
- Languages: JavaScript, Python
- Test Documentation: Manual & Automated Reports

## ✨ Key Features
- Automated end-to-end voting workflow validation
- Cross-browser UI test automation using Cypress
- Acceptance-level test cases using Robot Framework
- Structured project documentation and test reporting
- Modular and scalable test design

## Project Structure

- **`voting-system/`**: The source code for the React-based Voting System application.
- **`cypress/`**: End-to-End (E2E) test suite using Cypress.
- **`robot-tests/`**: Acceptance test suite using Robot Framework.
- **`documentation/`**: Project documentation and test reports.

## Prerequisites

Ensure you have the following installed on your system:
- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [Python](https://www.python.org/) (for Robot Framework)
- [git](https://git-scm.com/)

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd voting-system-test-automation
    ```

2.  **Install Application Dependencies:**
    Navigate to the `voting-system` directory and install the necessary packages.
    ```bash
    cd voting-system
    npm install
    cd ..
    ```

3.  **Install Cypress Dependencies:**
    Install dependencies for the root project (where Cypress is configured).
    ```bash
    npm install
    ```

4.  **Install Robot Framework Dependencies:**
    It is recommended to use a virtual environment.
    ```bash
    pip install robotframework robotframework-seleniumlibrary
    ```

## Usage

### 1. Running the Application

Before running any tests, you must start the Voting System application.

```bash
cd voting-system
npm start
```

The application will launch at `http://localhost:3000`.

### 2. Running Cypress Tests

Open a new terminal window (keep the app running).

To open the Cypress Test Runner (interactive mode):
```bash
npx cypress open
```

To run Cypress tests in headless mode:
```bash
npx cypress run
```

### 3. Running Robot Framework Tests

Open a new terminal window (keep the app running).

```bash
robot robot-tests/voting-system-tests.robot
```

Test reports and logs will be generated in the root directory (or wherever you run the command from).

## Documentation

For more detailed information, please refer to the documents in the `documentation/` folder.

## 👤 Author
Muhammad Zubair Arif  
BS Software Engineering Student  
GitHub: https://github.com/Muhammad-Zubair312  
LinkedIn: https://linkedin.com/in/muhammadzubairarif
