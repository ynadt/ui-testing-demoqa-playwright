# UI Automation Testing with Playwright

This project contains UI automation tests for demoqa.com using Playwright. The tests cover various pages and user interactions on the website using JavaScript, Page Object Model (POM), and cross-browser testing.

## Table of Contents
- [Requirements](#requirements)
- [Installation](#installation)
- [Running Tests](#running-tests)
- [Project Structure](#project-structure)
- [Continuous Integration (CI)](#continuous-integration-ci)
- [Test Coverage](#test-coverage)
- [Contributing](#contributing)

---

## Requirements

```text
Node.js (>= 18)
npm (Node Package Manager)
Playwright browsers
```

---

## Installation

### Clone this repository:
```bash
git clone https://github.com/ynadt/ui-testing-demoqa-playwright.git
```

### Navigate to the project directory:
```bash
cd ui-testing-demoqa-playwright
```

### Install dependencies:
```bash
npm install
```

### Install Playwright browsers:
```bash
npm run prepare
```

---

## Running Tests

### Run All Tests
```bash
npm test
```
```text
Runs all tests across all configured projects (browsers and viewports).
```

### Generate and View Test Report
```bash
# Run tests and generate report
npm test

# Open the HTML report
npm run test:report
```

### Run Tests by Page/Section
```bash
# Form page tests
npm run test:form

# Alerts page tests
npm run test:alerts

# Select Menu page tests
npm run test:select

# Text Box page tests
npm run test:textbox

# ToolTips page tests
npm run test:tooltips

# Run tests tagged with @runThis
npm run test:runThis
```

### Run Tests by Browser
```bash
# Chrome only
npm run test:chrome

# Firefox only
npm run test:firefox
```

### Run Tests by Viewport Size
```bash
# Desktop (1920x1080)
npm run test:1920

# Laptop (1366x768)
npm run test:1366
```

### Run Tests with Specific Keywords
```bash
# Replace "keyword" with your search term
npm run test:grep -- "keyword"
```

### Run Tests in UI Mode
```bash
# Interactive test runner
npm run test:ui
```

### Run Tests for CI/CD
```bash
# With 4 parallel workers
npm run test:ci
```

### Clean Test Artifacts
```bash
# Remove test results and reports
npm run clean
```

---


## Continuous Integration (CI)

This project includes GitHub Actions CI/CD configuration. Tests automatically run on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop`
- Manual trigger via `workflow_dispatch`

### CI Workflow Details:
```text
Environment: ubuntu-latest
Browsers: Chrome, Firefox
Viewports: 1920x1080, 1366x768
Parallel Workers: 4
Reports: HTML, JSON, JUnit formats
Artifacts Retention: 30 days
```
