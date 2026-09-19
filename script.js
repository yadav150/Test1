"use strict";


/* =========================================================
   APPLICATION CONFIGURATION
========================================================= */

const APP_CONFIG = {

    institutionName:
        "Your Organization Name",

    authorizedSignatory:
        "Authorized Signatory",

    defaultProgramSuffix:
        "Professional Certificate Program",

    demoMode:
        true

};


/* =========================================================
   PRIZES
========================================================= */

const PRIZES = [

    {
        title: "AI Assistant Web Developer",
        subtitle: "Professional Certificate",
        program: "AI Assisted Web Development Program",
        type: "certificate"
    },

    {
        title: "Web Developer",
        subtitle: "Professional Certificate",
        program: "Professional Web Development Program",
        type: "certificate"
    },

    {
        title: "Full Stack Web Developer",
        subtitle: "Professional Certificate",
        program: "Full Stack Web Development Program",
        type: "certificate"
    },

    {
        title: "Software Developer",
        subtitle: "Professional Certificate",
        program: "Software Development Program",
        type: "certificate"
    },

    {
        title: "Software Engineer",
        subtitle: "Professional Certificate",
        program: "Software Engineering Program",
        type: "certificate"
    },

    {
        title: "Data Analyst",
        subtitle: "Professional Certificate",
        program: "Data Analytics Program",
        type: "certificate"
    },

    {
        title: "Frontend Developer",
        subtitle: "Professional Certificate",
        program: "Frontend Development Program",
        type: "certificate"
    },

    {
        title: "Backend Developer",
        subtitle: "Professional Certificate",
        program: "Backend Development Program",
        type: "certificate"
    },

    {
        title: "Python Developer",
        subtitle: "Professional Certificate",
        program: "Python Development Program",
        type: "certificate"
    },

    {
        title: "AI Developer",
        subtitle: "Professional Certificate",
        program: "Artificial Intelligence Development Program",
        type: "certificate"
    },

    {
        title: "Data Science",
        subtitle: "Professional Certificate",
        program: "Data Science Program",
        type: "certificate"
    },

    {
        title: "Cybersecurity Professional",
        subtitle: "Professional Certificate",
        program: "Cybersecurity Program",
        type: "certificate"
    },

    {
        title: "Cloud Computing Professional",
        subtitle: "Professional Certificate",
        program: "Cloud Computing Program",
        type: "certificate"
    },

    {
        title: "DevOps Professional",
        subtitle: "Professional Certificate",
        program: "DevOps Engineering Program",
        type: "certificate"
    },

    {
        title: "JavaScript Developer",
        subtitle: "Professional Certificate",
        program: "JavaScript Development Program",
        type: "certificate"
    },

    {
        title: "Technical Software Professional",
        subtitle: "Professional Certificate",
        program: "Professional Software Skills Program",
        type: "certificate"
    },

    {
        title: "Coding Learning Reward",
        subtitle: "Achievement Reward",
        program: "",
        type: "reward"
    },

    {
        title: "Developer Practice Reward",
        subtitle: "Achievement Reward",
        program: "",
        type: "reward"
    },

    {
        title: "Technology Explorer Reward",
        subtitle: "Achievement Reward",
        program: "",
        type: "reward"
    },

    {
        title: "Next Challenge Reward",
        subtitle: "Achievement Reward",
        program: "",
        type: "reward"
    }

];


/* =========================================================
   SCREEN REFERENCES
========================================================= */

const screens = {

    welcome:
        document.getElementById("welcomeScreen"),

    spinner:
        document.getElementById("spinnerScreen"),

    result:
        document.getElementById("resultScreen"),

    claim:
        document.getElementById("claimScreen"),

    generation:
        document.getElementById("generationScreen"),

    certificate:
        document.getElementById("certificateScreen")

};


const wheel =
    document.getElementById("wheel");

const wheelArea =
    document.querySelector(".wheel-area");

const wheelLabels =
    document.getElementById("wheelLabels");

const spinButton =
    document.getElementById("spinButton");

const roundNumber =
    document.getElementById("roundNumber");

const spinMessageTitle =
    document.getElementById("spinMessageTitle");

const spinMessage =
    document.getElementById("spinMessage");


let currentRotation = 0;

let currentPrize = null;

let currentPrizeIndex = null;

let currentRound = 1;

let isSpinning = false;

let latestClaimData = null;


