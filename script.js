"use strict";

/*
|--------------------------------------------------------------------------
| APPLICATION CONFIGURATION
|--------------------------------------------------------------------------
|
| No manual organization-name input is required from the user.
| The certificate is issued by the program itself.
|
| Do not replace this with a real university, government body, or
| accreditation organization unless you actually have authorization
| to issue certificates under that organization.
|
*/

const APP_CONFIG = {
    issuerName: "Certificate Rewards Program",
    issuerSubtitle: "Professional Skills Recognition Program",
    authorizedSignatory: "Program Authorized Signatory",
    certificatePrefix: "CRP",
    demoMode: false
};


/*
|--------------------------------------------------------------------------
| PRIZES
|--------------------------------------------------------------------------
*/

const PRIZES = [
    {
        id: "AI_ASSISTANT_WEB_DEVELOPER",
        name: "AI Assistant Web Developer",
        type: "certificate",
        description: "You received a professional certificate reward.",
        program: "AI Assistant Web Developer Certificate Program"
    },
    {
        id: "WEB_DEVELOPER",
        name: "Web Developer",
        type: "certificate",
        description: "You received a professional certificate reward.",
        program: "Web Developer Certificate Program"
    },
    {
        id: "FULL_STACK_WEB_DEVELOPER",
        name: "Full Stack Web Developer",
        type: "certificate",
        description: "You received a professional certificate reward.",
        program: "Full Stack Web Developer Certificate Program"
    },
    {
        id: "SOFTWARE_DEVELOPER",
        name: "Software Developer",
        type: "certificate",
        description: "You received a professional certificate reward.",
        program: "Software Developer Certificate Program"
    },
    {
        id: "SOFTWARE_ENGINEER",
        name: "Software Engineer",
        type: "certificate",
        description: "You received a professional certificate reward.",
        program: "Software Engineering Certificate Program"
    },
    {
        id: "DATA_ANALYST",
        name: "Data Analyst",
        type: "certificate",
        description: "You received a professional certificate reward.",
        program: "Data Analytics Certificate Program"
    },
    {
        id: "FRONTEND_DEVELOPER",
        name: "Frontend Developer",
        type: "certificate",
        description: "You received a professional certificate reward.",
        program: "Frontend Development Certificate Program"
    },
    {
        id: "BACKEND_DEVELOPER",
        name: "Backend Developer",
        type: "certificate",
        description: "You received a professional certificate reward.",
        program: "Backend Development Certificate Program"
    },
    {
        id: "PYTHON_DEVELOPER",
        name: "Python Developer",
        type: "certificate",
        description: "You received a professional certificate reward.",
        program: "Python Development Certificate Program"
    },
    {
        id: "AI_DEVELOPER",
        name: "AI Developer",
        type: "certificate",
        description: "You received a professional certificate reward.",
        program: "AI Development Certificate Program"
    },
    {
        id: "DATA_SCIENCE",
        name: "Data Science",
        type: "certificate",
        description: "You received a professional certificate reward.",
        program: "Data Science Certificate Program"
    },
    {
        id: "CYBERSECURITY",
        name: "Cybersecurity Professional",
        type: "certificate",
        description: "You received a professional certificate reward.",
        program: "Cybersecurity Professional Certificate Program"
    },
    {
        id: "CLOUD_COMPUTING",
        name: "Cloud Computing Professional",
        type: "certificate",
        description: "You received a professional certificate reward.",
        program: "Cloud Computing Professional Certificate Program"
    },
    {
        id: "DEVOPS",
        name: "DevOps Professional",
        type: "certificate",
        description: "You received a professional certificate reward.",
        program: "DevOps Professional Certificate Program"
    },
    {
        id: "JAVASCRIPT_DEVELOPER",
        name: "JavaScript Developer",
        type: "certificate",
        description: "You received a professional certificate reward.",
        program: "JavaScript Development Certificate Program"
    },
    {
        id: "TECHNICAL_SOFTWARE",
        name: "Technical Software Professional",
        type: "certificate",
        description: "You received a professional certificate reward.",
        program: "Technical Software Professional Certificate Program"
    },

    {
        id: "CODING_LEARNING_REWARD",
        name: "Coding Learning Reward",
        type: "reward",
        description: "You received a learning reward for your development journey.",
        program: "Coding Learning Reward Program"
    },
    {
        id: "DEVELOPER_PRACTICE_REWARD",
        name: "Developer Practice Reward",
        type: "reward",
        description: "You received a reward for continued developer practice.",
        program: "Developer Practice Reward Program"
    },
    {
        id: "TECHNOLOGY_EXPLORER_REWARD",
        name: "Technology Explorer Reward",
        type: "reward",
        description: "You received a technology exploration reward.",
        program: "Technology Explorer Reward Program"
    },
    {
        id: "NEXT_CHALLENGE_REWARD",
        name: "Next Challenge Reward",
        type: "reward",
        description: "You received a reward for your next development challenge.",
        program: "Next Challenge Reward Program"
    }
];


