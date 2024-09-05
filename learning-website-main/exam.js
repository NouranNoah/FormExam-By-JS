class Quiz {
    constructor() {
        this.count = 0;
        this.data = [];
        this.answers = [];
        this.timerInterval = null;
        this.timeLeft = 60 * 15;
        this.flaggedIndices = new Set();
        this.currentQuestionIndex = 0;
        this.finish=0;

        this.nextButton = document.getElementById('next');
        this.preButton = document.getElementById('pre');
        this.submitButton = document.getElementById('submit');
        this.flagButton = document.getElementById('flag');
        this.side = document.getElementById('side');
        this.content = document.getElementById('content');
        this.timerDisplay = document.getElementById('timerDisplay');
        this.background = document.getElementById('backgroundTimer');
        this.trueAnswersButton = document.getElementById('trueAnswers');
        this.init();
    }

    async init() {
        await this.fetchData();
        this.addEventListeners();
    }

    async fetchData() {
        try {
            const response = await fetch('http://localhost:3000/data');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const allData = await response.json();
            // this.data = allData.slice(0, 4); 
            this.data = allData.sort(() => 0.5 - Math.random()).slice(0, 10); 
            this.startTimer();
            this.displayContent();
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    displayContent() {
        this.content.innerHTML = '';
        this.preButton.style.display = this.count !== 0 ? 'block' : 'none';
        this.nextButton.style.display = this.count === this.data.length - 1 ? 'none' : 'block';
        this.submitButton.style.display = this.count === this.data.length - 1 ? 'block' : 'none';

        if (this.count < this.data.length) {
            const question = this.data[this.count];
            const selectedAnswerIndex = this.answers[this.count];
            const div = document.createElement('div');
            div.style.width = '80%';
            div.innerHTML = `
                <h2 style="text-align: center;">${this.count + 1}) ${question.Q}</h2>
                <ul>
                    ${question.Choices.map((choice, index) => `
                        <li>
                            <div class="choice-button" data-index="${index}" style="${index === selectedAnswerIndex ? 'background-color: white; border-left: 7px solid #00796b' : ''}">
                                ${choice.text}
                            </div>
                        </li>
                    `).join('')}
                </ul>
            `;

            this.content.appendChild(div);
            this.addChoiceButtonListeners();
        } else {
            this.content.innerHTML = '<p>No more data to display.</p>';
        }
    }

    addChoiceButtonListeners() {
        document.querySelectorAll('.choice-button').forEach((button) => {
            button.addEventListener('click', (event) => {
                const index = parseInt(event.target.getAttribute('data-index'), 10);
                this.selectChoice(index);
            });
        });
    }

    selectChoice(index) {
        const choiceButtons = document.querySelectorAll('.choice-button');
        choiceButtons.forEach(button => {
            button.style.backgroundColor = '';
            button.style.borderLeft = '';
        });

        const selectedButton = document.querySelector(`.choice-button[data-index="${index}"]`);
        selectedButton.style.backgroundColor = 'white';
        selectedButton.style.borderLeft = '7px solid #00796b';
        this.answers[this.count] = index;
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            if (this.timeLeft < 0) {
                clearInterval(this.timerInterval);
                alert('Time is up!');
                this.submitButton.style.display = 'none'; 
                this.nextButton.style.display = 'none';
                this.result();
                return;
            }
            this.updateTimerDisplay();
            this.timeLeft--;

            const percentage = (this.timeLeft / (60 * 15)) * 100; 
            this.background.style.width = `${percentage}%`;
        }, 1000);
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    result() {
        const correctAnswers = this.answers.filter((index, i) => this.data[i].Choices[index]?.correct).length;
        this.content.innerHTML = '';
        const div = document.createElement('div');
        div.classList.add('cardResult');

        if (correctAnswers === this.data.length) {
            div.innerHTML = `
                <h2>The Result</h2>
                <h3 class="perfect-score">Excellent! You got ${correctAnswers} out of ${this.data.length} correct!</h3>
            `;

            div.classList.add('animate-perfect-score');
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
            });
        } else if (correctAnswers === 0) {
            div.innerHTML = `
                <h2>The Result</h2>
                <h3>Unfortunately, you didn't get any correct answers. Better luck next time!</h3>
            `;
        } else {
            div.innerHTML = `
                <h2>The Result</h2>
                <h3>You got ${correctAnswers} out of ${this.data.length} correct!</h3>
            `;
        }

        this.content.appendChild(div);
        clearInterval(this.timerInterval);

        this.preButton.style.display = 'none';
        this.nextButton.style.display = 'none';
        this.submitButton.style.display = 'none';
        this.flagButton.style.display = 'none';
        this.side.style.display = 'none';
        this.trueAnswersButton.style.display = 'block';
    }

    addEventListeners() {
        this.trueAnswersButton.addEventListener('click', () => {
            this.AnswerFetch();
        });

        this.nextButton.addEventListener('click', () => { 
            if(this.count<this.data.length-1){
                this.count++;
                this.displayContent();
            }
            else{
                this.currentQuestionIndex++;
                this.AnswerFetch();
                this.finish=1;
            }
        });

        this.preButton.addEventListener('click', () => {
            if (this.count > 0&& this.finish==0) {
                this.count--;
                this.displayContent();
            }
            else{
                this.currentQuestionIndex--;
                this.AnswerFetch();
            }
        });

        this.submitButton.addEventListener('click', () => {
            this.result();
        });

        this.flagButton.addEventListener('click', () => {
            this.getFlag(this.count);
        });

        document.getElementById('toggleSide').addEventListener('click', () => {
            this.toggleSidebar();
        });
    }

    

    AnswerFetch() {
        this.content.innerHTML = '';
        
        this.preButton.style.display = this.currentQuestionIndex > 0 ? 'block' : 'none';
        this.nextButton.style.display = this.currentQuestionIndex < this.data.length - 1 ? 'block' : 'none';
        this.submitButton.style.display = 'none';
        this.trueAnswersButton.style.display = 'none';

        if (this.currentQuestionIndex >= 0 && this.currentQuestionIndex < this.data.length) {
            const question = this.data[this.currentQuestionIndex];
            const selectedAnswerIndex = this.answers[this.currentQuestionIndex];
            const div = document.createElement('div');
            div.style.width = '80%';

            div.innerHTML = `
                <h2 style="text-align: center;">${this.currentQuestionIndex + 1}) ${question.Q}</h2>
                <ul>
                    ${question.Choices.map((choice, index) => {
                        let backgroundColor = '';
                        if (choice.correct) {
                            backgroundColor = 'lightgreen';
                        } else if (index === selectedAnswerIndex) {
                            backgroundColor = 'red';
                        }
                        return `
                            <li>
                                <div class="choice-button" data-index="${index}" style="background-color: ${backgroundColor};">
                                    ${choice.text}
                                </div>
                            </li>
                        `;
                    }).join('')}
                </ul>
            `;

            this.content.appendChild(div);
            this.addChoiceButtonListeners();
        } else {
            this.content.innerHTML = '<p>No more data to display.</p>';
        }
    }
    
    getFlag(index) {
        const ul = document.getElementById('ulFlag');
    
        if (this.flaggedIndices.has(index)) {
            this.flaggedIndices.delete(index);
            this.flagButton.style.backgroundColor = '#00796b'; 
    
            const items = ul.getElementsByTagName('li');
            for (let i = 0; i < items.length; i++) {
                if (parseInt(items[i].getAttribute('data-index')) === index) {
                    ul.removeChild(items[i]);
                    break;
                }
            }
        } else {
            this.flaggedIndices.add(index);
            this.flagButton.style.backgroundColor = '#004d40'; 
            const li = document.createElement('li');
            li.textContent = `Question ${index + 1}`;
            li.setAttribute('data-index', index);
            li.addEventListener('click', () => {
                this.count = index;
                this.displayContent();
            });
    
            ul.appendChild(li);
        }
    }
    
    toggleSidebar() {
        if (this.side.classList.contains('open')) {
            this.side.classList.remove('open');
        } else {
            this.side.classList.add('open');
        }
    }
}


document.addEventListener('DOMContentLoaded', () => {
    new Quiz();
});
