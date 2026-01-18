/* --- 전역 변수 설정 --- */
let currentStep = 0; 
const totalSteps = 7; // [변경] 전체 단계 7로 수정 (엔딩 포함)

// [변경] 브릿지 메시지 추가
const bridgeMessages = {
    1: { title: "탁월한 관찰력!", text: "게시물 하나에도 개인정보 6가지가 숨어있었어요.\n무심코 올리는 사진 한장 주의해야 해요!" },
    2: { title: "개인정보는 나를 알려주는 것", text: "이름, 얼굴, 폰 번호뿐만 아니라\n성별이나 학교처럼 조합되어 나를 알려주는 정보도 있습니다." },
    3: { title: "위험 감지 성공!", text: "일상 속의 위험한 상황들을 기억해주세요!\n이제 예방하는 습관을 알아볼까요?" },
    4: { title: "예방 습관 장착!", text: "7가지 습관을 모두 익히셨네요.\n이제 스마트폰을 안전하게 설정해봅시다." },
    5: { title: "보안 설정 완료!", text: "기능과 설명을 완벽하게 연결하셨습니다.\n마지막으로 실력을 점검해볼까요?" },
    6: { title: "모든 테스트 통과!", text: "훌륭합니다!\n이제 수료증을 받으러 가볼까요?" }
}; 


/* --- 기능 1: 브릿지 페이지 띄우기 (Alert 대신 사용) --- */
function showBridge(completedStep) {
    // 1. 현재 단계(게임 화면) 숨기기
    const currentEl = document.getElementById(`step${completedStep}`);
    if (currentEl) currentEl.classList.remove('active');

    // 2. 메시지 세팅
    const msgData = bridgeMessages[completedStep] || { title: "미션 완료!", text: "다음 단계로 이동합니다." };
    document.getElementById('bridgeTitle').innerText = msgData.title;
    document.getElementById('bridgeText').innerText = msgData.text;

    // 3. 브릿지 섹션 보여주기
    const bridgeEl = document.getElementById('bridgeSection');
    bridgeEl.classList.add('active');
}

/* --- 기능 2: 브릿지에서 '다음' 버튼 누르면 실제 이동 --- */
function proceedToNextStep() {
    // 1. 브릿지 숨기기
    document.getElementById('bridgeSection').classList.remove('active');

    // 2. 다음 단계 번호 증가
    currentStep++;
    updateProgressBar();

    // 3. 다음 단계 화면 보여주기
    const nextStepEl = document.getElementById(`step${currentStep}`);
    
    if (nextStepEl) {
        // 다음 단계(Step 7 포함)가 있으면 보여줌
        nextStepEl.classList.add('active');
        
        // 단계별 초기화 로직 실행
        if (currentStep === 1) initStep1Game();
        if (currentStep === 4) initStep4Habits();
        if (currentStep === 5) initStep5Matching();
        if (currentStep === 6) initStep6Quiz();
        // Step 7(엔딩)은 별도 초기화 로직 없음 (CSS 애니메이션 자동 실행)
        
    } else {
        // Step 7 이후(Step 8 등)로 넘어가려 할 때의 안전장치
        console.log("모든 단계가 끝났습니다."); 
        // 혹은 아무것도 하지 않음
    }
}