/*
|--------------------------------------------------------------------------
| DOM
|--------------------------------------------------------------------------
*/

const $ = (id) => document.getElementById(id);

const screens = {
    welcome: $("welcomeScreen"),
    spinner: $("spinnerScreen"),
    result: $("resultScreen"),
    claim: $("claimScreen"),
    generation: $("generationScreen"),
    certificate: $("certificateScreen")
};

const wheel = $("wheel");
const wheelLabels = $("wheelLabels");
const wheelArea = $("wheelArea");
const spinButton = $("spinButton");

const startButton = $("startButton");
const claimButton = $("claimButton");
const spinAgainButton = $("spinAgainButton");
const backToResultButton = $("backToResultButton");
const editCertificateButton = $("editCertificateButton");
const printCertificateButton = $("printCertificateButton");

const claimForm = $("claimForm");

let currentPrize = null;
let currentPrizeIndex = -1;
let currentRotation = 0;
let currentRound = 1;
let isSpinning = false;

let userClaimData = null;


/*
|--------------------------------------------------------------------------
| SCREEN TRANSITION
|--------------------------------------------------------------------------
*/

function showScreen(screen) {

    Object.values(screens).forEach((item) => {
        if (item) {
            item.classList.remove("active");
        }
    });

    if (screen) {
        screen.classList.add("active");
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/*
|--------------------------------------------------------------------------
| WELCOME MESSAGE
|--------------------------------------------------------------------------
*/

const welcomeMessages = [
    "Your opportunity is ready.",
    "A professional reward is waiting.",
    "Discover what your next achievement could be.",
    "Your next certificate may be one spin away."
];

let welcomeMessageIndex = 0;

function rotateWelcomeMessage() {

    if (!$("welcomeEncouragement")) {
        return;
    }

    $("welcomeEncouragement").textContent =
        welcomeMessages[welcomeMessageIndex];

    welcomeMessageIndex =
        (welcomeMessageIndex + 1) % welcomeMessages.length;
}


/*
|--------------------------------------------------------------------------
| WHEEL
|--------------------------------------------------------------------------
*/

function initializeWheel() {

    if (!wheel || !wheelLabels) {
        return;
    }

    wheel.innerHTML = "";
    wheelLabels.innerHTML = "";

    const count = PRIZES.length;
    const segmentAngle = 360 / count;

    const segmentColors = [
        "#f5f5f5",
        "#ffffff"
    ];

    PRIZES.forEach((prize, index) => {

        const segment = document.createElement("div");

        segment.className = "wheel-segment";

        segment.style.transform =
            `rotate(${index * segmentAngle}deg)`;

        segment.style.background =
            segmentColors[index % segmentColors.length];

        wheel.appendChild(segment);


        const label = document.createElement("div");

        label.className = "wheel-label";

        label.textContent = prize.name;

        const angle =
            index * segmentAngle + segmentAngle / 2;

        label.style.transform =
            `rotate(${angle}deg) translateX(0)`;

        wheelLabels.appendChild(label);
    });
}


/*
|--------------------------------------------------------------------------
| TIME CONTEXT
|--------------------------------------------------------------------------
*/

function getTimeContext() {

    const now = new Date();

    return {
        hour: now.getHours(),
        minute: now.getMinutes(),
        second: now.getSeconds(),
        millisecond: now.getMilliseconds()
    };
}


/*
|--------------------------------------------------------------------------
| DYNAMIC MESSAGE
|--------------------------------------------------------------------------
*/

function updateDynamicWheelMessage() {

    const context = getTimeContext();

    if ($("roundNumber")) {
        $("roundNumber").textContent =
            `Round ${String(currentRound).padStart(2, "0")}`;
    }

    if ($("spinSubtitle")) {

        const messages = [
            "Your reward is selected dynamically for this round.",
            "Every result includes a reward.",
            "Your current round is ready.",
            "Spin when you are ready."
        ];

        const index =
            (context.minute + currentRound) %
            messages.length;

        $("spinSubtitle").textContent = messages[index];
    }
}


/*
|--------------------------------------------------------------------------
| DYNAMIC PRIZE SELECTION
|--------------------------------------------------------------------------
*/

function selectDynamicPrize() {

    const context = getTimeContext();

    const seed =
        (
            context.hour * 3600 +
            context.minute * 60 +
            context.second +
            currentRound * 17
        );

    const index =
        Math.abs(seed) % PRIZES.length;

    return {
        prize: PRIZES[index],
        index
    };
}


/*
|--------------------------------------------------------------------------
| SPIN
|--------------------------------------------------------------------------
*/

function spinWheel() {

    if (isSpinning) {
        return;
    }

    isSpinning = true;

    spinButton.disabled = true;

    const selected =
        selectDynamicPrize();

    currentPrize = selected.prize;
    currentPrizeIndex = selected.index;

    const segmentAngle =
        360 / PRIZES.length;

    const targetAngle =
        360 - (
            selected.index * segmentAngle +
            segmentAngle / 2
        );

    const extraRotations =
        5 + Math.floor(Math.random() * 3);

    const currentNormalized =
        ((currentRotation % 360) + 360) % 360;

    const requiredRotation =
        extraRotations * 360 +
        targetAngle -
        currentNormalized;

    const duration =
        4500 + Math.floor(Math.random() * 1800);

    currentRotation += requiredRotation;

    wheel.style.transition =
        `transform ${duration}ms cubic-bezier(0.12, 0.78, 0.18, 1)`;

    wheel.style.transform =
        `rotate(${currentRotation}deg)`;

    if (wheelLabels) {

        wheelLabels.style.transition =
            `transform ${duration}ms cubic-bezier(0.12, 0.78, 0.18, 1)`;

        wheelLabels.style.transform =
            `rotate(${currentRotation}deg)`;
    }

    setTimeout(() => {

        finishSpin();

    }, duration + 100);
}


/*
|--------------------------------------------------------------------------
| FINISH SPIN
|--------------------------------------------------------------------------
*/

function finishSpin() {

    isSpinning = false;

    currentRound++;

    spinButton.disabled = false;

    highlightWinningSegment();

    showResult();
}


/*
|--------------------------------------------------------------------------
| WINNING SEGMENT
|--------------------------------------------------------------------------
*/

function highlightWinningSegment() {

    if (!wheel) {
        return;
    }

    wheel.classList.remove("winner-pulse");

    void wheel.offsetWidth;

    wheel.classList.add("winner-pulse");
}


/*
|--------------------------------------------------------------------------
| RESULT
|--------------------------------------------------------------------------
*/

function showResult() {

    if (!currentPrize) {
        return;
    }

    const isCertificate =
        currentPrize.type === "certificate";

    if ($("resultBadge")) {
        $("resultBadge").textContent =
            isCertificate
                ? "Certificate Reward"
                : "Learning Reward";
    }

    if ($("resultKicker")) {
        $("resultKicker").textContent =
            isCertificate
                ? "CERTIFICATE REVEALED"
                : "REWARD REVEALED";
    }

    if ($("resultTitle")) {
        $("resultTitle").textContent =
            isCertificate
                ? "You Won"
                : "Reward Revealed";
    }

    if ($("resultDescription")) {
        $("resultDescription").textContent =
            currentPrize.description;
    }

    if ($("resultPrize")) {
        $("resultPrize").textContent =
            currentPrize.name;
    }

    if ($("resultPrizeSub")) {
        $("resultPrizeSub").textContent =
            currentPrize.program;
    }

    if ($("claimButton")) {

        if (isCertificate) {
            claimButton.textContent =
                "Claim Certificate";
            claimButton.style.display =
                "inline-flex";
        } else {
            claimButton.textContent =
                "Claim Reward";
            claimButton.style.display =
                "inline-flex";
        }
    }

    if ($("resultTip")) {

        $("resultTip").textContent =
            isCertificate
                ? "Complete your details to generate your certificate."
                : "You can claim this reward or try another round.";
    }

    createConfetti();

    showScreen(screens.result);
}


/*
|--------------------------------------------------------------------------
| CONFETTI
|--------------------------------------------------------------------------
*/

function createConfetti() {

    const container =
        $("confettiContainer");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    for (let i = 0; i < 32; i++) {

        const piece =
            document.createElement("span");

        piece.className = "confetti";

        piece.style.left =
            `${Math.random() * 100}%`;

        piece.style.top =
            `${Math.random() * 15}%`;

        piece.style.setProperty(
            "--x",
            `${(Math.random() - 0.5) * 300}px`
        );

        piece.style.animationDelay =
            `${Math.random() * 0.25}s`;

        container.appendChild(piece);
    }

    setTimeout(() => {

        container.innerHTML = "";

    }, 2200);
}


/*
|--------------------------------------------------------------------------
| CLAIM SCREEN
|--------------------------------------------------------------------------
*/

function openClaimScreen() {

    if (!currentPrize) {
        return;
    }

    if ($("claimPrizeName")) {
        $("claimPrizeName").textContent =
            currentPrize.name;
    }

    if ($("claimInstitute")) {
        $("claimInstitute").textContent =
            APP_CONFIG.issuerName;
    }

    showScreen(screens.claim);
}


/*
|--------------------------------------------------------------------------
| CLEAN TEXT
|--------------------------------------------------------------------------
*/

function clean(value) {

    return String(value || "")
        .trim()
        .replace(/\s+/g, " ");
}


/*
|--------------------------------------------------------------------------
| VALIDATION
|--------------------------------------------------------------------------
*/

function setFieldError(field, message) {

    if (!field) {
        return false;
    }

    const wrapper =
        field.closest(".field");

    if (!wrapper) {
        return false;
    }

    wrapper.classList.toggle(
        "invalid",
        Boolean(message)
    );

    const error =
        wrapper.querySelector(".error-message");

    if (error) {
        error.textContent =
            message || "";
    }

    return !message;
}


function validateField(field) {

    if (!field) {
        return false;
    }

    const value =
        clean(field.value);

    if (!value) {

        setFieldError(
            field,
            "This field is required."
        );

        return false;
    }


    if (field.id === "mobile") {

        const mobile =
            value.replace(/\D/g, "");

        if (mobile.length < 10) {

            setFieldError(
                field,
                "Enter a valid mobile number."
            );

            return false;
        }
    }


    if (field.id === "email") {

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(value)) {

            setFieldError(
                field,
                "Enter a valid email address."
            );

            return false;
        }
    }


    setFieldError(field, "");

    return true;
}


function validateClaimForm() {

    if (!claimForm) {
        return false;
    }

    const fields = [
        $("fullName"),
        $("fatherName"),
        $("mobile"),
        $("email"),
        $("graduation"),
        $("address")
    ];

    let valid = true;

    fields.forEach((field) => {

        if (!validateField(field)) {
            valid = false;
        }
    });

    return valid;
}


/*
|--------------------------------------------------------------------------
| CLAIM DATA
|--------------------------------------------------------------------------
*/

function collectClaimData() {

    return {
        fullName: clean($("fullName").value),
        fatherName: clean($("fatherName").value),
        mobile: clean($("mobile").value),
        email: clean($("email").value),
        graduation: clean($("graduation").value),
        address: clean($("address").value)
    };
}


/*
|--------------------------------------------------------------------------
| CERTIFICATE ID
|--------------------------------------------------------------------------
*/

function generateCertificateId() {

    const now =
        new Date();

    const datePart =
        [
            now.getFullYear(),
            String(now.getMonth() + 1).padStart(2, "0"),
            String(now.getDate()).padStart(2, "0")
        ].join("");

    const randomPart =
        Math.floor(
            100000 + Math.random() * 900000
        );

    return `${APP_CONFIG.certificatePrefix}-${datePart}-${randomPart}`;
}


/*
|--------------------------------------------------------------------------
| DATE
|--------------------------------------------------------------------------
*/

function getDateString() {

    return new Intl.DateTimeFormat(
        "en-IN",
        {
            day: "2-digit",
            month: "long",
            year: "numeric"
        }
    ).format(new Date());
}


/*
|--------------------------------------------------------------------------
| GENERATION
|--------------------------------------------------------------------------
*/

const generationSteps = [
    "Checking your reward details...",
    "Preparing certificate information...",
    "Creating your certificate record...",
    "Applying recipient information...",
    "Preparing the final certificate...",
    "Completing the final certificate rendering..."
];


function resetGenerationScreen() {

    if ($("generationBar")) {
        $("generationBar").style.width = "0%";
    }

    if ($("generationPercent")) {
        $("generationPercent").textContent = "0%";
    }

    if ($("generationMessage")) {
        $("generationMessage").textContent =
            generationSteps[0];
    }
}


function generateCertificate() {

    showScreen(screens.generation);

    resetGenerationScreen();

    const totalDuration = 4200;
    const startTime = performance.now();

    let finished = false;

    function update(now) {

        if (finished) {
            return;
        }

        const elapsed =
            Math.max(0, now - startTime);

        const rawProgress =
            Math.min(
                1,
                Math.max(
                    0,
                    elapsed / totalDuration
                )
            );

        const easedProgress =
            1 -
            Math.pow(
                1 - rawProgress,
                2.6
            );

        const percentage =
            Math.min(
                100,
                Math.max(
                    0,
                    Math.round(
                        easedProgress * 100
                    )
                )
            );

        const stepIndex =
            Math.min(
                generationSteps.length - 1,
                Math.floor(
                    (percentage / 100) *
                    generationSteps.length
                )
            );

        if ($("generationBar")) {
            $("generationBar").style.width =
                `${percentage}%`;
        }

        if ($("generationPercent")) {
            $("generationPercent").textContent =
                `${percentage}%`;
        }

        if ($("generationMessage")) {
            $("generationMessage").textContent =
                generationSteps[stepIndex];
        }

        if (rawProgress >= 1) {

            finished = true;

            if ($("generationBar")) {
                $("generationBar").style.width =
                    "100%";
            }

            if ($("generationPercent")) {
                $("generationPercent").textContent =
                    "100%";
            }

            if ($("generationMessage")) {
                $("generationMessage").textContent =
                    "Your certificate is ready to be revealed.";
            }

            setTimeout(() => {

                renderCertificate();

            }, 650);

            return;
        }

        requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}


/*
|--------------------------------------------------------------------------
| RENDER CERTIFICATE
|--------------------------------------------------------------------------
*/

function renderCertificate() {

    if (!userClaimData || !currentPrize) {
        return;
    }

    const certificateId =
        generateCertificateId();

    const certificateNumber =
        `${APP_CONFIG.certificatePrefix}-${Date.now()
            .toString()
            .slice(-8)}`;

    $("certificateInstitute").textContent =
        APP_CONFIG.issuerName;

    $("certificateStatus").textContent =
        currentPrize.type === "certificate"
            ? "PROFESSIONAL CERTIFICATE"
            : "PROFESSIONAL REWARD";

    $("certificateName").textContent =
        userClaimData.fullName;

    $("certificateTitle").textContent =
        currentPrize.name;

    $("certificateProgram").textContent =
        currentPrize.program;

    $("certificateFather").textContent =
        userClaimData.fatherName;

    $("certificateGraduation").textContent =
        userClaimData.graduation;

    $("certificateMobile").textContent =
        userClaimData.mobile;

    $("certificateEmail").textContent =
        userClaimData.email;

    $("certificateAddress").textContent =
        userClaimData.address;

    $("certificateDate").textContent =
        getDateString();

    $("certificateSignatory").textContent =
        APP_CONFIG.authorizedSignatory;

    $("certificateId").textContent =
        certificateId;

    $("certificateNumber").textContent =
        certificateNumber;

    $("certificateRecipient").textContent =
        userClaimData.fullName;

    showScreen(screens.certificate);
}


/*
|--------------------------------------------------------------------------
| FORM SUBMISSION
|--------------------------------------------------------------------------
*/

if (claimForm) {

    claimForm.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            if (!validateClaimForm()) {
                return;
            }

            userClaimData =
                collectClaimData();

            generateCertificate();
        }
    );
}


