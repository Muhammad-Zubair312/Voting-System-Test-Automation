*** Settings ***
Documentation     Robot Framework Test Suite for Online Voting System
...               Author: Hasnain Rasheed (BSEF22M519)
...               This suite covers functional testing, data validation, and security checks
Library           SeleniumLibrary
Library           Collections
Library           String
Library           DateTime
Suite Setup       Open Browser To Voting System
Suite Teardown    Close All Browsers
Test Setup        Reset Application State
Test Teardown     Run Keyword If Test Failed    Capture Page Screenshot

*** Variables ***
${URL}                http://localhost:3000
${BROWSER}            Chrome
${DELAY}              0.3s
${VALID_EMAIL}        test@example.com
${VALID_PASSWORD}     password123
${VALID_STUDENT_ID}   BSEF22M001
${VALID_NAME}         Test User

*** Keywords ***
Open Browser To Voting System
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    Set Selenium Speed    ${DELAY}
    Wait Until Page Contains Element    css:[data-testid="tab-login"]    10s

Reset Application State
    # Robust reset: Handle any stuck alerts from previous failed tests to prevent cascade failure
    Run Keyword And Ignore Error    Handle Alert    action=ACCEPT
    Execute Javascript    localStorage.clear()
    Reload Page
    Wait Until Page Contains Element    css:[data-testid="tab-login"]

Register New User
    [Arguments]    ${name}    ${email}    ${student_id}    ${password}
    Click Element    css:[data-testid="tab-register"]
    Wait Until Element Is Visible    css:[data-testid="register-form"]
    Input Text    css:[data-testid="register-fullname"]    ${name}
    Input Text    css:[data-testid="register-email"]    ${email}
    Input Text    css:[data-testid="register-studentid"]    ${student_id}
    Input Text    css:[data-testid="register-password"]    ${password}
    Input Text    css:[data-testid="register-confirm-password"]    ${password}
    Click Element    css:[data-testid="register-submit"]
    Sleep    0.5s

Login User
    [Arguments]    ${email}    ${password}
    Click Element    css:[data-testid="tab-login"]
    Wait Until Element Is Visible    css:[data-testid="login-form"]
    Input Text    css:[data-testid="login-email"]    ${email}
    Input Text    css:[data-testid="login-password"]    ${password}
    Click Element    css:[data-testid="login-submit"]
    Sleep    0.5s

*** Test Cases ***

# ================================================
# FUNCTIONAL TESTS - Registration Module
# ================================================

RF-TC-001: Verify Registration Form Elements
    [Tags]    Functional    Registration    UI
    Click Element    css:[data-testid="tab-register"]
    Wait Until Element Is Visible    css:[data-testid="register-form"]
    Element Should Be Visible    css:[data-testid="register-fullname"]
    Page Should Contain    Register to Vote

RF-TC-002: Successful User Registration
    [Tags]    Functional    Registration    Positive
    Register New User    ${VALID_NAME}    ${VALID_EMAIL}    ${VALID_STUDENT_ID}    ${VALID_PASSWORD}
    # FIXED: Text matches App.js exactly
    Alert Should Be Present    text=Registration successful! Please login.
    Wait Until Element Is Visible    css:[data-testid="login-form"]

RF-TC-003: Registration With Empty Fields
    [Tags]    Functional    Registration    Negative
    Click Element    css:[data-testid="tab-register"]
    Click Element    css:[data-testid="register-submit"]
    Wait Until Element Is Visible    css:[data-testid="error-message"]
    Element Should Contain    css:[data-testid="error-message"]    All fields are required

RF-TC-004: Registration With Password Mismatch
    [Tags]    Functional    Registration    Negative
    Click Element    css:[data-testid="tab-register"]
    Input Text    css:[data-testid="register-fullname"]    Test User
    Input Text    css:[data-testid="register-email"]    test@example.com
    Input Text    css:[data-testid="register-studentid"]    BSEF22M999
    Input Text    css:[data-testid="register-password"]    password123
    Input Text    css:[data-testid="register-confirm-password"]    different123
    Click Element    css:[data-testid="register-submit"]
    Wait Until Element Is Visible    css:[data-testid="error-message"]
    Element Should Contain    css:[data-testid="error-message"]    Passwords do not match

RF-TC-005: Registration With Short Password
    [Tags]    Functional    Registration    Negative    Security
    Click Element    css:[data-testid="tab-register"]
    Input Text    css:[data-testid="register-fullname"]    Test User
    Input Text    css:[data-testid="register-email"]    test2@example.com
    Input Text    css:[data-testid="register-studentid"]    BSEF22M888
    Input Text    css:[data-testid="register-password"]    123
    Input Text    css:[data-testid="register-confirm-password"]    123
    Click Element    css:[data-testid="register-submit"]
    Wait Until Element Is Visible    css:[data-testid="error-message"]
    Element Should Contain    css:[data-testid="error-message"]    at least 6 characters