/* =========================================================
   SCREEN SWITCH
========================================================= */

function showScreen(screenName) {

    Object
        .values(screens)
        .forEach(
            function (screen) {

                screen.classList.remove("active");

            }
        );


    const target =
        screens[screenName];


    if (!target) {
        return;
    }


    target.classList.add("active");


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


/* =========================================================
   WELCOME MESSAGE
========================================================= */

const welcomeMessages = [

    "Your next achievement could be one spin away.",

    "Every round brings a different possibility.",

    "Stay curious. The wheel is ready.",

    "One decision. One spin. One reward.",

    "Your professional reward is waiting to be revealed."

];


let welcomeMessageIndex = 0;


setInterval(
    function () {

        welcomeMessageIndex =
            (
                welcomeMessageIndex + 1
            ) %
            welcomeMessages.length;


        const element =
            document.getElementById(
                "welcomeEncouragement"
            );


        if (element) {

            element.textContent =
                welcomeMessages[
                    welcomeMessageIndex
                ];

        }

    },
    3800
);


/* =========================================================
   INITIALIZE WHEEL
========================================================= */

function initializeWheel() {

    const count =
        PRIZES.length;

    const step =
        360 / count;


    wheelLabels.innerHTML = "";


    PRIZES.forEach(
        function (prize, index) {

            const label =
                document.createElement("div");


            label.className =
                "wheel-label";


            const centerAngle =
                index * step +
                step / 2;


            label.style.setProperty(
                "--angle",
                `${centerAngle}deg`
            );


            label.textContent =
                prize.title;


            label.dataset.index =
                index;


            wheelLabels.appendChild(
                label
            );

        }
    );


    roundNumber.textContent =
        String(currentRound)
            .padStart(2, "0");


    updateDynamicWheelMessage();

}


/* =========================================================
   TIME CONTEXT
========================================================= */

function getTimeContext() {

    const now =
        new Date();


    const hour =
        now.getHours();

    const minute =
        now.getMinutes();

    const second =
        now.getSeconds();


    let periodMessage;


    if (hour < 12) {

        periodMessage =
            "A fresh round is ready to begin your day.";

    }
    else if (hour < 17) {

        periodMessage =
            "Your afternoon reward round is ready.";

    }
    else {

        periodMessage =
            "Your evening reward round is ready.";

    }


    return {
        hour,
        minute,
        second,
        periodMessage
    };

}


/* =========================================================
   DYNAMIC SPIN MESSAGE
========================================================= */

function updateDynamicWheelMessage() {

    const context =
        getTimeContext();


    const subtitle =
        document.getElementById(
            "spinSubtitle"
        );


    if (subtitle) {

        subtitle.textContent =
            context.periodMessage;

    }


    const messages = [

        {
            title:
                "Ready when you are",

            text:
                "One smooth spin will reveal your reward."
        },

        {
            title:
                "Watch the final stop",

            text:
                "The wheel will slow down before revealing the selected reward."
        },

        {
            title:
                "Stay with the moment",

            text:
                "The final position is selected by the application logic."
        },

        {
            title:
                "Something is waiting",

            text:
                "Your reward will be revealed after the wheel completes its motion."
        }

    ];


    const index =
        (
            context.minute +
            currentRound
        ) %
        messages.length;


    spinMessageTitle.textContent =
        messages[index].title;


    spinMessage.textContent =
        messages[index].text;

}


/* =========================================================
   RANDOM INTEGER
========================================================= */

function randomInteger(max) {

    if (
        !Number.isFinite(max) ||
        max <= 0
    ) {

        return 0;

    }


    if (
        window.crypto &&
        typeof window.crypto.getRandomValues ===
        "function"
    ) {

        const array =
            new Uint32Array(1);


        window.crypto.getRandomValues(
            array
        );


        return array[0] % max;

    }


    return Math.floor(
        Math.random() * max
    );

}


/* =========================================================
   SELECT PRIZE
========================================================= */

function selectDynamicPrize() {

    const context =
        getTimeContext();


    const timeSeed =
        (
            context.hour * 60 +
            context.minute +
            context.second +
            currentRound * 17
        );


    let index =
        (
            timeSeed +
            randomInteger(
                PRIZES.length
            )
        ) %
        PRIZES.length;


    if (
        index >= 16 &&
        randomInteger(100) < 45
    ) {

        index =
            randomInteger(16);

    }


    return {

        index,

        prize:
            PRIZES[index]

    };

}


/* =========================================================
   SPIN WHEEL
========================================================= */

function spinWheel() {

    if (isSpinning) {
        return;
    }


    isSpinning =
        true;


    spinButton.disabled =
        true;


    wheelArea.classList.add(
        "spinning"
    );


    spinMessageTitle.textContent =
        "The wheel is moving";


    spinMessage.textContent =
        "Hold on while the reward wheel finds its final position.";


    const selection =
        selectDynamicPrize();


    currentPrizeIndex =
        selection.index;


    currentPrize =
        selection.prize;


    const count =
        PRIZES.length;


    const step =
        360 / count;


    const targetCenter =
        currentPrizeIndex *
        step +
        step / 2;


    const extraTurns =
        7 +
        randomInteger(3);


    const currentNormalized =
        (
            currentRotation %
            360 +
            360
        ) %
        360;


    let targetDelta =
        (
            360 -
            targetCenter -
            currentNormalized
        ) %
        360;


    if (
        targetDelta < 0
    ) {

        targetDelta += 360;

    }


    currentRotation =
        currentRotation +
        extraTurns * 360 +
        targetDelta;


    const duration =
        6200 +
        randomInteger(1800);


    wheel.style.transition =
        `transform ${duration}ms cubic-bezier(.12,.74,.18,1)`;


    requestAnimationFrame(
        function () {

            wheel.style.transform =
                `rotate(${currentRotation}deg)`;

        }
    );


    setTimeout(
        function () {

            finishSpin();

        },
        duration + 150
    );

}


/* =========================================================
   FINISH SPIN
========================================================= */

function finishSpin() {

    isSpinning =
        false;


    spinButton.disabled =
        false;


    wheelArea.classList.remove(
        "spinning"
    );


    highlightWinningSegment();


    currentRound += 1;


    roundNumber.textContent =
        String(currentRound)
            .padStart(2, "0");


    spinMessageTitle.textContent =
        "Reward found";


    spinMessage.textContent =
        "Your reward has been revealed.";


    setTimeout(
        function () {

            showResult();

        },
        600
    );

}


/* =========================================================
   WINNING SEGMENT
========================================================= */

function highlightWinningSegment() {

    document
        .querySelectorAll(".wheel-label")
        .forEach(
            function (label) {

                label.classList.remove(
                    "active"
                );

            }
        );


    const target =
        document.querySelector(
            `.wheel-label[data-index="${currentPrizeIndex}"]`
        );


    if (target) {

        target.classList.add(
            "active"
        );

    }

}


/* =========================================================
   RESULT SCREEN
========================================================= */

function showResult() {

    if (!currentPrize) {
        return;
    }


    const isCertificate =
        currentPrize.type ===
        "certificate";


    const resultBadge =
        document.getElementById(
            "resultBadge"
        );

    const resultIcon =
        document.getElementById(
            "resultIcon"
        );

    const resultKicker =
        document.getElementById(
            "resultKicker"
        );

    const resultTitle =
        document.getElementById(
            "resultTitle"
        );

    const resultDescription =
        document.getElementById(
            "resultDescription"
        );

    const resultPrize =
        document.getElementById(
            "resultPrize"
        );

    const resultPrizeSub =
        document.getElementById(
            "resultPrizeSub"
        );

    const claimButton =
        document.getElementById(
            "claimButton"
        );

    const resultTip =
        document.getElementById(
            "resultTip"
        );


    if (isCertificate) {

        resultBadge.textContent =
            "CONGRATULATIONS";

        resultIcon.textContent =
            "C";

        resultKicker.textContent =
            "CERTIFICATE REWARD";

        resultTitle.textContent =
            "You won a professional certificate";

        resultDescription.textContent =
            "Your selected certificate reward is ready to claim.";

        claimButton.textContent =
            "Claim Certificate";

        resultTip.textContent =
            "Enter your details carefully. They will be used in the personalized certificate.";


        createConfetti();

    }
    else {

        resultBadge.textContent =
            "REWARD REVEALED";

        resultIcon.textContent =
            "R";

        resultKicker.textContent =
            "ACHIEVEMENT REWARD";

        resultTitle.textContent =
            "You received a reward";

        resultDescription.textContent =
            "This round brought you a recognition reward.";

        claimButton.textContent =
            "Claim Reward";

        resultTip.textContent =
            "You can continue exploring the experience with another round.";

    }


    resultPrize.textContent =
        currentPrize.title;


    resultPrizeSub.textContent =
        currentPrize.subtitle;


    showScreen("result");

}


/* =========================================================
   CONFETTI
========================================================= */

function createConfetti() {

    const container =
        document.getElementById(
            "confettiContainer"
        );


    container.innerHTML =
        "";


    const colors = [

        "#17324B",
        "#2866B7",
        "#B9974B",
        "#D9BF7A",
        "#477A5A",
        "#FFFFFF"

    ];


    for (
        let i = 0;
        i < 95;
        i++
    ) {

        const piece =
            document.createElement(
                "div"
            );


        piece.className =
            "confetti";


        const x =
            Math.random() * 100 -
            50;


        const duration =
            1.7 +
            Math.random() * 2.2;


        piece.style.left =
            `${Math.random() * 100}%`;


        piece.style.setProperty(
            "--x",
            `${x}vw`
        );


        piece.style.setProperty(
            "--duration",
            `${duration}s`
        );


        piece.style.setProperty(
            "--rotation",
            `${360 + Math.random() * 720}deg`
        );


        piece.style.background =
            colors[
                Math.floor(
                    Math.random() *
                    colors.length
                )
            ];


        piece.style.animationDelay =
            `${Math.random() * .25}s`;


        container.appendChild(
            piece
        );

    }


    setTimeout(
        function () {

            container.innerHTML =
                "";

        },
        4500
    );

}


/* =========================================================
   CLAIM SCREEN
========================================================= */

function openClaimScreen() {

    if (!currentPrize) {
        return;
    }


    document.getElementById(
        "claimPrizeName"
    ).textContent =
        currentPrize.title;


    document.getElementById(
        "claimInstitute"
    ).textContent =
        APP_CONFIG.institutionName;


    showScreen("claim");

}


/* =========================================================
   CLEAN VALUE
========================================================= */

function clean(value) {

    return String(
        value || ""
    )
        .replace(
            /\s+/g,
            " "
        )
        .trim();

}


/* =========================================================
   VALIDATE FIELD
========================================================= */

function validateField(element) {

    if (!element) {
        return false;
    }


    const field =
        element.closest(
            ".field"
        );


    const value =
        clean(
            element.value
        );


    let valid =
        value.length > 0;


    if (
        element.id ===
        "email"
    ) {

        valid =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                .test(value);

    }


    if (
        element.id ===
        "mobile"
    ) {

        valid =
            /^[0-9+\-\s()]{8,20}$/
                .test(value);

    }


    if (field) {

        field.classList.toggle(
            "invalid",
            !valid
        );

    }


    return valid;

}


/* =========================================================
   VALIDATE FORM
========================================================= */

function validateClaimForm() {

    const requiredFields =
        document.querySelectorAll(
            "#claimForm input[required]"
        );


    let valid =
        true;


    requiredFields.forEach(
        function (field) {

            if (
                !validateField(
                    field
                )
            ) {

                valid =
                    false;

            }

        }
    );


    return valid;

}


/* =========================================================
   COLLECT FORM DATA
========================================================= */

function collectClaimData() {

    return {

        name:
            clean(
                document.getElementById(
                    "fullName"
                ).value
            ),

        fatherName:
            clean(
                document.getElementById(
                    "fatherName"
                ).value
            ),

        mobile:
            clean(
                document.getElementById(
                    "mobile"
                ).value
            ),

        email:
            clean(
                document.getElementById(
                    "email"
                ).value
            ),

        graduation:
            clean(
                document.getElementById(
                    "graduation"
                ).value
            ),

        address:
            clean(
                document.getElementById(
                    "address"
                ).value
            )

    };

}


/* =========================================================
   CERTIFICATE ID
========================================================= */

function generateCertificateId() {

    const year =
        new Date()
            .getFullYear();


    const timestamp =
        Date.now()
            .toString()
            .slice(-8);


    const random =
        String(
            randomInteger(1000)
        )
            .padStart(
                3,
                "0"
            );


    return (
        `CERT-${year}-${timestamp}-${random}`
    );

}


/* =========================================================
   DATE
========================================================= */

function getDateString() {

    return new Date()
        .toLocaleDateString(
            "en-GB",
            {
                day:
                    "2-digit",

                month:
                    "long",

                year:
                    "numeric"
            }
        );

}


/* =========================================================
   GENERATION STEPS
========================================================= */

const generationSteps = [

    {
        message:
            "Checking your submitted details...",

        encouragement:
            "A careful submission creates a cleaner final document."
    },

    {
        message:
            "Preparing your personalized certificate...",

        encouragement:
            "Your selected achievement is being matched to the certificate layout."
    },

    {
        message:
            "Assigning your certificate identification...",

        encouragement:
            "Your certificate record is taking shape."
    },

    {
        message:
            "Applying the selected professional design...",

        encouragement:
            "The details are being arranged for a polished presentation."
    },

    {
        message:
            "Finalizing the certificate presentation...",

        encouragement:
            "Almost there. Your personalized result is nearly ready."
    },

    {
        message:
            "Completing the final certificate rendering...",

        encouragement:
            "Your certificate is ready to be revealed."
    }

];


/* =========================================================
   FIXED CERTIFICATE GENERATION
========================================================= */

function generateCertificate() {

    latestClaimData =
        collectClaimData();


    showScreen(
        "generation"
    );


    const progressBar =
        document.getElementById(
            "generationBar"
        );

    const progressNumber =
        document.getElementById(
            "generationPercent"
        );

    const generationMessage =
        document.getElementById(
            "generationMessage"
        );

    const generationEncouragement =
        document.getElementById(
            "generationEncouragement"
        );


    /*
        Reset everything before starting.
    */

    progressBar.style.width =
        "0%";

    progressNumber.textContent =
        "0";

    generationMessage.textContent =
        generationSteps[0].message;

    generationEncouragement.textContent =
        generationSteps[0].encouragement;


    /*
        IMPORTANT:
        Do not calculate a percentage from an invalid
        step index. Progress is calculated directly from
        elapsed time and always remains a valid number.
    */

    const totalDuration =
        5200 +
        randomInteger(1200);


    const startTime =
        performance.now();


    let lastStep =
        -1;


    function updateGeneration(
        currentTime
    ) {

        const elapsed =
            currentTime -
            startTime;


        const rawProgress =
            Math.min(
                1,
                Math.max(
                    0,
                    elapsed /
                    totalDuration
                )
            );


        /*
            Guaranteed finite number.
        */

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
                        easedProgress *
                        100
                    )
                )
            );


        progressBar.style.width =
            `${percentage}%`;


        progressNumber.textContent =
            String(percentage);


        /*
            Calculate the step safely.
        */

        const stepSize =
            100 /
            generationSteps.length;


        let stepIndex =
            Math.floor(
                percentage /
                stepSize
            );


        /*
            At 100%, use the final step.
        */

        if (
            percentage >= 100
        ) {

            stepIndex =
                generationSteps.length - 1;

        }


        stepIndex =
            Math.max(
                0,
                Math.min(
                    generationSteps.length - 1,
                    stepIndex
                )
            );


        if (
            stepIndex !==
            lastStep
        ) {

            lastStep =
                stepIndex;


            generationMessage.textContent =
                generationSteps[
                    stepIndex
                ].message;


            generationEncouragement.textContent =
                generationSteps[
                    stepIndex
                ].encouragement;

        }


        /*
            Never use NaN as a completion check.
        */

        if (
            rawProgress >= 1
        ) {

            progressBar.style.width =
                "100%";

            progressNumber.textContent =
                "100";


            generationMessage.textContent =
                "Certificate generation complete.";

            generationEncouragement.textContent =
                "Your personalized certificate is ready.";


            setTimeout(
                function () {

                    renderCertificate();

                },
                650
            );


            return;

        }


        requestAnimationFrame(
            updateGeneration
        );

    }


    requestAnimationFrame(
        updateGeneration
    );

}


