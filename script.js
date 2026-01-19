/* --- 전역 변수 설정 --- */
let currentStep = 0; 
const totalSteps = 7; 

// 브릿지 메시지
const bridgeMessages = {
    1: { title: "탁월한 관찰력!", text: "게시물 하나에도 개인정보 6가지가 숨어있었어요.\n무심코 올리는 사진 한장 주의해야 해요!" },
    2: { title: "개인정보는 나를 알려주는 것", text: "이름, 얼굴, 폰 번호뿐만 아니라\n성별이나 학교처럼 조합되어 나를 알려주는 정보도 있습니다." },
    3: { title: "위험 감지 성공!", text: "일상 속의 위험한 상황들을 기억해주세요!\n이제 예방하는 습관을 알아볼까요?" },
    4: { title: "예방 습관 장착!", text: "7가지 습관을 모두 익히셨네요.\n이제 스마트폰을 안전하게 설정해봅시다." },
    5: { title: "보안 설정 완료!", text: "기능과 설명을 완벽하게 연결하셨습니다.\n마지막으로 실력을 점검해볼까요?" },
    6: { title: "모든 테스트 통과!", text: "훌륭합니다!\n이제 수료증을 받으러 가볼까요?" }
}; 


/* --- 기능 1: 브릿지 페이지 띄우기 (1.5초 전환) --- */
function showBridge(completedStep) {
    const currentEl = document.getElementById(`step${completedStep}`);
    
    // 1. 현재 단계 페이드 아웃
    if (currentEl) currentEl.classList.add('fade-out');

    // [변경] 2. 1.5초(1500ms) 대기 후 전환
    setTimeout(() => {
        if (currentEl) currentEl.classList.remove('active', 'fade-out');

        const msgData = bridgeMessages[completedStep] || { title: "미션 완료!", text: "다음 단계로 이동합니다." };
        document.getElementById('bridgeTitle').innerText = msgData.title;
        document.getElementById('bridgeText').innerText = msgData.text;

        const bridgeEl = document.getElementById('bridgeSection');
        bridgeEl.classList.add('active');
    }, 1500); // 1.5초 딜레이
}

/* --- 기능 2: 브릿지에서 '다음' 이동 (1.5초 전환) --- */
function proceedToNextStep() {
    const bridgeEl = document.getElementById('bridgeSection');

    // 1. 브릿지 페이드 아웃
    bridgeEl.classList.add('fade-out');

    // [변경] 2. 1.5초 대기 후 다음 단계
    setTimeout(() => {
        bridgeEl.classList.remove('active', 'fade-out');

        currentStep++;
        updateProgressBar();

        const nextStepEl = document.getElementById(`step${currentStep}`);
        
        if (nextStepEl) {
            nextStepEl.classList.add('active');
            
            // 단계별 초기화 로직 실행
            if (currentStep === 1) initStep1Game();
            if (currentStep === 4) initStep4Habits();
            if (currentStep === 5) initStep5Matching();
            if (currentStep === 6) initStep6Quiz();
        }
    }, 1500); // 1.5초 딜레이
}

/* --- 기능 3: 최초 시작 (1.5초 전환) --- */
function nextStep() {
    const currentEl = document.getElementById(`step${currentStep}`);
    
    // 1. 인트로 페이드 아웃
    if (currentEl) currentEl.classList.add('fade-out');

    // [변경] 2. 1.5초 대기 후 Step 1 시작
    setTimeout(() => {
        if (currentEl) currentEl.classList.remove('active', 'fade-out');
        
        currentStep++;
        updateProgressBar();
        
        const nextEl = document.getElementById(`step${currentStep}`);
        if(nextEl) {
            nextEl.classList.add('active');
            if (currentStep === 1) initStep1Game();
        }
    }, 1500); // 1.5초 딜레이
}

function updateProgressBar() {
    const progress = (currentStep / totalSteps) * 100;
    const bar = document.getElementById('progressBar');
    if(bar) bar.style.width = `${progress}%`;
}


/* --- STEP 1 로직 --- */
let foundItems = 0;
const totalItemsToFind = 6;
const foundTargets = new Set();
let isGameInitialized = false;