RF-TC-006: Registration With Duplicate Email
    [Tags]    Functional    Registration    Negative    DataValidation
    Register New User    First User    duplicate@test.com    BSEF22M111    password123
    # Handle success alert for first user
    Alert Should Be Present    text=Registration successful! Please login.
    
    # Try to register again
    Click Element    css:[data-testid="tab-register"]
    Input Text    css:[data-testid="register-fullname"]    Second User
    Input Text    css:[data-testid="register-email"]    duplicate@test.com
    Input Text    css:[data-testid="register-studentid"]    BSEF22M222
    Input Text    css:[data-testid="register-password"]    password123
    Input Text    css:[data-testid="register-confirm-password"]    password123
    Click Element    css:[data-testid="register-submit"]
    Wait Until Element Is Visible    css:[data-testid="error-message"]
    Element Should Contain    css:[data-testid="error-message"]    Email already registered

RF-TC-007: Registration With Duplicate Student ID
    [Tags]    Functional    Registration    Negative    DataValidation
    Register New User    Student One    student1@test.com    BSEF22M333    password123
    Alert Should Be Present    text=Registration successful! Please login.
    
    Click Element    css:[data-testid="tab-register"]
    Input Text    css:[data-testid="register-fullname"]    Student Two
    Input Text    css:[data-testid="register-email"]    student2@test.com
    Input Text    css:[data-testid="register-studentid"]    BSEF22M333
    Input Text    css:[data-testid="register-password"]    password123
    Input Text    css:[data-testid="register-confirm-password"]    password123
    Click Element    css:[data-testid="register-submit"]
    Wait Until Element Is Visible    css:[data-testid="error-message"]
    Element Should Contain    css:[data-testid="error-message"]    Student ID already registered

# ================================================
# FUNCTIONAL TESTS - Login Module
# ================================================

RF-TC-008: Verify Login Form Elements
    [Tags]    Functional    Login    UI
    Click Element    css:[data-testid="tab-login"]
    Wait Until Element Is Visible    css:[data-testid="login-form"]
    Element Should Be Visible    css:[data-testid="login-submit"]

RF-TC-009: Successful User Login
    [Tags]    Functional    Login    Positive
    Register New User    Login User    login@test.com    BSEF22M444    securepass123
    Alert Should Be Present    text=Registration successful! Please login.
    Login User    login@test.com    securepass123
    Wait Until Element Is Visible    css:[data-testid="elections-list"]
    Page Should Contain    Login User

RF-TC-010: Login With Invalid Credentials
    [Tags]    Functional    Login    Negative    Security
    Click Element    css:[data-testid="tab-login"]
    Input Text    css:[data-testid="login-email"]    wrong@test.com
    Input Text    css:[data-testid="login-password"]    wrongpassword
    Click Element    css:[data-testid="login-submit"]
    Wait Until Element Is Visible    css:[data-testid="login-error"]
    Element Should Contain    css:[data-testid="login-error"]    Invalid email or password

RF-TC-011: Login With Empty Credentials
    [Tags]    Functional    Login    Negative
    Click Element    css:[data-testid="tab-login"]
    Click Element    css:[data-testid="login-submit"]
    Element Should Be Visible    css:[data-testid="login-email"]

RF-TC-012: Successful Logout
    [Tags]    Functional    Login    Positive
    Register New User    Logout User    logout@test.com    BSEF22M555    password123
    Alert Should Be Present    text=Registration successful! Please login.
    Login User    logout@test.com    password123
    Wait Until Element Is Visible    css:[data-testid="logout-button"]
    Click Element    css:[data-testid="logout-button"]
    Wait Until Element Is Visible    css:[data-testid="login-form"]

# ================================================
# FUNCTIONAL TESTS - Voting Module
# ================================================

RF-TC-013: View Active Elections After Login
    [Tags]    Functional    Voting    Positive
    Register New User    Voter User    voter@test.com    BSEF22M666    password123
    Alert Should Be Present    text=Registration successful! Please login.
    Login User    voter@test.com    password123
    Wait Until Element Is Visible    css:[data-testid="elections-list"]
    Element Should Be Visible    css:[data-testid="election-e1"]