/*
|--------------------------------------------------------------------------
| LIVE VALIDATION
|--------------------------------------------------------------------------
*/

[
    "fullName",
    "fatherName",
    "mobile",
    "email",
    "graduation",
    "address"
].forEach((id) => {

    const field = $(id);

    if (!field) {
        return;
    }

    field.addEventListener(
        "blur",
        () => validateField(field)
    );
});


/*
|--------------------------------------------------------------------------
| BUTTON EVENTS
|--------------------------------------------------------------------------
*/

if (startButton) {

    startButton.addEventListener(
        "click",
        () => {

            currentRound = 1;

            updateDynamicWheelMessage();

            showScreen(screens.spinner);
        }
    );
}


if (spinButton) {

    spinButton.addEventListener(
        "click",
        spinWheel
    );
}


if (claimButton) {

    claimButton.addEventListener(
        "click",
        openClaimScreen
    );
}


if (spinAgainButton) {

    spinAgainButton.addEventListener(
        "click",
        () => {

            updateDynamicWheelMessage();

            showScreen(screens.spinner);
        }
    );
}


if (backToResultButton) {

    backToResultButton.addEventListener(
        "click",
        () => {

            showScreen(screens.result);
        }
    );
}


if (editCertificateButton) {

    editCertificateButton.addEventListener(
        "click",
        () => {

            showScreen(screens.claim);
        }
    );
}


if (printCertificateButton) {

    printCertificateButton.addEventListener(
        "click",
        () => {

            window.print();
        }
    );
}


/*
|--------------------------------------------------------------------------
| INITIALIZATION
|--------------------------------------------------------------------------
*/

initializeWheel();

updateDynamicWheelMessage();

rotateWelcomeMessage();

setInterval(
    rotateWelcomeMessage,
    4000
);