function initStep1Game() {
    if (isGameInitialized) return;
    isGameInitialized = true;

    const targets = document.querySelectorAll('.target-area');
    targets.forEach(target => {
        target.addEventListener('click', function() {
            const targetName = this.getAttribute('data-target');
            if (foundTargets.has(targetName)) return;

            const checkItem = document.getElementById(`check-${targetName}`);
            if (!checkItem) return; 

            this.classList.add('found');
            checkItem.classList.add('checked');
            
            foundTargets.add(targetName);
            foundItems++;
            
            const countSpan = document.getElementById('foundCount');
            if(countSpan) countSpan.innerText = foundItems;

            if (foundItems >= totalItemsToFind) {
                setTimeout(() => {
                    showBridge(1); 
                }, 500);
            }
        });
    });
}


/* --- STEP 2 로직 --- */
let foundWordsCount = 0;
const totalWordsToFind = 4;

function checkWord(btn, isCorrect) {
    if (isCorrect) {
        if (btn.classList.contains('correct-active')) return;

        btn.classList.add('correct-active');
        foundWordsCount++;

        if (foundWordsCount === totalWordsToFind) {
            setTimeout(() => {
                showBridge(2);
            }, 500);
        }
    } else {
        btn.classList.add('wrong-shrink');
        setTimeout(() => {
            alert("아니에요! 나를 구별하는 정보를 찾아요!");
            btn.classList.remove('wrong-shrink');
        }, 300);
    }
}


/* --- STEP 3 로직 (OX 퀴즈) --- */
const oxAnswers = { 1: 'X', 2: 'X', 3: 'X', 4: 'X', 5: 'O' };
const oxExplanations = {
    1: "계정 비밀번호는 누구에게도도 절대로 공유하면 안 돼요!",
    2: "출처 불분명 링크는 스미싱 위험이 큽니다.",
    3: "생성형 AI에 제공하는 데이터는 학습에 사용될 수 있어요!",
    4: "AI 학습 데이터로 남을 수 있으니 실명 입력 주의!",
    5: "개인정보가 담기지 않았는지 검토! 공개범위 설정도 필수"
};

let solvedQuizCount = 0;
const totalQuizCount = 5;

function checkOX(qNum, userChoice) {
    const parent = document.getElementById(`q${qNum}`);
    if (parent.getAttribute('data-solved') === 'true') return;

    const feedbackDiv = parent.querySelector('.quiz-feedback');
    const correctAns = oxAnswers[qNum];
    const isCorrect = (userChoice === correctAns);

    if (userChoice === 'O') parent.querySelector('.o-btn').classList.add('selected');
    else parent.querySelector('.x-btn').classList.add('selected');

    feedbackDiv.classList.remove('hidden');
    if (isCorrect) {
        feedbackDiv.innerHTML = `✅ 정답! ${oxExplanations[qNum]}`;
        feedbackDiv.className = 'quiz-feedback correct';
    } else {
        feedbackDiv.innerHTML = `❌ 땡! (위험해요) ${oxExplanations[qNum]}`;
        feedbackDiv.className = 'quiz-feedback wrong';
    }

    parent.setAttribute('data-solved', 'true');
    parent.querySelectorAll('button').forEach(b => b.classList.add('btn-disabled'));

    solvedQuizCount++;
    
    if (solvedQuizCount === totalQuizCount) {
        setTimeout(() => {
            showBridge(3);
        }, 1000);
    }
}

/* --- STEP 4: 예방 습관 (코드 정리 및 오류 수정) --- */
const habits = [
    { icon: "🔒", text: "1. 비밀번호는 어렵게 설정하고 정기적으로 교체하기" },
    { icon: "🚫", text: "2. SNS, 댓글 등에 개인정보 절대 공개하지 않기" },
    { icon: "✂️", text: "3. 택배 송장, 영수증 등 개인정보가 담긴 종이는 꼼꼼히 파기하기" },
    { icon: "🔓", text: "4. 자동 로그인 습관은 해제하고, PC방 등에서는 반드시 로그아웃하기" },
    { icon: "🎁", text: "5. 과도한 정보를 요구하는 이벤트나 설문조사 참여하지 않기" },
    { icon: "🤫", text: "6. 소중한 개인정보는 친구에게도 함부로 알려주지 않기" },
    { icon: "📩", text: "7. 출처를 모르는 메시지나 이메일 링크는 절대 열지 않기" }
];
let habitIndex = 0;
let isHabitProcessing = false;