RF-TC-014: Cast Vote Successfully
    [Tags]    Functional    Voting    Positive    Critical
    Register New User    Voting User    voting@test.com    BSEF22M777    password123
    Alert Should Be Present    text=Registration successful! Please login.
    Login User    voting@test.com    password123
    Wait Until Element Is Visible    css:[data-testid="elections-list"]
    # Voting for Candidate 1 (Hasnain Rasheed Chaudhari in your App.js)
    Click Element    css:[data-testid="vote-c1"]
    Alert Should Be Present    text=Vote cast for Hasnain Rasheed Chaudhari!
    Wait Until Element Is Visible    css:[data-testid="voted-badge"]

RF-TC-015: Prevent Duplicate Voting
    [Tags]    Functional    Voting    Negative    Security    Critical
    Register New User    Duplicate Voter    dupvote@test.com    BSEF22M888    password123
    Alert Should Be Present    text=Registration successful! Please login.
    Login User    dupvote@test.com    password123
    Wait Until Element Is Visible    css:[data-testid="elections-list"]
    Click Element    css:[data-testid="vote-c1"]
    Alert Should Be Present    text=Vote cast for Hasnain Rasheed Chaudhari!
    Sleep    1s
    Element Should Not Be Visible    css:[data-testid="vote-c1"]
    Element Should Be Visible    css:[data-testid="voted-badge"]

RF-TC-016: Vote In Multiple Elections
    [Tags]    Functional    Voting    Positive
    Register New User    Multi Voter    multivote@test.com    BSEF22M999    password123
    Alert Should Be Present    text=Registration successful! Please login.
    Login User    multivote@test.com    password123
    Wait Until Element Is Visible    css:[data-testid="elections-list"]
    
    # Vote in first election
    ${element1}=    Get WebElement    css:[data-testid="election-e1"] [data-testid="vote-c1"]
    Click Element    ${element1}
    Alert Should Be Present    text=Vote cast for Hasnain Rasheed Chaudhari!
    
    # Vote in second election (Candidate 4 is Ch Usama Asghar Gujjar)
    ${element2}=    Get WebElement    css:[data-testid="election-e2"] [data-testid="vote-c4"]
    Click Element    ${element2}
    Alert Should Be Present    text=Vote cast for Ch Usama Asghar Gujjar!
    
    # Verify both votes recorded
    ${badges}=    Get Element Count    css:[data-testid="voted-badge"]
    Should Be True    ${badges} >= 2

RF-TC-017: View Election Details
    [Tags]    Functional    Voting    UI
    Register New User    Detail Viewer    detail@test.com    BSEF22M1000    password123
    Alert Should Be Present    text=Registration successful! Please login.
    Login User    detail@test.com    password123
    Wait Until Element Is Visible    css:[data-testid="elections-list"]
    Page Should Contain    General Elections 2024

# ================================================
# FUNCTIONAL TESTS - Results Module
# ================================================

RF-TC-018: View Results Page
    [Tags]    Functional    Results    Positive
    Register New User    Results Viewer    results@test.com    BSEF22M1100    password123
    Alert Should Be Present    text=Registration successful! Please login.
    Login User    results@test.com    password123
    # Vote for Candidate 2 (Hamza Rashhed Gujjar)
    Click Element    css:[data-testid="vote-c2"]
    Alert Should Be Present    text=Vote cast for Hamza Rashhed Gujjar!
    Click Element    css:[data-testid="tab-results"]
    Wait Until Element Is Visible    css:[data-testid="results-page"]
    Page Should Contain    Election Results

RF-TC-019: Verify Vote Count Display
    [Tags]    Functional    Results    DataValidation
    Register New User    Count Checker    count@test.com    BSEF22M1200    password123
    Alert Should Be Present    text=Registration successful! Please login.
    Login User    count@test.com    password123
    Click Element    css:[data-testid="vote-c1"]
    Alert Should Be Present    text=Vote cast for Hasnain Rasheed Chaudhari!
    Click Element    css:[data-testid="tab-results"]
    Wait Until Element Is Visible    css:[data-testid="results-page"]
    Page Should Contain    Total Votes:

RF-TC-020: Verify Percentage Calculation
    [Tags]    Functional    Results    DataValidation
    Register New User    Percent User    percent@test.com    BSEF22M1300    password123
    Alert Should Be Present    text=Registration successful! Please login.
    Login User    percent@test.com    password123
    # Vote for Candidate 6 (Hamza Chaudhari)
    Click Element    css:[data-testid="vote-c6"]
    Alert Should Be Present    text=Vote cast for Hamza Chaudhari!
    Click Element    css:[data-testid="tab-results"]
    Wait Until Element Is Visible    css:[data-testid="results-page"]
    Page Should Contain    %