/* =========================================================
   RENDER CERTIFICATE
========================================================= */

function renderCertificate() {

    if (
        !latestClaimData ||
        !currentPrize
    ) {

        return;

    }


    const data =
        latestClaimData;


    const certificateId =
        generateCertificateId();


    const date =
        getDateString();


    document.getElementById(
        "certificateInstitute"
    ).textContent =
        APP_CONFIG.institutionName;


    document.getElementById(
        "certificateStatus"
    ).textContent =
        "Certificate of Achievement";


    document.getElementById(
        "certificateTitle"
    ).textContent =
        currentPrize.title;


    document.getElementById(
        "certificateName"
    ).textContent =
        data.name;


    document.getElementById(
        "certificateProgram"
    ).textContent =
        currentPrize.program ||
        APP_CONFIG.defaultProgramSuffix;


    document.getElementById(
        "certificateFather"
    ).textContent =
        data.fatherName;


    document.getElementById(
        "certificateGraduation"
    ).textContent =
        data.graduation;


    document.getElementById(
        "certificateMobile"
    ).textContent =
        data.mobile;


    document.getElementById(
        "certificateEmail"
    ).textContent =
        data.email;


    document.getElementById(
        "certificateAddress"
    ).textContent =
        data.address;


    document.getElementById(
        "certificateDate"
    ).textContent =
        date;


    document.getElementById(
        "certificateSignatory"
    ).textContent =
        APP_CONFIG.authorizedSignatory;


    document.getElementById(
        "certificateId"
    ).textContent =
        certificateId;


    document.getElementById(
        "certificateNumber"
    ).textContent =
        certificateId;


    document.getElementById(
        "certificateRecipient"
    ).textContent =
        data.name;


    /*
        Re-enable submit button for future edits.
    */

    document.getElementById(
        "submitClaimButton"
    ).disabled =
        false;


    showScreen(
        "certificate"
    );

}