/* --- 기능 3: 최초 시작 (인트로 -> 1단계) --- */
function nextStep() {
    // 인트로(Step 0)에서 넘어갈 때만 사용하거나, 
    // 브릿지가 필요 없는 강제 이동 시 사용
    document.getElementById(`step${currentStep}`).classList.remove('active');
    currentStep++;
    updateProgressBar();
    
    const nextEl = document.getElementById(`step${currentStep}`);
    if(nextEl) {
        nextEl.classList.add('active');
        if (currentStep === 1) initStep1Game();
    }
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

            // [변경점] 6개 다 찾으면 -> showBridge(1) 호출
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
const totalWordsToFind = 4; // 내 이름, 폰 번호, 얼굴 사진, 성별

function checkWord(btn, isCorrect) {
    if (isCorrect) {
        if (btn.classList.contains('correct-active')) return;

        btn.classList.add('correct-active');
        foundWordsCount++;

        // [변경점] 4개 다 찾으면 -> showBridge(2) 호출
        if (foundWordsCount === totalWordsToFind) {
            setTimeout(() => {
                showBridge(2);
            }, 500);
        }
    } else {
        btn.classList.add('wrong-shrink');
        setTimeout(() => {
            alert("아니에요! 나를 구별하는 정보를 찾아요!"); // 오답은 간단한 경고
            btn.classList.remove('wrong-shrink');
        }, 300);
    }
}


/* --- STEP 3 로직 (OX 퀴즈) --- */
const oxAnswers = { 1: 'X', 2: 'X', 3: 'X', 4: 'X', 5: 'O' };
const oxExplanations = {
    1: "계정 비밀번호는 절대로 공유하면 안 돼요!",
    2: "출처 불분명 링크는 스미싱 위험이 큽니다.",
    3: "공공 와이파이는 해킹 위험이 있어 중요 정보 입력 금지!",
    4: "AI 학습 데이터로 남을 수 있으니 실명 입력 주의!",
    5: "위치 태그 끄기는 훌륭한 보안 습관입니다."
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
    
    // [변경점] 5문제 다 풀면 -> showBridge(3) 호출
    if (solvedQuizCount === totalQuizCount) {
        setTimeout(() => {
            showBridge(3);
        }, 1000); // 해설 읽을 시간 1초 부여
    }
}

/* --- STEP 4: 예방 습관 (시퀀스 카드) --- */
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

function initStep4Habits() {
    habitIndex = 0;
    renderHabitCard();
}

function renderHabitCard() {
    // 7개 다 보면 요약 화면으로
    if (habitIndex >= habits.length) {
        document.getElementById('habitCardContainer').classList.add('hidden');
        const summaryBox = document.getElementById('habitSummary');
        summaryBox.classList.remove('hidden');
        
        // 요약 그리드 생성
        const grid = document.getElementById('habitGrid');
        grid.innerHTML = "";
        habits.forEach((h, i) => {
            grid.innerHTML += `
                <div class="mini-habit-card">
                    <div style="font-size:1.5rem;">${h.icon}</div>
                    <div>수칙 ${i+1}</div>
                </div>`;
        });

        // 2초 뒤 브릿지로 이동
        setTimeout(() => { showBridge(4); }, 2500);
        return;
    }

    // 현재 카드 내용 표시
    const data = habits[habitIndex];
    document.getElementById('habitImg').innerText = data.icon;
    document.getElementById('habitText').innerText = data.text;
    document.getElementById('habitCheckbox').checked = false; // 체크 초기화
    
    // 애니메이션 리셋 (재생되도록)
    const card = document.querySelector('.habit-card');
    card.style.animation = 'none';
    card.offsetHeight; /* trigger reflow */
    card.style.animation = 'slideInRight 0.5s ease-out';
}

function checkHabit() {
    // 체크박스 클릭 시
    habitIndex++;
    // 약간의 딜레이 후 다음 카드로
    setTimeout(() => {
        renderHabitCard();
    }, 400);
}


/* --- STEP 5: 안전 기능 설정 (매칭 게임) --- */
const matchData = [
    { id: 1, left: "2단계 인증", right: "추가 인증수단을 설정해 계정을 보호하기" },
    { id: 2, left: "저장할 데이터 관리", right: "어떤 데이터가 저장될지 직접 선택하기" },
    { id: 3, left: "데이터 자동 삭제", right: "데이터가 보관되는 기간 제한하기" },
    { id: 4, left: "게시물 공개 대상", right: "친구부터 전체까지 공유 범위 정하기" },
    { id: 5, left: "정보 검토 및 마스킹", right: "사진 속 내 개인정보 가리기" },
    { id: 6, left: "잠금 설정", right: "개인정보 파일에 비밀번호 걸기" }
];
let selectedLeft = null;
let selectedRight = null;
let matchedCount = 0;

function initStep5Matching() {
    const leftCol = document.getElementById('matchLeftCol');
    const rightCol = document.getElementById('matchRightCol');
    leftCol.innerHTML = "";
    rightCol.innerHTML = "";
    
    // 왼쪽: 순서대로, 오른쪽: 랜덤 섞기
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

    // 선택 처리
    if (side === 'left') {
        if (selectedLeft) selectedLeft.classList.remove('selected');
        selectedLeft = btn;
    } else {
        if (selectedRight) selectedRight.classList.remove('selected');
        selectedRight = btn;
    }
    btn.classList.add('selected');

    // 둘 다 선택되었으면 정답 확인
    if (selectedLeft && selectedRight) {
        checkMatch();
    }
}

function checkMatch() {
    const leftId = selectedLeft.dataset.id;
    const rightId = selectedRight.dataset.id;

    if (leftId === rightId) {
        // 정답!
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
        // 오답!
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
let quizScore = 0;

function initStep6Quiz() {
    currentQuizIdx = 0;
    quizScore = 0;
    renderFinalQuiz();
}

function renderFinalQuiz() {
    if (currentQuizIdx >= finalQuizData.length) {
        // 퀴즈 종료 -> 브릿지 이동
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
        btn.onclick = () => checkFinalAnswer(idx, btn);
        optionsDiv.appendChild(btn);
    });
}

function checkFinalAnswer(selectedIndex, btn) {
    const data = finalQuizData[currentQuizIdx];
    const opts = document.querySelectorAll('.option-btn');
    
    // 클릭 막기
    opts.forEach(o => o.style.pointerEvents = 'none');

    if (selectedIndex === data.a) {
        btn.classList.add('correct');
        quizScore++;
    } else {
        btn.classList.add('wrong');
        opts[data.a].classList.add('correct'); // 정답 보여주기
    }

    // 1초 뒤 다음 문제
    setTimeout(() => {
        currentQuizIdx++;
        renderFinalQuiz();
    }, 1000);
}