RF-TC-021: Verify Results Update After Vote
    [Tags]    Functional    Results    DataValidation    Critical
    Register New User    Update Tester    update@test.com    BSEF22M1400    password123
    Alert Should Be Present    text=Registration successful! Please login.
    Login User    update@test.com    password123
    # Go back and vote
    Click Element    css:[data-testid="vote-c2"]
    Alert Should Be Present    text=Vote cast for Hamza Rashhed Gujjar!
    # Check updated results
    Click Element    css:[data-testid="tab-results"]
    Wait Until Element Is Visible    css:[data-testid="results-page"]
    Page Should Contain    Total Votes:

# ================================================
# DATA VALIDATION & SECURITY
# ================================================

RF-TC-022: Validate Email Format
    [Tags]    DataValidation    Registration
    Click Element    css:[data-testid="tab-register"]
    Input Text    css:[data-testid="register-fullname"]    Email Test
    Input Text    css:[data-testid="register-email"]    invalidemail
    Input Text    css:[data-testid="register-studentid"]    BSEF22M1500
    Input Text    css:[data-testid="register-password"]    password123
    Input Text    css:[data-testid="register-confirm-password"]    password123
    ${validation}=    Execute Javascript    return document.querySelector('[data-testid="register-email"]').validity.valid
    Should Be Equal    ${validation}    ${False}

RF-TC-023: Validate Student ID Format
    [Tags]    DataValidation    Registration
    Click Element    css:[data-testid="tab-register"]
    Input Text    css:[data-testid="register-studentid"]    BSEF22M1600
    ${value}=    Get Value    css:[data-testid="register-studentid"]
    Should Be Equal    ${value}    BSEF22M1600

RF-TC-024: Validate Data Persistence
    [Tags]    DataValidation    Storage
    Register New User    Persist User    persist@test.com    BSEF22M1700    password123
    Alert Should Be Present    text=Registration successful! Please login.
    ${users}=    Execute Javascript    return JSON.parse(localStorage.getItem('votingUsers'))
    Should Not Be Empty    ${users}

RF-TC-025: Validate Session Persistence
    [Tags]    DataValidation    Session
    Register New User    Session User    session@test.com    BSEF22M1800    password123
    Alert Should Be Present    text=Registration successful! Please login.
    Login User    session@test.com    password123
    Reload Page
    Wait Until Element Is Visible    css:[data-testid="elections-list"]
    Page Should Contain    Session User

RF-TC-026: Verify Authentication Required For Voting
    [Tags]    Security    Critical
    Element Should Not Be Visible    css:[data-testid="elections-list"]
    Element Should Be Visible    css:[data-testid="login-form"]

RF-TC-027: Verify Authentication Required For Results
    [Tags]    Security    Critical
    Element Should Not Be Visible    css:[data-testid="tab-results"]

RF-TC-028: Verify Password Minimum Length
    [Tags]    Security    Registration
    Click Element    css:[data-testid="tab-register"]
    Input Text    css:[data-testid="register-fullname"]    Short Pass User
    Input Text    css:[data-testid="register-email"]    short@test.com
    Input Text    css:[data-testid="register-studentid"]    BSEF22M1900
    Input Text    css:[data-testid="register-password"]    12345
    Input Text    css:[data-testid="register-confirm-password"]    12345
    Click Element    css:[data-testid="register-submit"]
    Wait Until Element Is Visible    css:[data-testid="error-message"]
    Element Should Contain    css:[data-testid="error-message"]    at least 6 characters

RF-TC-029: Verify Logout Clears Session
    [Tags]    Security    Critical
    Register New User    Logout Test    logouttest@test.com    BSEF22M2000    password123
    Alert Should Be Present    text=Registration successful! Please login.
    Login User    logouttest@test.com    password123
    Click Element    css:[data-testid="logout-button"]
    ${currentUser}=    Execute Javascript    return localStorage.getItem('currentUser')
    Should Be Equal    ${currentUser}    null

RF-TC-030: Verify Vote Integrity
    [Tags]    Security    Voting    Critical
    Register New User    Integrity User    integrity@test.com    BSEF22M2100    password123
    Alert Should Be Present    text=Registration successful! Please login.
    Login User    integrity@test.com    password123
    Wait Until Element Is Visible    css:[data-testid="elections-list"]
    Click Element    css:[data-testid="vote-c1"]
    Alert Should Be Present    text=Vote cast for Hasnain Rasheed Chaudhari!
    ${votes}=    Execute Javascript    return JSON.parse(localStorage.getItem('votes'))
    ${voteCount}=    Get Length    ${votes}
    Should Be True    ${voteCount} > 0

# ================================================
# UI/UX & INTEGRATION
# ================================================