function initStep4Habits() {
    habitIndex = 0;
    isHabitProcessing = false;
    
    // 화면 강제 초기화
    const container = document.getElementById('habitCardContainer');
    const summary = document.getElementById('habitSummary');
    
    container.classList.remove('hidden', 'fade-out');
    summary.classList.add('hidden', 'fade-out');
    
    renderHabitCard();
}

function renderHabitCard() {
    // DOM 요소 가져오기
    const container = document.getElementById('habitCardContainer');
    const summaryBox = document.getElementById('habitSummary');
    const grid = document.getElementById('habitGrid');

    // [상황 1] 모든 습관(7개)을 다 본 경우 -> 요약 화면 표시
    if (habitIndex >= habits.length) {
        
        // 1. 카드 컨테이너 숨기기 (겹침 방지)
        container.classList.add('hidden');
        container.style.display = 'none'; 
        
        // 2. 요약 화면 보여주기
        summaryBox.classList.remove('hidden');
        summaryBox.style.display = 'block';
        
        // 3. 요약 그리드 생성
        grid.innerHTML = "";
        habits.forEach((h, i) => {
            grid.innerHTML += `
                <div class="mini-habit-card">
                    <div style="font-size:1.5rem;">${h.icon}</div>
                    <div>수칙 ${i+1}</div>
                </div>`;
        });

        // 4. 2.5초 뒤 브릿지로 이동
        setTimeout(() => {
             showBridge(4);
        }, 4000);

    } 
    // [상황 2] 아직 볼 카드가 남은 경우 -> 카드 갱신
    else {
        // (혹시 모를) 요약 숨김 및 카드 표시 확실히 하기
        container.classList.remove('hidden');
        container.style.display = 'flex';
        summaryBox.classList.add('hidden');
        summaryBox.style.display = 'none';

        // 1. 현재 순서 데이터 가져오기
        const data = habits[habitIndex];
        
        // 2. 텍스트와 아이콘 변경
        document.getElementById('habitImg').innerText = data.icon;
        document.getElementById('habitText').innerText = data.text;
        
        // 3. 체크박스 초기화
        const checkbox = document.getElementById('habitCheckbox');
        checkbox.checked = false;
        
        // 4. 애니메이션 재실행 (Reflow 기법)
        const card = document.querySelector('.habit-card');
        card.style.animation = 'none';
        card.offsetHeight; // Reflow 발생
        card.style.animation = 'slideInRight 0.5s ease-out';
        
        // 5. 클릭 잠금 해제
        isHabitProcessing = false; 
    }
}

function checkHabit() {
    if (isHabitProcessing) return;
    isHabitProcessing = true;

    setTimeout(() => {
        habitIndex++;
        renderHabitCard();
    }, 400);
}


/* --- STEP 5: 안전 기능 설정 (매칭 게임) --- */
const matchData = [
    { id: 1, left: "2단계 인증", right: "추가 인증수단을 설정해 계정을 보호하기" },
    { id: 2, left: "저장할 데이터 관리", right: "어떤 데이터가 저장될지 직접 선택하기" },
    { id: 3, left: "데이터 자동 삭제", right: "데이터가 보관되는 기간 제한하기" },
    { id: 4, left: "게시물 공개 범위", right: "친구공개부터 전체공개까지 공유 범위 정하기" },
    { id: 5, left: "정보 검토 및 마스킹", right: "사진 속 내 개인정보 가리기" },
    { id: 6, left: "잠금 설정", right: "중요한 파일에는 비밀번호 걸기" }
];
let selectedLeft = null;
let selectedRight = null;
let matchedCount = 0;

function initStep5Matching() {
    const leftCol = document.getElementById('matchLeftCol');
    const rightCol = document.getElementById('matchRightCol');
    leftCol.innerHTML = "";
    rightCol.innerHTML = "";
    
    const shuffledRight = [...matchData].sort(() => Math.random() - 0.5);

    matchData.forEach(item => {
        const btn = document.createElement('div');
        btn.className = 'match-btn';
        btn.innerText = item.left;
        btn.dataset.id = item.id;
        btn.onclick = () => selectMatch(btn, 'left');
        leftCol.appendChild(btn);
    });

    shuffledRight.forEach(item => {
        const btn = document.createElement('div');
        btn.className = 'match-btn';
        btn.innerText = item.right;
        btn.dataset.id = item.id;
        btn.onclick = () => selectMatch(btn, 'right');
        rightCol.appendChild(btn);
    });
}