/* =========================================================
   RESET GENERATION
========================================================= */

function resetGenerationScreen() {

    document.getElementById(
        "generationBar"
    ).style.width =
        "0%";


    document.getElementById(
        "generationPercent"
    ).textContent =
        "0";


    document.getElementById(
        "generationMessage"
    ).textContent =
        generationSteps[0].message;


    document.getElementById(
        "generationEncouragement"
    ).textContent =
        generationSteps[0].encouragement;

}


/* =========================================================
   START BUTTON
========================================================= */

document.getElementById(
    "startButton"
)
.addEventListener(
    "click",
    function () {

        showScreen(
            "spinner"
        );

    }
);


/* =========================================================
   SPIN BUTTON
========================================================= */

spinButton.addEventListener(
    "click",
    function () {

        spinWheel();

    }
);


/* =========================================================
   CLAIM BUTTON
========================================================= */

document.getElementById(
    "claimButton"
)
.addEventListener(
    "click",
    function () {

        if (
            currentPrize &&
            currentPrize.type ===
            "certificate"
        ) {

            openClaimScreen();

            return;

        }


        showScreen(
            "spinner"
        );

    }
);


/* =========================================================
   SPIN AGAIN
========================================================= */

document.getElementById(
    "spinAgainButton"
)
.addEventListener(
    "click",
    function () {

        updateDynamicWheelMessage();

        showScreen(
            "spinner"
        );

    }
);