RF-TC-031: Verify Page Title And Branding
    [Tags]    UI    UX
    Page Should Contain    Secure Online Voting System
    Page Should Contain    Transparent, Secure, and Democratic

RF-TC-032: Verify Navigation Tabs Functionality
    [Tags]    UI    UX
    Click Element    css:[data-testid="tab-register"]
    Element Should Be Visible    css:[data-testid="register-form"]
    Click Element    css:[data-testid="tab-login"]
    Element Should Be Visible    css:[data-testid="login-form"]

RF-TC-033: Verify Footer Information
    [Tags]    UI    UX
    Page Should Contain    Hasnain Rasheed
    # REMOVED: Page Should Contain    Muhammad Zubair (Solo project)
    Page Should Contain    Software Quality Engineering Project

RF-TC-034: Verify Error Messages Display
    [Tags]    UI    UX
    Click Element    css:[data-testid="tab-register"]
    Click Element    css:[data-testid="register-submit"]
    Wait Until Element Is Visible    css:[data-testid="error-message"]
    Element Should Be Visible    css:[data-testid="error-message"]

RF-TC-035: Verify Success Feedback
    [Tags]    UI    UX
    Register New User    Feedback User    feedback@test.com    BSEF22M2200    password123
    Alert Should Be Present    text=Registration successful! Please login.

RF-TC-036: Verify Page Load Time
    [Tags]    Performance
    ${start}=    Get Time    epoch
    Reload Page
    Wait Until Element Is Visible    css:[data-testid="tab-login"]
    ${end}=    Get Time    epoch
    ${loadTime}=    Evaluate    ${end} - ${start}
    Should Be True    ${loadTime} < 5

RF-TC-037: Verify Responsive Design
    [Tags]    Performance    UI
    Set Window Size    1920    1080
    Element Should Be Visible    css:[data-testid="tab-login"]
    Set Window Size    375    667
    Element Should Be Visible    css:[data-testid="tab-login"]

RF-TC-038: Complete User Journey Integration Test
    [Tags]    Integration    Critical    E2E
    Register New User    Journey User    journey@test.com    BSEF22M2300    password123
    Alert Should Be Present    text=Registration successful! Please login.
    Login User    journey@test.com    password123
    Wait Until Element Is Visible    css:[data-testid="elections-list"]
    Click Element    css:[data-testid="vote-c2"]
    Alert Should Be Present    text=Vote cast for Hamza Rashhed Gujjar!
    Element Should Be Visible    css:[data-testid="voted-badge"]
    Click Element    css:[data-testid="tab-results"]
    Wait Until Element Is Visible    css:[data-testid="results-page"]
    Page Should Contain    Total Votes:
    Click Element    css:[data-testid="tab-elections"]
    Click Element    css:[data-testid="logout-button"]
    Wait Until Element Is Visible    css:[data-testid="login-form"]

RF-TC-039: Multi-User Voting Integration
    [Tags]    Integration    Critical
    # User 1
    Register New User    User One    user1@test.com    BSEF22M2400    password123
    Alert Should Be Present    text=Registration successful! Please login.
    Login User    user1@test.com    password123
    Click Element    css:[data-testid="vote-c1"]
    Alert Should Be Present    text=Vote cast for Hasnain Rasheed Chaudhari!
    Click Element    css:[data-testid="logout-button"]
    
    # User 2
    Register New User    User Two    user2@test.com    BSEF22M2500    password123
    Alert Should Be Present    text=Registration successful! Please login.
    Login User    user2@test.com    password123
    Click Element    css:[data-testid="vote-c2"]
    Alert Should Be Present    text=Vote cast for Hamza Rashhed Gujjar!
    
    # Check results
    Click Element    css:[data-testid="tab-results"]
    Wait Until Element Is Visible    css:[data-testid="results-page"]
    Page Should Contain    Total Votes:

RF-TC-040: Data Consistency Integration Test
    [Tags]    Integration    DataValidation
    Register New User    Consistency User    consistency@test.com    BSEF22M2600    password123
    Alert Should Be Present    text=Registration successful! Please login.
    Login User    consistency@test.com    password123
    Click Element    css:[data-testid="vote-c6"]
    Alert Should Be Present    text=Vote cast for Hamza Chaudhari!
    ${votesBefore}=    Execute Javascript    return JSON.parse(localStorage.getItem('votes')).length
    Reload Page
    ${votesAfter}=    Execute Javascript    return JSON.parse(localStorage.getItem('votes')).length
    Should Be Equal    ${votesBefore}    ${votesAfter}

*** Keywords ***
# Additional custom keywords can be added here for reusability