function selectMatch(btn, side) {
    if (btn.classList.contains('matched')) return;

    if (side === 'left') {
        if (selectedLeft) selectedLeft.classList.remove('selected');
        selectedLeft = btn;
    } else {
        if (selectedRight) selectedRight.classList.remove('selected');
        selectedRight = btn;
    }
    btn.classList.add('selected');

    if (selectedLeft && selectedRight) {
        checkMatch();
    }
}

function checkMatch() {
    const leftId = selectedLeft.dataset.id;
    const rightId = selectedRight.dataset.id;

    if (leftId === rightId) {
        selectedLeft.classList.add('matched');
        selectedRight.classList.add('matched');
        selectedLeft.classList.remove('selected');
        selectedRight.classList.remove('selected');
        selectedLeft = null;
        selectedRight = null;
        matchedCount++;

        if (matchedCount === matchData.length) {
            setTimeout(() => { showBridge(5); }, 1000);
        }
    } else {
        selectedLeft.classList.add('shake');
        selectedRight.classList.add('shake');
        setTimeout(() => {
            selectedLeft.classList.remove('shake', 'selected');
            selectedRight.classList.remove('shake', 'selected');
            selectedLeft = null;
            selectedRight = null;
        }, 400);
    }
}


/* --- STEP 6: 최종 퀴즈 (8문제) --- */
const finalQuizData = [
    { q: "다음 중 '개인정보'가 아닌 것은?", o: ["내 이름", "오늘 날씨", "휴대폰 번호"], a: 1 },
    { q: "친구에게 계정 비밀번호를 알려줘도 될까요?", o: ["절대 안 된다", "친하면 괜찮다", "급할 땐 된다"], a: 0 },
    { q: "출처가 불분명한 문자 링크를 받았다면?", o: ["눌러본다", "삭제하고 열지 않는다", "친구에게 보낸다"], a: 1 },
    { q: "공공장소 무료 와이파이 사용 시 주의점은?", o: ["맘껏 쓴다", "금융거래/로그인은 피한다", "비밀번호를 바꾼다"], a: 1 },
    { q: "SNS에 사진 올릴 때 안전한 행동은?", o: ["위치 태그 끄기", "교복 이름표 보이게 하기", "집 주소 적기"], a: 0 },
    { q: "내 정보를 지키기 위한 올바른 비밀번호는?", o: ["123456", "생년월일", "영어+숫자+특수문자 조합"], a: 2 },
    { q: "택배 상자를 버릴 때 올바른 행동은?", o: ["그냥 버린다", "송장을 떼서 찢어 버린다", "상자째로 준다"], a: 1 },
    { q: "2단계 인증이란 무엇인가요?", o: ["인증을 안 하는 것", "한 번만 로그인하는 것", "추가 인증으로 보안을 높이는 것"], a: 2 }
];
let currentQuizIdx = 0;

function initStep6Quiz() {
    currentQuizIdx = 0;
    renderFinalQuiz();
}

function renderFinalQuiz() {
    if (currentQuizIdx >= finalQuizData.length) {
        showBridge(6); 
        return;
    }

    const data = finalQuizData[currentQuizIdx];
    document.getElementById('finalQuizNum').innerText = currentQuizIdx + 1;
    document.getElementById('finalQuestionText').innerText = data.q;
    
    const optionsDiv = document.getElementById('finalOptions');
    optionsDiv.innerHTML = "";
    
    data.o.forEach((opt, idx) => {
        const btn = document.createElement('div');
        btn.className = 'option-btn';
        btn.innerText = opt;
        btn.onclick = () => checkFinalAnswer(idx, btn, data.a);
        optionsDiv.appendChild(btn);
    });
}

function checkFinalAnswer(selectedIndex, btn, correctIndex) {
    if (selectedIndex === correctIndex) {
        btn.classList.add('correct');
        btn.innerText += " (정답!)";
        
        const allBtns = document.querySelectorAll('.option-btn');
        allBtns.forEach(b => b.style.pointerEvents = 'none');

        setTimeout(() => {
            currentQuizIdx++;
            renderFinalQuiz();
        }, 1000);

    } else {
        btn.classList.add('shake');
        btn.classList.add('wrong');
        
        setTimeout(() => {
            btn.classList.remove('shake');
        }, 500);
    }
}