/* =========================================================
   BACK TO RESULT
========================================================= */

document.getElementById(
    "backToResultButton"
)
.addEventListener(
    "click",
    function () {

        showScreen(
            "result"
        );

    }
);


/* =========================================================
   INPUT VALIDATION
========================================================= */

document
    .querySelectorAll(
        "#claimForm input"
    )
    .forEach(
        function (input) {

            input.addEventListener(
                "blur",
                function () {

                    validateField(
                        this
                    );

                }
            );


            input.addEventListener(
                "input",
                function () {

                    if (
                        this.value.trim()
                    ) {

                        validateField(
                            this
                        );

                    }

                }
            );

        }
    );


/* =========================================================
   CLAIM FORM
========================================================= */

document.getElementById(
    "claimForm"
)
.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        if (
            !validateClaimForm()
        ) {

            const firstInvalid =
                document.querySelector(
                    "#claimForm .invalid input"
                );


            if (firstInvalid) {

                firstInvalid.focus();

            }


            return;

        }


        const submitButton =
            document.getElementById(
                "submitClaimButton"
            );


        submitButton.disabled =
            true;


        resetGenerationScreen();


        generateCertificate();

    }
);


/* =========================================================
   EDIT CERTIFICATE
========================================================= */

document.getElementById(
    "editCertificateButton"
)
.addEventListener(
    "click",
    function () {

        showScreen(
            "claim"
        );

    }
);


/* =========================================================
   PRINT
========================================================= */

document.getElementById(
    "printCertificateButton"
)
.addEventListener(
    "click",
    function () {

        window.print();

    }
);


/* =========================================================
   INITIALIZE
========================================================= */

initializeWheel();

updateDynamicWheelMessage();
